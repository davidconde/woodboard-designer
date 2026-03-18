import { WOOD_LIST } from '../../data/woods';

export function WoodFilterDefs() {
  return (
    <defs>
      {WOOD_LIST.map((wood) => (
        <filter
          key={wood.id}
          id={`wood-${wood.id}`}
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={wood.grain.baseFrequency}
            numOctaves={wood.grain.numOctaves}
            seed={wood.grain.seed}
            stitchTiles="stitch"
          />
          <feColorMatrix type="matrix" values={wood.colorMatrix} />
        </filter>
      ))}
      {/* Zebrawood overlay: a second filter that adds dark streaks */}
      <filter
        id="wood-zebrawood-stripes"
        x="0"
        y="0"
        width="100%"
        height="100%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.25"
          numOctaves={4}
          seed={10}
          stitchTiles="stitch"
          result="base"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0.12 0.64  0 0 0 0.09 0.52  0 0 0 0.04 0.28  0 0 0 0 1"
          in="base"
          result="baseColor"
        />
        <feTurbulence
          type="turbulence"
          baseFrequency="0.005 0.8"
          numOctaves={2}
          seed={110}
          stitchTiles="stitch"
          result="stripes"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2.5 -0.8"
          in="stripes"
          result="stripeMask"
        />
        <feComposite
          in="baseColor"
          in2="stripeMask"
          operator="in"
          result="darkStripes"
        />
        <feMerge>
          <feMergeNode in="baseColor" />
          <feMergeNode in="darkStripes" />
        </feMerge>
      </filter>
    </defs>
  );
}
