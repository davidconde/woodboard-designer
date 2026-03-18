interface BoardStripProps {
  x: number;
  width: number;
  height: number;
  layerId: string;
}

export function BoardStrip({ x, width, height, layerId }: BoardStripProps) {
  return (
    <rect
      x={x}
      y={0}
      width={width}
      height={height}
      fill={`url(#wood-${layerId})`}
    />
  );
}
