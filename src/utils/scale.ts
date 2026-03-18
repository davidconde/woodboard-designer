import type { BoardLayer, Units } from '../types';

const CM_PER_INCH = 2.54;

export function totalBoardWidthCm(layers: BoardLayer[]): number {
  return layers.reduce((sum, layer) => sum + layer.widthCm, 0);
}

export function cmToDisplay(cm: number, units: Units): number {
  return units === 'in' ? cm / CM_PER_INCH : cm;
}

export function displayToCm(value: number, units: Units): number {
  return units === 'in' ? value * CM_PER_INCH : value;
}

export function unitLabel(units: Units): string {
  return units === 'in' ? 'in' : 'cm';
}
