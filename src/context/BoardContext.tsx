import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { BoardState, BoardAction } from '../types';
import { generateId } from '../utils/id';

const STORAGE_KEY = 'board-maker-state';

const defaultState: BoardState = {
  layers: [
    { id: generateId(), woodId: 'walnut', widthCm: 3 },
    { id: generateId(), woodId: 'maple', widthCm: 2 },
    { id: generateId(), woodId: 'cherry', widthCm: 4 },
    { id: generateId(), woodId: 'maple', widthCm: 2 },
    { id: generateId(), woodId: 'walnut', widthCm: 3 },
    { id: generateId(), woodId: 'padauk', widthCm: 1.5 },
    { id: generateId(), woodId: 'maple', widthCm: 2 },
    { id: generateId(), woodId: 'walnut', widthCm: 3 },
  ],
  boardHeightCm: 30,
  bladeKerfCm: 0.2,
  selectedWoodId: 'cherry',
  units: 'cm',
};

function loadState(): BoardState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed };
    }
  } catch {
    // ignore
  }
  return defaultState;
}

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'ADD_LAYER':
      return {
        ...state,
        layers: [
          ...state.layers,
          { id: generateId(), woodId: action.woodId, widthCm: action.widthCm },
        ],
      };
    case 'REMOVE_LAYER':
      return {
        ...state,
        layers: state.layers.filter((l) => l.id !== action.layerId),
      };
    case 'UPDATE_LAYER_WOOD':
      return {
        ...state,
        layers: state.layers.map((l) =>
          l.id === action.layerId ? { ...l, woodId: action.woodId } : l,
        ),
      };
    case 'UPDATE_LAYER_WIDTH':
      return {
        ...state,
        layers: state.layers.map((l) =>
          l.id === action.layerId ? { ...l, widthCm: action.widthCm } : l,
        ),
      };
    case 'MOVE_LAYER': {
      const idx = state.layers.findIndex((l) => l.id === action.layerId);
      if (idx === -1) return state;
      const newIdx = action.direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= state.layers.length) return state;
      const layers = [...state.layers];
      [layers[idx], layers[newIdx]] = [layers[newIdx], layers[idx]];
      return { ...state, layers };
    }
    case 'SET_BOARD_HEIGHT':
      return { ...state, boardHeightCm: action.heightCm };
    case 'SET_BLADE_KERF':
      return { ...state, bladeKerfCm: action.kerfCm };
    case 'SELECT_WOOD':
      return { ...state, selectedWoodId: action.woodId };
    case 'TOGGLE_UNITS':
      return { ...state, units: state.units === 'cm' ? 'in' : 'cm' };
    case 'LOAD_BOARD':
      return action.state;
    default:
      return state;
  }
}

interface BoardContextValue {
  state: BoardState;
  dispatch: React.Dispatch<BoardAction>;
}

const BoardContext = createContext<BoardContextValue | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard(): BoardContextValue {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used within BoardProvider');
  return ctx;
}
