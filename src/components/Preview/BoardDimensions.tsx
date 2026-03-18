import { useBoard } from '../../context/BoardContext';
import { totalBoardWidthCm, cmToDisplay, unitLabel } from '../../utils/scale';
import { computeEndGrainSlices } from '../../utils/endGrain';
import styles from './PreviewPanel.module.css';

export function BoardDimensions() {
  const { state } = useBoard();
  const widthCm = totalBoardWidthCm(state.layers);

  if (state.layers.length === 0) return null;

  const u = unitLabel(state.units);
  const displayWidth = cmToDisplay(widthCm, state.units).toFixed(1);

  const isEndGrain = state.grainType === 'end';
  const numSlices = isEndGrain
    ? computeEndGrainSlices(state.boardHeightCm, state.boardThicknessCm, state.bladeKerfCm)
    : 0;
  const finalHeightCm = isEndGrain
    ? numSlices * state.boardThicknessCm
    : state.boardHeightCm;
  const displayHeight = cmToDisplay(finalHeightCm, state.units).toFixed(1);

  return (
    <div className={styles.dimensions}>
      {displayWidth} {u} wide &times; {displayHeight} {u} tall
      &nbsp;&middot;&nbsp; {state.layers.length} strip{state.layers.length !== 1 ? 's' : ''}
      {isEndGrain && <> &middot; {numSlices} slice{numSlices !== 1 ? 's' : ''}</>}
    </div>
  );
}
