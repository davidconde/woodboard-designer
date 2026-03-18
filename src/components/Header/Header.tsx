import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Board Maker</h1>
      <span className={styles.subtitle}>Cutting Board Designer</span>
    </header>
  );
}
