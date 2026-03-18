import type { WoodId } from '../types';
import { WOOD_LIST, TEXTURE_CONFIGS } from '../data/woods';
import { generateWoodTexture } from './woodTexture';

/** Pre-generated texture data URLs, keyed by WoodId */
export const WOOD_TEXTURES: Record<WoodId, string> = {} as Record<WoodId, string>;

for (const wood of WOOD_LIST) {
  WOOD_TEXTURES[wood.id] = generateWoodTexture(TEXTURE_CONFIGS[wood.id]);
}
