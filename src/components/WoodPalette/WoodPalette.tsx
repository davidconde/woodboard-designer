import { WOOD_LIST } from '../../data/woods';
import { useBoard } from '../../context/BoardContext';
import { WoodSwatch } from './WoodSwatch';
import styles from './WoodPalette.module.css';

export function WoodPalette() {
  const { state, dispatch } = useBoard();

  return (
    <div>
      <h3 className={styles.heading}>Wood Types</h3>
      <div className={styles.grid}>
        {WOOD_LIST.map((wood) => (
          <WoodSwatch
            key={wood.id}
            wood={wood}
            selected={state.selectedWoodId === wood.id}
            onClick={() => dispatch({ type: 'SELECT_WOOD', woodId: wood.id })}
          />
        ))}
      </div>
    </div>
  );
}
