import { useRef, useEffect, useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { totalBoardWidthCm } from '../../utils/scale';
import { computeEndGrainSlices } from '../../utils/endGrain';
import { WoodPatternDefs } from './WoodPatternDefs';
import { BoardStrip } from './BoardStrip';
import styles from './PreviewPanel.module.css';

const PX_PER_CM = 20;

export function BoardPreview() {
  const { state } = useBoard();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const totalWidthCm = totalBoardWidthCm(state.layers);

  if (totalWidthCm === 0) {
    return (
      <div ref={containerRef} className={styles.previewEmpty}>
        Add layers to see your board
      </div>
    );
  }

  const isEndGrain = state.grainType === 'end';
  const numSlices = isEndGrain
    ? computeEndGrainSlices(state.boardHeightCm, state.boardThicknessCm, state.bladeKerfCm)
    : 0;
  const heightCm = isEndGrain
    ? numSlices * state.boardThicknessCm
    : state.boardHeightCm;

  if (heightCm === 0) {
    return (
      <div ref={containerRef} className={styles.previewEmpty}>
        Board too small for any slices
      </div>
    );
  }

  const svgWidth = totalWidthCm * PX_PER_CM;
  const svgHeight = heightCm * PX_PER_CM;

  const scale = Math.min(containerWidth / svgWidth, 1);
  const displayWidth = svgWidth * scale;
  const displayHeight = svgHeight * scale;

  return (
    <div ref={containerRef} className={styles.previewContainer}>
      <svg
        width={displayWidth}
        height={displayHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <WoodPatternDefs layers={state.layers} />
        {isEndGrain
          ? renderEndGrain(state, numSlices, svgWidth, svgHeight)
          : renderEdgeGrain(state, svgWidth, svgHeight)}
        <rect
          x={0}
          y={0}
          width={svgWidth}
          height={svgHeight}
          fill="none"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}

function renderEdgeGrain(
  state: ReturnType<typeof useBoard>['state'],
  _svgWidth: number,
  svgHeight: number,
) {
  let xOffset = 0;
  return state.layers.map((layer) => {
    const stripWidth = layer.widthCm * PX_PER_CM;
    const x = xOffset;
    xOffset += stripWidth;
    return (
      <g key={layer.id}>
        <BoardStrip x={x} width={stripWidth} height={svgHeight} layerId={layer.id} />
        {x > 0 && (
          <line
            x1={x} y1={0} x2={x} y2={svgHeight}
            stroke="rgba(0,0,0,0.15)" strokeWidth={1}
          />
        )}
      </g>
    );
  });
}

function renderEndGrain(
  state: ReturnType<typeof useBoard>['state'],
  numSlices: number,
  _svgWidth: number,
  _svgHeight: number,
) {
  const thicknessPx = state.boardThicknessCm * PX_PER_CM;
  const elements: JSX.Element[] = [];

  for (let row = 0; row < numSlices; row++) {
    const yPos = row * thicknessPx;
    const strips =
      state.rotateEndGrain && row % 2 === 1
        ? [...state.layers].reverse()
        : state.layers;

    let xOffset = 0;
    for (let col = 0; col < strips.length; col++) {
      const layer = strips[col];
      const stripWidth = layer.widthCm * PX_PER_CM;
      const x = xOffset;
      xOffset += stripWidth;

      elements.push(
        <BoardStrip
          key={`${row}-${col}`}
          x={x}
          y={yPos}
          width={stripWidth}
          height={thicknessPx}
          layerId={layer.id}
        />,
      );

      // Vertical glue line
      if (x > 0) {
        elements.push(
          <line
            key={`vline-${row}-${col}`}
            x1={x} y1={yPos} x2={x} y2={yPos + thicknessPx}
            stroke="rgba(0,0,0,0.15)" strokeWidth={1}
          />,
        );
      }
    }

    // Horizontal glue line between rows
    if (row > 0) {
      elements.push(
        <line
          key={`hline-${row}`}
          x1={0} y1={yPos} x2={xOffset} y2={yPos}
          stroke="rgba(0,0,0,0.15)" strokeWidth={1}
        />,
      );
    }
  }

  return elements;
}
