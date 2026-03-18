export type WoodId =
  | 'cherry'
  | 'red-oak'
  | 'maple'
  | 'walnut'
  | 'ebony'
  | 'padauk'
  | 'purpleheart'
  | 'mahogany'
  | 'ash'
  | 'zebrawood';

export interface WoodSpecies {
  id: WoodId;
  name: string;
  baseColor: string;
}

export interface BoardLayer {
  id: string;
  woodId: WoodId;
  widthCm: number;
}

export type Units = 'cm' | 'in';
export type GrainType = 'edge' | 'end';

export interface BoardState {
  layers: BoardLayer[];
  boardHeightCm: number;
  boardThicknessCm: number;
  bladeKerfCm: number;
  selectedWoodId: WoodId;
  units: Units;
  grainType: GrainType;
  rotateEndGrain: boolean;
}

export type BoardAction =
  | { type: 'ADD_LAYER'; woodId: WoodId; widthCm: number }
  | { type: 'REMOVE_LAYER'; layerId: string }
  | { type: 'UPDATE_LAYER_WOOD'; layerId: string; woodId: WoodId }
  | { type: 'UPDATE_LAYER_WIDTH'; layerId: string; widthCm: number }
  | { type: 'MOVE_LAYER'; layerId: string; direction: 'up' | 'down' }
  | { type: 'SET_BOARD_HEIGHT'; heightCm: number }
  | { type: 'SET_BOARD_THICKNESS'; thicknessCm: number }
  | { type: 'SET_BLADE_KERF'; kerfCm: number }
  | { type: 'SET_GRAIN_TYPE'; grainType: GrainType }
  | { type: 'SET_ROTATE_END_GRAIN'; rotate: boolean }
  | { type: 'SELECT_WOOD'; woodId: WoodId }
  | { type: 'TOGGLE_UNITS' }
  | { type: 'LOAD_BOARD'; state: BoardState };
