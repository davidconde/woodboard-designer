import { createNoiseGrid, fractalNoise } from './noise';

export interface WoodTextureConfig {
  seed: number;
  lightColor: [number, number, number];
  darkColor: [number, number, number];
  /** How many grain lines across the texture (higher = finer grain) */
  grainCount: number;
  /** How much noise distorts the grain lines (0-5) */
  grainWaviness: number;
  /** Visibility of the grain pattern (0-1) */
  grainContrast: number;
  /** How much fine-grain noise adds texture (0-0.3) */
  textureStrength: number;
  /** Medullary ray strength for oak/ash (0-1, 0 = none) */
  rayStrength: number;
  /** Zebrawood-style stripe overlay */
  stripes?: {
    frequency: number;
    contrast: number;
    darkColor: [number, number, number];
  };
}

const GRID_SIZE = 64;
const TEXTURE_SIZE = 512;

function clamp(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export function generateWoodTexture(config: WoodTextureConfig): string {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(TEXTURE_SIZE, TEXTURE_SIZE);
  const data = imageData.data;

  const grainGrid = createNoiseGrid(GRID_SIZE, config.seed);
  const fineGrid = createNoiseGrid(GRID_SIZE, config.seed + 1000);
  const rayGrid = createNoiseGrid(GRID_SIZE, config.seed + 2000);

  // Grain frequency: ensure integer cycles for seamless X tiling
  const cycles = Math.max(1, Math.round(config.grainCount));
  const grainFreq = (cycles * Math.PI * 2) / TEXTURE_SIZE;

  for (let y = 0; y < TEXTURE_SIZE; y++) {
    for (let x = 0; x < TEXTURE_SIZE; x++) {
      // Elongated noise - stretched heavily in Y for vertical grain
      const grainNoise = fractalNoise(grainGrid, GRID_SIZE, x * 0.06, y * 0.006, 4);

      // Growth ring pattern
      const ringVal = Math.sin(x * grainFreq + grainNoise * config.grainWaviness * 8);

      // Normalize to 0-1
      const t = (ringVal + 1) * 0.5;

      // Mix contrast: blend between midpoint and full range
      const mixT = 0.5 + (t - 0.5) * config.grainContrast;
      let [r, g, b] = lerpColor(config.darkColor, config.lightColor, mixT);

      // Fine texture noise
      const fine = (fractalNoise(fineGrid, GRID_SIZE, x * 0.15, y * 0.15, 3) - 0.5) * 2;
      r += fine * config.textureStrength * 80;
      g += fine * config.textureStrength * 80;
      b += fine * config.textureStrength * 80;

      // Medullary rays (short horizontal streaks)
      if (config.rayStrength > 0) {
        const rayNoise = fractalNoise(rayGrid, GRID_SIZE, x * 0.005, y * 0.15, 2);
        const rayThreshold = 1 - config.rayStrength * 0.3;
        if (rayNoise > rayThreshold) {
          const rayIntensity = (rayNoise - rayThreshold) / (1 - rayThreshold);
          const brighten = rayIntensity * config.rayStrength * 40;
          r += brighten;
          g += brighten;
          b += brighten * 0.6;
        }
      }

      // Zebrawood-style stripes
      if (config.stripes) {
        const stripeNoise = fractalNoise(grainGrid, GRID_SIZE, x * 0.04, y * 0.003, 3);
        const stripeVal = Math.sin(
          x * config.stripes.frequency * 0.08 + stripeNoise * 6,
        );
        if (stripeVal > 0.2) {
          const stripeT = (stripeVal - 0.2) / 0.8;
          const st = stripeT * config.stripes.contrast;
          r = r * (1 - st) + config.stripes.darkColor[0] * st;
          g = g * (1 - st) + config.stripes.darkColor[1] * st;
          b = b * (1 - st) + config.stripes.darkColor[2] * st;
        }
      }

      const idx = (y * TEXTURE_SIZE + x) * 4;
      data[idx] = clamp(r);
      data[idx + 1] = clamp(g);
      data[idx + 2] = clamp(b);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.88);
}

export function generateEndGrainTexture(config: WoodTextureConfig): string {
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(TEXTURE_SIZE, TEXTURE_SIZE);
  const data = imageData.data;

  const ringGrid = createNoiseGrid(GRID_SIZE, config.seed + 3000);
  const fineGrid = createNoiseGrid(GRID_SIZE, config.seed + 4000);
  const poreGrid = createNoiseGrid(GRID_SIZE, config.seed + 5000);

  // Growth ring center — offset so we see partial arcs, not full circles
  const cx = TEXTURE_SIZE * 0.3;
  const cy = TEXTURE_SIZE * -0.2;

  // Ring frequency based on grain count
  const ringFreq = config.grainCount * 0.12;

  for (let y = 0; y < TEXTURE_SIZE; y++) {
    for (let x = 0; x < TEXTURE_SIZE; x++) {
      // Distance from ring center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Noise to distort the rings (makes them less perfectly circular)
      const distortNoise = fractalNoise(ringGrid, GRID_SIZE, x * 0.03, y * 0.03, 4);

      // Growth ring pattern — concentric arcs
      const ringVal = Math.sin(
        (dist + distortNoise * config.grainWaviness * 60) * ringFreq * 0.1,
      );

      // Normalize to 0-1
      const t = (ringVal + 1) * 0.5;

      // Mix contrast
      const mixT = 0.5 + (t - 0.5) * config.grainContrast * 0.8;
      let [r, g, b] = lerpColor(config.darkColor, config.lightColor, mixT);

      // Fine texture noise (more isotropic than edge grain — not stretched)
      const fine = (fractalNoise(fineGrid, GRID_SIZE, x * 0.12, y * 0.12, 3) - 0.5) * 2;
      r += fine * config.textureStrength * 60;
      g += fine * config.textureStrength * 60;
      b += fine * config.textureStrength * 60;

      // Pore dots — small dark specks visible on end grain
      const poreNoise = fractalNoise(poreGrid, GRID_SIZE, x * 0.4, y * 0.4, 2);
      const poreThreshold = 0.72 - config.rayStrength * 0.15; // more pores for open-grain woods
      if (poreNoise > poreThreshold) {
        const poreIntensity = (poreNoise - poreThreshold) / (1 - poreThreshold);
        const darken = poreIntensity * 30;
        r -= darken;
        g -= darken;
        b -= darken;
      }

      // Zebrawood end grain: alternating light/dark ring bands
      if (config.stripes) {
        const stripeRingVal = Math.sin(
          (dist + distortNoise * 40) * config.stripes.frequency * 0.04,
        );
        if (stripeRingVal > 0.15) {
          const st = ((stripeRingVal - 0.15) / 0.85) * config.stripes.contrast;
          r = r * (1 - st) + config.stripes.darkColor[0] * st;
          g = g * (1 - st) + config.stripes.darkColor[1] * st;
          b = b * (1 - st) + config.stripes.darkColor[2] * st;
        }
      }

      const idx = (y * TEXTURE_SIZE + x) * 4;
      data[idx] = clamp(r);
      data[idx + 1] = clamp(g);
      data[idx + 2] = clamp(b);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.88);
}

export { TEXTURE_SIZE };
