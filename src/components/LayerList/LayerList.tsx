import { useBoard } from '../../context/BoardContext';
import { displayToCm } from '../../utils/scale';
import { LayerItem } from './LayerItem';
import styles from './LayerList.module.css';

export function LayerList() {
  const { state, dispatch } = useBoard();

  return (
    <div>
      <div className={styles.header}>
        <h3 className={styles.heading}>
          Strips ({state.layers.length})
        </h3>
        <button
          className={styles.addBtn}
          onClick={() =>
            dispatch({
              type: 'ADD_LAYER',
              woodId: state.selectedWoodId,
              widthCm: displayToCm(state.units === 'in' ? 1 : 2, state.units),
            })
          }
        >
          + Add Strip
        </button>
      </div>
      <div className={styles.list}>
        {state.layers.length === 0 && (
          <p className={styles.empty}>
            No strips yet. Select a wood type above and add a strip.
          </p>
        )}
        {state.layers.map((layer, i) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            index={i}
            total={state.layers.length}
          />
        ))}
      </div>
    </div>
  );
}
