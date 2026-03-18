import { useBoard } from '../../context/BoardContext';
import { cmToDisplay, displayToCm, unitLabel } from '../../utils/scale';
import styles from './BoardSettings.module.css';

export function BoardSettings() {
  const { state, dispatch } = useBoard();
  const displayHeight = Math.round(cmToDisplay(state.boardHeightCm, state.units) * 100) / 100;
  const displayThickness = Math.round(cmToDisplay(state.boardThicknessCm, state.units) * 100) / 100;
  const displayKerf = Math.round(cmToDisplay(state.bladeKerfCm, state.units) * 1000) / 1000;

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
        <span>Board Type</span>
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${state.grainType === 'edge' ? styles.active : ''}`}
            onClick={() => state.grainType !== 'edge' && dispatch({ type: 'SET_GRAIN_TYPE', grainType: 'edge' })}
          >
            Edge Grain
          </button>
          <button
            className={`${styles.toggleBtn} ${state.grainType === 'end' ? styles.active : ''}`}
            onClick={() => state.grainType !== 'end' && dispatch({ type: 'SET_GRAIN_TYPE', grainType: 'end' })}
          >
            End Grain
          </button>
        </div>
      </label>
      {state.grainType === 'end' && (
        <label className={styles.checkField}>
          <input
            type="checkbox"
            checked={state.rotateEndGrain}
            onChange={(e) => dispatch({ type: 'SET_ROTATE_END_GRAIN', rotate: e.target.checked })}
          />
          <span>Rotate layers on end grain</span>
        </label>
      )}
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
      <label className={styles.field}>
        <span>Board Thickness</span>
        <div className={styles.inputGroup}>
          <input
            type="number"
            min={state.units === 'in' ? 0.4 : 1}
            max={state.units === 'in' ? 4 : 10}
            step={state.units === 'in' ? 0.25 : 0.5}
            value={displayThickness}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val) && val > 0) {
                const cm = displayToCm(val, state.units);
                dispatch({ type: 'SET_BOARD_THICKNESS', thicknessCm: cm });
              }
            }}
            onBlur={() => {
              if (!state.boardThicknessCm || state.boardThicknessCm < 1) {
                dispatch({ type: 'SET_BOARD_THICKNESS', thicknessCm: 1 });
              }
            }}
          />
          <span className={styles.unit}>{unitLabel(state.units)}</span>
        </div>
      </label>
      <label className={styles.field}>
        <span>Blade Kerf</span>
        <div className={styles.inputGroup}>
          <input
            type="number"
            min={0}
            max={state.units === 'in' ? 0.5 : 1}
            step={state.units === 'in' ? 0.005 : 0.1}
            value={displayKerf}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val) && val >= 0) {
                dispatch({ type: 'SET_BLADE_KERF', kerfCm: displayToCm(val, state.units) });
              }
            }}
          />
          <span className={styles.unit}>{unitLabel(state.units)}</span>
        </div>
      </label>
    </div>
  );
}
