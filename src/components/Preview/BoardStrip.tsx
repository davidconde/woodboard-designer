interface BoardStripProps {
  x: number;
  y?: number;
  width: number;
  height: number;
  layerId: string;
}

export function BoardStrip({ x, y = 0, width, height, layerId }: BoardStripProps) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={`url(#wood-${layerId})`}
    />
  );
}
