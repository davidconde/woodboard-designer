import { WoodPalette } from '../WoodPalette/WoodPalette';
import { LayerList } from '../LayerList/LayerList';
import { BoardSettings } from '../BoardSettings/BoardSettings';
import styles from './Sidebar.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <BoardSettings />
      <WoodPalette />
      <LayerList />
    </aside>
  );
}
