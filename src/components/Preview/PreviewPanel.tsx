import { useState } from 'react';
import { BoardPreview3D } from './BoardPreview3D';
import { BoardDimensions } from './BoardDimensions';
import { CalculationsPanel } from './CalculationsPanel';
import { GuidePanel } from './GuidePanel';
import styles from './PreviewPanel.module.css';

type Tab = 'preview' | 'calculations' | 'guide';

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
        <button
          className={`${styles.tab} ${activeTab === 'guide' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          Guide
        </button>
      </div>
      {activeTab === 'preview' ? (
        <>
          <BoardPreview3D />
          <BoardDimensions />
        </>
      ) : activeTab === 'calculations' ? (
        <CalculationsPanel />
      ) : (
        <GuidePanel />
      )}
    </div>
  );
}
