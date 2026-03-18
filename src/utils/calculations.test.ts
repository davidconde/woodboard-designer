import { describe, it, expect } from 'vitest';
import { calculateBoardRequirements } from './calculations';
import type { BoardLayer } from '../types';

function layer(woodId: BoardLayer['woodId'], widthCm = 3): BoardLayer {
  return { id: `test-${Math.random()}`, woodId, widthCm };
}

describe('calculateBoardRequirements', () => {
  it('returns empty requirements for no layers', () => {
    const result = calculateBoardRequirements([], 30, 0.2);
    expect(result.requirements).toHaveLength(0);
    expect(result.totalStripCount).toBe(0);
    expect(result.totalKerfWasteCm).toBe(0);
    expect(result.totalMaterialCm).toBe(0);
  });

  it('single strip has 0 cuts and 0 kerf waste', () => {
    const result = calculateBoardRequirements([layer('walnut')], 30, 0.2);
    expect(result.requirements).toHaveLength(1);
    const req = result.requirements[0];
    expect(req.woodId).toBe('walnut');
    expect(req.stripCount).toBe(1);
    expect(req.linearMaterialCm).toBe(30);
    expect(req.cuts).toBe(0);
    expect(req.kerfWasteCm).toBe(0);
    expect(req.totalMaterialCm).toBe(30);
  });

  it('multiple strips of same wood: N-1 cuts with kerf', () => {
    const layers = [layer('walnut'), layer('walnut'), layer('walnut')];
    const result = calculateBoardRequirements(layers, 30, 0.2);
    expect(result.requirements).toHaveLength(1);
    const req = result.requirements[0];
    expect(req.stripCount).toBe(3);
    expect(req.linearMaterialCm).toBe(90);
    expect(req.cuts).toBe(2);
    expect(req.kerfWasteCm).toBeCloseTo(0.4);
    expect(req.totalMaterialCm).toBeCloseTo(90.4);
  });

  it('multiple wood types produce separate requirements', () => {
    const layers = [
      layer('walnut'),
      layer('maple'),
      layer('walnut'),
      layer('maple'),
      layer('cherry'),
    ];
    const result = calculateBoardRequirements(layers, 30, 0.2);
    expect(result.requirements).toHaveLength(3);

    const walnut = result.requirements.find((r) => r.woodId === 'walnut')!;
    expect(walnut.stripCount).toBe(2);
    expect(walnut.cuts).toBe(1);
    expect(walnut.linearMaterialCm).toBe(60);
    expect(walnut.kerfWasteCm).toBeCloseTo(0.2);
    expect(walnut.totalMaterialCm).toBeCloseTo(60.2);

    const maple = result.requirements.find((r) => r.woodId === 'maple')!;
    expect(maple.stripCount).toBe(2);
    expect(maple.cuts).toBe(1);

    const cherry = result.requirements.find((r) => r.woodId === 'cherry')!;
    expect(cherry.stripCount).toBe(1);
    expect(cherry.cuts).toBe(0);
    expect(cherry.kerfWasteCm).toBe(0);
  });

  it('kerf of 0 produces no waste', () => {
    const layers = [layer('walnut'), layer('walnut'), layer('walnut')];
    const result = calculateBoardRequirements(layers, 30, 0);
    const req = result.requirements[0];
    expect(req.cuts).toBe(2);
    expect(req.kerfWasteCm).toBe(0);
    expect(req.totalMaterialCm).toBe(90);
  });

  it('totals sum correctly across wood types', () => {
    const layers = [
      layer('walnut'),
      layer('walnut'),
      layer('maple'),
      layer('maple'),
      layer('maple'),
    ];
    const result = calculateBoardRequirements(layers, 20, 0.3);

    // walnut: 2 strips, 40cm linear, 1 cut, 0.3 kerf, 40.3 total
    // maple: 3 strips, 60cm linear, 2 cuts, 0.6 kerf, 60.6 total
    expect(result.totalStripCount).toBe(5);
    expect(result.totalKerfWasteCm).toBeCloseTo(0.9);
    expect(result.totalMaterialCm).toBeCloseTo(100.9);
  });

  it('includes correct wood name from species data', () => {
    const result = calculateBoardRequirements([layer('red-oak')], 30, 0.2);
    expect(result.requirements[0].woodName).toBe('Red Oak');
  });

  it('handles different board heights', () => {
    const result = calculateBoardRequirements([layer('walnut'), layer('walnut')], 50, 0.2);
    const req = result.requirements[0];
    expect(req.linearMaterialCm).toBe(100);
    expect(req.totalMaterialCm).toBeCloseTo(100.2);
  });
});
