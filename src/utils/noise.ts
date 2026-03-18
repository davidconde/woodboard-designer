/** Seeded pseudo-random number generator (Mulberry32) */
export function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Create a 2D grid of random values that tiles seamlessly */
export function createNoiseGrid(size: number, seed: number): Float32Array {
  const rng = mulberry32(seed);
  const grid = new Float32Array(size * size);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = rng();
  }
  return grid;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Sample noise with bilinear interpolation and seamless wrapping */
export function sampleNoise(grid: Float32Array, size: number, x: number, y: number): number {
  // Wrap coordinates
  x = ((x % size) + size) % size;
  y = ((y % size) + size) % size;

  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = smoothstep(fx);
  const sy = smoothstep(fy);

  const nx = (ix + 1) % size;
  const ny = (iy + 1) % size;

  const v00 = grid[iy * size + ix];
  const v10 = grid[iy * size + nx];
  const v01 = grid[ny * size + ix];
  const v11 = grid[ny * size + nx];

  return lerp(lerp(v00, v10, sx), lerp(v01, v11, sx), sy);
}

/** Multi-octave fractal noise */
export function fractalNoise(
  grid: Float32Array,
  gridSize: number,
  x: number,
  y: number,
  octaves: number,
): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxAmplitude = 0;

  for (let i = 0; i < octaves; i++) {
    value += sampleNoise(grid, gridSize, x * frequency, y * frequency) * amplitude;
    maxAmplitude += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / maxAmplitude;
}
