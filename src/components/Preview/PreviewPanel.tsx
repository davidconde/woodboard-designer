import { useState } from 'react';
import { BoardPreview } from './BoardPreview';
import { BoardDimensions } from './BoardDimensions';
import { CalculationsPanel } from './CalculationsPanel';
import styles from './PreviewPanel.module.css';

type Tab = 'preview' | 'calculations';

export function PreviewPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('preview');

  return (
    <div className={styles.panel}>
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'preview' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'calculations' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('calculations')}
        >
          Calculations
        </button>
      </div>
      {activeTab === 'preview' ? (
        <>
          <BoardPreview />
          <BoardDimensions />
        </>
      ) : (
        <CalculationsPanel />
      )}
    </div>
  );
}
