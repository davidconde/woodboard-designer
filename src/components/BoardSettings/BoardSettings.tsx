import { useBoard } from '../../context/BoardContext';
import { cmToDisplay, displayToCm, unitLabel } from '../../utils/scale';
import styles from './BoardSettings.module.css';

export function BoardSettings() {
  const { state, dispatch } = useBoard();
  const displayHeight = Math.round(cmToDisplay(state.boardHeightCm, state.units) * 100) / 100;

  return (
    <div className={styles.settings}>
      <h3 className={styles.heading}>Settings</h3>
      <label className={styles.field}>
        <span>Units</span>
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${state.units === 'cm' ? styles.active : ''}`}
            onClick={() => state.units !== 'cm' && dispatch({ type: 'TOGGLE_UNITS' })}
          >
            cm
          </button>
          <button
            className={`${styles.toggleBtn} ${state.units === 'in' ? styles.active : ''}`}
            onClick={() => state.units !== 'in' && dispatch({ type: 'TOGGLE_UNITS' })}
          >
            in
          </button>
        </div>
      </label>
      <label className={styles.field}>
        <span>Board Height</span>
        <div className={styles.inputGroup}>
          <input
            type="number"
            min={state.units === 'in' ? 4 : 10}
            max={state.units === 'in' ? 40 : 100}
            step={state.units === 'in' ? 0.5 : 1}
            value={displayHeight}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val) && val > 0) {
                dispatch({ type: 'SET_BOARD_HEIGHT', heightCm: displayToCm(val, state.units) });
              }
            }}
          />
          <span className={styles.unit}>{unitLabel(state.units)}</span>
        </div>
      </label>
    </div>
  );
}
