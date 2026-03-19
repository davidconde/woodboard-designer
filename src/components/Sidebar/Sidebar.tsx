import { useState } from 'react';
import { WoodPalette } from '../WoodPalette/WoodPalette';
import { LayerList } from '../LayerList/LayerList';
import { BoardSettings } from '../BoardSettings/BoardSettings';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <button
        className={styles.toggleBtn}
        onClick={() => setCollapsed(!collapsed)}
      >
        Board Settings
        <span className={`${styles.toggleIcon} ${!collapsed ? styles.open : ''}`}>
          &#9660;
        </span>
      </button>
      <div className={styles.content}>
        <BoardSettings />
        <WoodPalette />
        <LayerList />
      </div>
    </aside>
  );
}
