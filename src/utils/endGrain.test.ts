import { describe, it, expect } from 'vitest';
import { computeEndGrainSlices } from './endGrain';

describe('computeEndGrainSlices', () => {
  it('basic case: 30cm board, 2cm thickness, 0 kerf → 15 slices', () => {
    expect(computeEndGrainSlices(30, 2, 0)).toBe(15);
  });

  it('accounts for kerf: 30cm board, 2cm thickness, 0.2cm kerf', () => {
    // 30 / (2 + 0.2) = 30 / 2.2 = 13.636 → floor = 13
    expect(computeEndGrainSlices(30, 2, 0.2)).toBe(13);
  });

  it('returns 0 for empty board height', () => {
    expect(computeEndGrainSlices(0, 2, 0)).toBe(0);
  });

  it('handles thickness larger than height', () => {
    expect(computeEndGrainSlices(1, 5, 0)).toBe(0);
  });

  it('handles undefined/NaN inputs defensively', () => {
    expect(computeEndGrainSlices(NaN, 2, 0)).toBe(0);
    expect(computeEndGrainSlices(30, NaN, 0)).toBe(30);
    expect(computeEndGrainSlices(30, 2, NaN)).toBe(15);
  });

  it('exact division with no kerf', () => {
    expect(computeEndGrainSlices(20, 4, 0)).toBe(5);
  });

  it('exact division with kerf leaves no room for extra slice', () => {
    // 10 / (2 + 0.5) = 10 / 2.5 = 4
    expect(computeEndGrainSlices(10, 2, 0.5)).toBe(4);
  });
});
