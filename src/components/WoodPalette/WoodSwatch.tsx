import type { WoodSpecies } from '../../types';
import styles from './WoodPalette.module.css';

interface WoodSwatchProps {
  wood: WoodSpecies;
  selected: boolean;
  onClick: () => void;
}

export function WoodSwatch({ wood, selected, onClick }: WoodSwatchProps) {
  return (
    <button
      className={`${styles.swatch} ${selected ? styles.swatchSelected : ''}`}
      onClick={onClick}
      title={wood.name}
    >
      <svg width="48" height="48" viewBox="0 0 48 48">
        <defs>
          <filter
            id={`swatch-${wood.id}`}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency={wood.grain.baseFrequency}
              numOctaves={wood.grain.numOctaves}
              seed={wood.grain.seed}
              stitchTiles="stitch"
            />
            <feColorMatrix type="matrix" values={wood.colorMatrix} />
          </filter>
        </defs>
        <rect
          width="48"
          height="48"
          rx="4"
          filter={`url(#swatch-${wood.id})`}
        />
      </svg>
      <span className={styles.swatchLabel}>{wood.name}</span>
    </button>
  );
}
