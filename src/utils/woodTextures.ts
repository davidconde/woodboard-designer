import type { WoodId } from '../types';
import { WOOD_LIST, TEXTURE_CONFIGS } from '../data/woods';
import { generateWoodTexture, generateEndGrainTexture } from './woodTexture';

/** Pre-generated edge grain texture data URLs, keyed by WoodId */
export const EDGE_TEXTURES: Record<WoodId, string> = {} as Record<WoodId, string>;

/** Pre-generated end grain texture data URLs, keyed by WoodId */
export const END_TEXTURES: Record<WoodId, string> = {} as Record<WoodId, string>;

for (const wood of WOOD_LIST) {
  const config = TEXTURE_CONFIGS[wood.id];
  EDGE_TEXTURES[wood.id] = generateWoodTexture(config);
  END_TEXTURES[wood.id] = generateEndGrainTexture(config);
}
