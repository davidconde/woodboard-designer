import type { BoardLayer, GrainType, WoodId } from '../types';
import { WOOD_SPECIES } from '../data/woods';
import { computeEndGrainSlices } from './endGrain';

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

export interface CrosscutInfo {
  numSlices: number;
  crosscuts: number;
  boardWidthCm: number;
  wastePerCutCm: number;
  totalCrosscutWasteCm: number;
}

export interface BoardCalculation {
  requirements: WoodRequirement[];
  totalStripCount: number;
  totalKerfWasteCm: number;
  totalMaterialCm: number;
  crosscut: CrosscutInfo | null;
  grandTotalWasteCm: number;
}

export function calculateBoardRequirements(
  layers: BoardLayer[],
  boardHeightCm: number,
  bladeKerfCm: number,
  grainType: GrainType = 'edge',
  boardThicknessCm: number = 2,
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

  const totalRipWaste = requirements.reduce((sum, r) => sum + r.kerfWasteCm, 0);
  const totalMaterial = requirements.reduce((sum, r) => sum + r.totalMaterialCm, 0);

  // End grain crosscut calculations
  let crosscut: CrosscutInfo | null = null;
  let crosscutWaste = 0;

  if (grainType === 'end' && layers.length > 0) {
    const numSlices = computeEndGrainSlices(height, boardThicknessCm, kerf);
    const crosscuts = Math.max(0, numSlices - 1);
    const boardWidthCm = layers.reduce((sum, l) => sum + l.widthCm, 0);
    const wastePerCutCm = kerf * boardWidthCm;
    crosscutWaste = crosscuts * wastePerCutCm;

    crosscut = {
      numSlices,
      crosscuts,
      boardWidthCm,
      wastePerCutCm,
      totalCrosscutWasteCm: crosscutWaste,
    };
  }

  return {
    requirements,
    totalStripCount: layers.length,
    totalKerfWasteCm: totalRipWaste,
    totalMaterialCm: totalMaterial,
    crosscut,
    grandTotalWasteCm: totalRipWaste + crosscutWaste,
  };
}
