# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint
npx tsc --noEmit   # Type-check only (no output)
npx vitest run     # Run all tests
npx vitest run src/utils/calculations.test.ts  # Run a single test file
```

## Architecture

React + TypeScript cutting board designer with 3D preview (Three.js via React Three Fiber).

**State management:** `useReducer` + React Context in `src/context/BoardContext.tsx`. All state lives in `BoardState` (defined in `src/types.ts`). Components access it via `useBoard()` hook which returns `{ state, dispatch }`. State auto-persists to localStorage; `loadState()` merges saved data with defaults to handle missing fields from older versions.

**Texture system (two-phase):**
1. Canvas 2D procedural generation at module load (`src/utils/woodTexture.ts`) — uses seeded fractal noise (`src/utils/noise.ts`) to create 512x512 JPEG data URLs. Two generators: `generateWoodTexture()` for edge grain (elongated linear noise), `generateEndGrainTexture()` for end grain (concentric arc patterns). Per-species configs in `src/data/woods.ts` (TEXTURE_CONFIGS).
2. `src/utils/woodTextures.ts` pre-generates both sets (EDGE_TEXTURES, END_TEXTURES) at import time, keyed by WoodId.

**3D rendering:** `src/components/Preview/BoardPreview3D.tsx` converts textures to Three.js materials inside a `useThreeTextures()` hook. Each strip/cell is a `WoodBlock` mesh with 6 materials (different textures per face based on grain orientation). Edge grain = single row of boxes; end grain = grid of boxes with optional row reversal.

**Calculations:** Pure functions in `src/utils/calculations.ts` and `src/utils/endGrain.ts`. No React dependencies — used by both the CalculationsPanel UI and the 3D preview. End grain slice count: `floor(height / (thickness + kerf))`.

**Unit conversion:** All values stored internally in centimeters. `cmToDisplay()`/`displayToCm()` in `src/utils/scale.ts` handle cm↔in conversion at the UI boundary.

**File I/O:** `src/utils/boardFile.ts` exports/imports BoardState as JSON. Uses the existing `LOAD_BOARD` reducer action for imports.

## Key Types

- `WoodId` — union of 10 hardwood string literals
- `BoardLayer` — `{ id, woodId, widthCm }`
- `BoardState` — full app state (layers, dimensions, settings)
- `BoardAction` — discriminated union of 12 action types
- `WoodTextureConfig` — per-species procedural texture parameters

## Testing

Tests use Vitest. Test files are co-located with their source (`src/utils/*.test.ts`). Current coverage: `calculateBoardRequirements()` (12 tests) and `computeEndGrainSlices()` (7 tests). All calculation/utility code should be unit tested; UI components are not tested.
