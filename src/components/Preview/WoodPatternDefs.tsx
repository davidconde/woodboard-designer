import { EDGE_TEXTURES, END_TEXTURES } from '../../utils/woodTextures';
import { TEXTURE_SIZE } from '../../utils/woodTexture';
import type { BoardLayer, GrainType } from '../../types';

interface WoodPatternDefsProps {
  layers: BoardLayer[];
  grainType: GrainType;
}

export function WoodPatternDefs({ layers, grainType }: WoodPatternDefsProps) {
  const textures = grainType === 'end' ? END_TEXTURES : EDGE_TEXTURES;

  return (
    <defs>
      {layers.map((layer, i) => {
        const textureUrl = textures[layer.woodId];
        // Offset each strip's pattern so same-wood strips look distinct
        const yOffset = ((i * 137) % TEXTURE_SIZE);
        return (
          <pattern
            key={layer.id}
            id={`wood-${layer.id}`}
            patternUnits="userSpaceOnUse"
            width={TEXTURE_SIZE}
            height={TEXTURE_SIZE}
            patternTransform={`translate(0, ${yOffset})`}
          >
            <image
              href={textureUrl}
              width={TEXTURE_SIZE}
              height={TEXTURE_SIZE}
            />
          </pattern>
        );
      })}
    </defs>
  );
}
