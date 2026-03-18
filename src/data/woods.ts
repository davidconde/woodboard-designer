import type { WoodId, WoodSpecies } from '../types';

export const WOOD_SPECIES: Record<WoodId, WoodSpecies> = {
  cherry: {
    id: 'cherry',
    name: 'Cherry',
    baseColor: '#BB6633',
    grain: { baseFrequency: '0.015 0.4', numOctaves: 3, seed: 1 },
    colorMatrix: '0 0 0 0.11 0.69  0 0 0 0.09 0.38  0 0 0 0.08 0.14  0 0 0 0 1',
  },
  'red-oak': {
    id: 'red-oak',
    name: 'Red Oak',
    baseColor: '#C4893B',
    grain: { baseFrequency: '0.012 0.35', numOctaves: 4, seed: 2 },
    colorMatrix: '0 0 0 0.15 0.62  0 0 0 0.12 0.42  0 0 0 0.06 0.17  0 0 0 0 1',
  },
  maple: {
    id: 'maple',
    name: 'Maple',
    baseColor: '#E8D4A2',
    grain: { baseFrequency: '0.02 0.5', numOctaves: 2, seed: 3 },
    colorMatrix: '0 0 0 0.06 0.85  0 0 0 0.06 0.78  0 0 0 0.04 0.58  0 0 0 0 1',
  },
  walnut: {
    id: 'walnut',
    name: 'Walnut',
    baseColor: '#5C4033',
    grain: { baseFrequency: '0.013 0.38', numOctaves: 3, seed: 4 },
    colorMatrix: '0 0 0 0.12 0.28  0 0 0 0.08 0.19  0 0 0 0.06 0.15  0 0 0 0 1',
  },
  ebony: {
    id: 'ebony',
    name: 'Ebony',
    baseColor: '#2B1D0E',
    grain: { baseFrequency: '0.025 0.6', numOctaves: 2, seed: 5 },
    colorMatrix: '0 0 0 0.04 0.13  0 0 0 0.03 0.09  0 0 0 0.02 0.04  0 0 0 0 1',
  },
  padauk: {
    id: 'padauk',
    name: 'Padauk',
    baseColor: '#D44A2C',
    grain: { baseFrequency: '0.014 0.4', numOctaves: 3, seed: 6 },
    colorMatrix: '0 0 0 0.15 0.68  0 0 0 0.05 0.22  0 0 0 0.03 0.11  0 0 0 0 1',
  },
  purpleheart: {
    id: 'purpleheart',
    name: 'Purpleheart',
    baseColor: '#6B3FA0',
    grain: { baseFrequency: '0.016 0.42', numOctaves: 3, seed: 7 },
    colorMatrix: '0 0 0 0.10 0.32  0 0 0 0.05 0.19  0 0 0 0.14 0.52  0 0 0 0 1',
  },
  mahogany: {
    id: 'mahogany',
    name: 'Mahogany',
    baseColor: '#8B4513',
    grain: { baseFrequency: '0.011 0.35', numOctaves: 3, seed: 8 },
    colorMatrix: '0 0 0 0.12 0.43  0 0 0 0.06 0.21  0 0 0 0.03 0.07  0 0 0 0 1',
  },
  ash: {
    id: 'ash',
    name: 'Ash',
    baseColor: '#D2C6A5',
    grain: { baseFrequency: '0.01 0.3', numOctaves: 4, seed: 9 },
    colorMatrix: '0 0 0 0.08 0.74  0 0 0 0.07 0.70  0 0 0 0.05 0.58  0 0 0 0 1',
  },
  zebrawood: {
    id: 'zebrawood',
    name: 'Zebrawood',
    baseColor: '#C4A35A',
    grain: { baseFrequency: '0.008 0.25', numOctaves: 4, seed: 10 },
    colorMatrix: '0 0 0 0.12 0.64  0 0 0 0.09 0.52  0 0 0 0.04 0.28  0 0 0 0 1',
  },
};

export const WOOD_LIST = Object.values(WOOD_SPECIES);
