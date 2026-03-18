import type { WoodId } from '../../types';

interface BoardStripProps {
  x: number;
  width: number;
  height: number;
  woodId: WoodId;
}

export function BoardStrip({ x, width, height, woodId }: BoardStripProps) {
  const filterId =
    woodId === 'zebrawood' ? 'wood-zebrawood-stripes' : `wood-${woodId}`;

  return (
    <rect
      x={x}
      y={0}
      width={width}
      height={height}
      filter={`url(#${filterId})`}
    />
  );
}
