import type { BoardLayer, WoodId } from '../types';
import { WOOD_SPECIES } from '../data/woods';

export interface WoodRequirement {
  woodId: WoodId;
  woodName: string;
  stripCount: number;
  boardHeightCm: number;
  linearMaterialCm: number;
  cuts: number;
  kerfWasteCm: number;
  totalMaterialCm: number;
}

export interface BoardCalculation {
  requirements: WoodRequirement[];
  totalStripCount: number;
  totalKerfWasteCm: number;
  totalMaterialCm: number;
}

export function calculateBoardRequirements(
  layers: BoardLayer[],
  boardHeightCm: number,
  bladeKerfCm: number,
): BoardCalculation {
  const kerf = bladeKerfCm || 0;
  const height = boardHeightCm || 0;
  const grouped = new Map<WoodId, number>();

  for (const layer of layers) {
    grouped.set(layer.woodId, (grouped.get(layer.woodId) ?? 0) + 1);
  }

  const requirements: WoodRequirement[] = [];

  for (const [woodId, stripCount] of grouped) {
    const linearMaterialCm = stripCount * height;
    const cuts = stripCount - 1;
    const kerfWasteCm = cuts * kerf;
    const totalMaterialCm = linearMaterialCm + kerfWasteCm;

    requirements.push({
      woodId,
      woodName: WOOD_SPECIES[woodId].name,
      stripCount,
      boardHeightCm: height,
      linearMaterialCm,
      cuts,
      kerfWasteCm,
      totalMaterialCm,
    });
  }

  return {
    requirements,
    totalStripCount: layers.length,
    totalKerfWasteCm: requirements.reduce((sum, r) => sum + r.kerfWasteCm, 0),
    totalMaterialCm: requirements.reduce((sum, r) => sum + r.totalMaterialCm, 0),
  };
}
