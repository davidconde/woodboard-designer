import type { WoodSpecies } from '../../types';
import { WOOD_TEXTURES } from '../../utils/woodTextures';
import { TEXTURE_SIZE } from '../../utils/woodTexture';
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
          <pattern
            id={`swatch-pat-${wood.id}`}
            patternUnits="userSpaceOnUse"
            width={TEXTURE_SIZE}
            height={TEXTURE_SIZE}
          >
            <image
              href={WOOD_TEXTURES[wood.id]}
              width={TEXTURE_SIZE}
              height={TEXTURE_SIZE}
            />
          </pattern>
        </defs>
        <rect
          width="48"
          height="48"
          rx="4"
          fill={`url(#swatch-pat-${wood.id})`}
        />
      </svg>
      <span className={styles.swatchLabel}>{wood.name}</span>
    </button>
  );
}
