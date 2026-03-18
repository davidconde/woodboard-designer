import { useBoard } from '../../context/BoardContext';
import { totalBoardWidthCm, cmToDisplay, unitLabel } from '../../utils/scale';
import styles from './PreviewPanel.module.css';

export function BoardDimensions() {
  const { state } = useBoard();
  const widthCm = totalBoardWidthCm(state.layers);

  if (state.layers.length === 0) return null;

  const u = unitLabel(state.units);
  const displayWidth = cmToDisplay(widthCm, state.units).toFixed(1);
  const displayHeight = cmToDisplay(state.boardHeightCm, state.units).toFixed(1);

  return (
    <div className={styles.dimensions}>
      {displayWidth} {u} wide &times; {displayHeight} {u} tall
      &nbsp;&middot;&nbsp; {state.layers.length} strip{state.layers.length !== 1 ? 's' : ''}
    </div>
  );
}
