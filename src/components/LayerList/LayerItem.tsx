import type { BoardLayer, WoodId } from '../../types';
import { WOOD_SPECIES, WOOD_LIST } from '../../data/woods';
import { useBoard } from '../../context/BoardContext';
import { cmToDisplay, displayToCm, unitLabel } from '../../utils/scale';
import styles from './LayerList.module.css';

interface LayerItemProps {
  layer: BoardLayer;
  index: number;
  total: number;
}

export function LayerItem({ layer, index, total }: LayerItemProps) {
  const { state, dispatch } = useBoard();
  const wood = WOOD_SPECIES[layer.woodId];
  const displayWidth = Math.round(cmToDisplay(layer.widthCm, state.units) * 100) / 100;

  return (
    <div className={styles.item}>
      <div
        className={styles.colorDot}
        style={{ backgroundColor: wood.baseColor }}
      />
      <select
        className={styles.woodSelect}
        value={layer.woodId}
        onChange={(e) =>
          dispatch({
            type: 'UPDATE_LAYER_WOOD',
            layerId: layer.id,
            woodId: e.target.value as WoodId,
          })
        }
      >
        {WOOD_LIST.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
      <div className={styles.widthInput}>
        <input
          type="number"
          min={state.units === 'in' ? 0.25 : 0.5}
          max={state.units === 'in' ? 12 : 30}
          step={state.units === 'in' ? 0.25 : 0.5}
          value={displayWidth}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val > 0) {
              dispatch({
                type: 'UPDATE_LAYER_WIDTH',
                layerId: layer.id,
                widthCm: displayToCm(val, state.units),
              });
            }
          }}
        />
        <span className={styles.unit}>{unitLabel(state.units)}</span>
      </div>
      <div className={styles.actions}>
        <button
          onClick={() =>
            dispatch({ type: 'MOVE_LAYER', layerId: layer.id, direction: 'up' })
          }
          disabled={index === 0}
          title="Move left"
        >
          &larr;
        </button>
        <button
          onClick={() =>
            dispatch({
              type: 'MOVE_LAYER',
              layerId: layer.id,
              direction: 'down',
            })
          }
          disabled={index === total - 1}
          title="Move right"
        >
          &rarr;
        </button>
        <button
          onClick={() =>
            dispatch({ type: 'REMOVE_LAYER', layerId: layer.id })
          }
          className={styles.deleteBtn}
          title="Remove"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
