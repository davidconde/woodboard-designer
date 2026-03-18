import { useRef } from 'react';
import { useBoard } from '../../context/BoardContext';
import { exportBoard, importBoard } from '../../utils/boardFile';
import styles from './Header.module.css';

export function Header() {
  const { state, dispatch } = useBoard();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => exportBoard(state);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const board = await importBoard(file);
      dispatch({ type: 'LOAD_BOARD', state: board });
    } catch (err) {
      alert((err as Error).message);
    }
    // Reset so the same file can be re-imported
    e.target.value = '';
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Board Maker</h1>
      <span className={styles.subtitle}>Cutting Board Designer</span>
      <div className={styles.spacer} />
      <button className={styles.btn} onClick={() => fileInputRef.current?.click()}>
        Load
      </button>
      <button className={styles.btn} onClick={handleExport}>
        Save
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className={styles.hiddenInput}
      />
    </header>
  );
}
