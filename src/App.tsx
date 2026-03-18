import { BoardProvider } from './context/BoardContext';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { PreviewPanel } from './components/Preview/PreviewPanel';
import styles from './App.module.css';

function App() {
  return (
    <BoardProvider>
      <div className={styles.app}>
        <Header />
        <div className={styles.main}>
          <Sidebar />
          <PreviewPanel />
        </div>
      </div>
    </BoardProvider>
  );
}

export default App;
