/**
 * Compute the number of slices when crosscutting an edge grain board
 * into end grain pieces.
 */
export function computeEndGrainSlices(
  boardHeightCm: number,
  boardThicknessCm: number,
  bladeKerfCm: number,
): number {
  const height = boardHeightCm || 0;
  const thickness = boardThicknessCm || 1;
  const kerf = bladeKerfCm || 0;
  return Math.floor(height / (thickness + kerf));
}
