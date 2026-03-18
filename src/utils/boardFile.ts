import type { BoardState } from '../types';

const FILE_VERSION = 1;

interface BoardFile {
  version: number;
  board: BoardState;
}

export function exportBoard(state: BoardState): void {
  const file: BoardFile = { version: FILE_VERSION, board: state };
  const json = JSON.stringify(file, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'cutting-board.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importBoard(file: File): Promise<BoardState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);

        // Accept both wrapped { version, board } format and raw BoardState
        const board: BoardState = parsed.board ?? parsed;

        if (!board.layers || !Array.isArray(board.layers)) {
          throw new Error('Invalid board file: missing layers array');
        }

        resolve(board);
      } catch (err) {
        reject(new Error(`Failed to parse board file: ${(err as Error).message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
