import { useRef, useEffect, useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { totalBoardWidthCm } from '../../utils/scale';
import { WoodFilterDefs } from './WoodFilterDefs';
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
  const heightCm = state.boardHeightCm;

  if (totalWidthCm === 0) {
    return (
      <div ref={containerRef} className={styles.previewEmpty}>
        Add layers to see your board
      </div>
    );
  }

  const svgWidth = totalWidthCm * PX_PER_CM;
  const svgHeight = heightCm * PX_PER_CM;

  // Scale to fit container
  const scale = Math.min(containerWidth / svgWidth, 1);
  const displayWidth = svgWidth * scale;
  const displayHeight = svgHeight * scale;

  let xOffset = 0;

  return (
    <div ref={containerRef} className={styles.previewContainer}>
      <svg
        width={displayWidth}
        height={displayHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <WoodFilterDefs />
        {state.layers.map((layer) => {
          const stripWidth = layer.widthCm * PX_PER_CM;
          const x = xOffset;
          xOffset += stripWidth;
          return (
            <g key={layer.id}>
              <BoardStrip
                x={x}
                width={stripWidth}
                height={svgHeight}
                woodId={layer.woodId}
              />
              {/* Glue line */}
              {x > 0 && (
                <line
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={svgHeight}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth={1}
                />
              )}
            </g>
          );
        })}
        {/* Border */}
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
