import { WOOD_TEXTURES } from '../../utils/woodTextures';
import { TEXTURE_SIZE } from '../../utils/woodTexture';
import type { BoardLayer } from '../../types';

interface WoodPatternDefsProps {
  layers: BoardLayer[];
}

export function WoodPatternDefs({ layers }: WoodPatternDefsProps) {
  // Create a unique pattern per layer so adjacent same-species strips
  // show different grain (offset by layer index)
  return (
    <defs>
      {layers.map((layer, i) => {
        const textureUrl = WOOD_TEXTURES[layer.woodId];
        // Offset each strip's pattern vertically so same-wood strips look distinct
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
