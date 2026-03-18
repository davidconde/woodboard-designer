import { useBoard } from '../../context/BoardContext';
import { calculateBoardRequirements } from '../../utils/calculations';
import { WOOD_SPECIES } from '../../data/woods';
import { cmToDisplay, unitLabel } from '../../utils/scale';
import styles from './CalculationsPanel.module.css';

export function CalculationsPanel() {
  const { state } = useBoard();
  const calc = calculateBoardRequirements(
    state.layers,
    state.boardHeightCm,
    state.bladeKerfCm,
    state.grainType,
    state.boardThicknessCm,
  );
  const u = unitLabel(state.units);

  const fmt = (cm: number) => cmToDisplay(cm, state.units).toFixed(1);

  if (calc.requirements.length === 0) {
    return (
      <div className={styles.empty}>
        Add strips to see material calculations.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.kerfNote}>
        Blade kerf: {fmt(state.bladeKerfCm)} {u}
        {state.grainType === 'end' && <> &middot; End grain mode</>}
      </div>

      <h3 className={styles.sectionTitle}>Rip Cuts (strips)</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Wood</th>
            <th>Strips</th>
            <th>Cuts</th>
            <th>Material</th>
            <th>Kerf Waste</th>
            <th>Total Needed</th>
          </tr>
        </thead>
        <tbody>
          {calc.requirements.map((req) => (
            <tr key={req.woodId}>
              <td className={styles.woodCell}>
                <span
                  className={styles.dot}
                  style={{ backgroundColor: WOOD_SPECIES[req.woodId].baseColor }}
                />
                {req.woodName}
              </td>
              <td>{req.stripCount}</td>
              <td>{req.cuts}</td>
              <td>{fmt(req.linearMaterialCm)} {u}</td>
              <td>{fmt(req.kerfWasteCm)} {u}</td>
              <td className={styles.totalCell}>{fmt(req.totalMaterialCm)} {u}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={styles.summaryRow}>
            <td>Rip total</td>
            <td>{calc.totalStripCount}</td>
            <td></td>
            <td></td>
            <td>{fmt(calc.totalKerfWasteCm)} {u}</td>
            <td className={styles.totalCell}>{fmt(calc.totalMaterialCm)} {u}</td>
          </tr>
        </tfoot>
      </table>

      {calc.crosscut && (
        <>
          <h3 className={styles.sectionTitle}>Crosscuts (end grain slices)</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Slices</th>
                <th>Crosscuts</th>
                <th>Board Width</th>
                <th>Waste / Cut</th>
                <th>Total Crosscut Waste</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{calc.crosscut.numSlices}</td>
                <td>{calc.crosscut.crosscuts}</td>
                <td>{fmt(calc.crosscut.boardWidthCm)} {u}</td>
                <td>{fmt(calc.crosscut.wastePerCutCm)} {u}</td>
                <td className={styles.totalCell}>
                  {fmt(calc.crosscut.totalCrosscutWasteCm)} {u}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      <div className={styles.grandTotal}>
        Total waste: {fmt(calc.grandTotalWasteCm)} {u}
      </div>
    </div>
  );
}
