import { BoardPreview } from './BoardPreview';
import { BoardDimensions } from './BoardDimensions';
import styles from './PreviewPanel.module.css';

export function PreviewPanel() {
  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Board Preview</h2>
      <BoardPreview />
      <BoardDimensions />
    </div>
  );
}
