import { useMemo, type JSX } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useBoard } from '../../context/BoardContext';
import { EDGE_TEXTURES, END_TEXTURES } from '../../utils/woodTextures';
import { WOOD_SPECIES, WOOD_LIST } from '../../data/woods';
import { totalBoardWidthCm } from '../../utils/scale';
import { computeEndGrainSlices } from '../../utils/endGrain';
import type { WoodId } from '../../types';
import styles from './PreviewPanel.module.css';

// How many cm one texture tile covers (512px / 20px-per-cm)
const TILE_CM = 25.6;
const GLUE_GAP = 0.03; // 0.3mm gap between strips

function useThreeTextures() {
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    const edge = {} as Record<WoodId, THREE.Texture>;
    const end = {} as Record<WoodId, THREE.Texture>;

    for (const wood of WOOD_LIST) {
      const eTex = loader.load(EDGE_TEXTURES[wood.id]);
      eTex.colorSpace = THREE.SRGBColorSpace;
      eTex.wrapS = THREE.RepeatWrapping;
      eTex.wrapT = THREE.RepeatWrapping;
      edge[wood.id] = eTex;

      const nTex = loader.load(END_TEXTURES[wood.id]);
      nTex.colorSpace = THREE.SRGBColorSpace;
      nTex.wrapS = THREE.RepeatWrapping;
      nTex.wrapT = THREE.RepeatWrapping;
      end[wood.id] = nTex;
    }

    return { edge, end };
  }, []);
}

interface BlockProps {
  position: [number, number, number];
  size: [number, number, number];
  woodId: WoodId;
  topTexture: THREE.Texture;
  sideTexture: THREE.Texture;
}

function WoodBlock({ position, size, woodId, topTexture, sideTexture }: BlockProps) {
  const materials = useMemo(() => {
    const [w, h, d] = size;
    const baseColor = WOOD_SPECIES[woodId].baseColor;

    // Top face texture — scale to physical tile size
    const topMat = new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0 });
    const topTex = topTexture.clone();
    topTex.repeat.set(w / TILE_CM, d / TILE_CM);
    topMat.map = topTex;

    // Front/back faces
    const frontMat = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0 });
    const frontTex = sideTexture.clone();
    frontTex.repeat.set(w / TILE_CM, h / TILE_CM);
    frontMat.map = frontTex;

    // Left/right end faces
    const endMat = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0 });
    const endTex = sideTexture.clone();
    endTex.repeat.set(d / TILE_CM, h / TILE_CM);
    endMat.map = endTex;

    // Bottom — solid dark color
    const bottomMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.9,
      metalness: 0,
    });

    // Box face order: [+x, -x, +y, -y, +z, -z]
    return [endMat, endMat, topMat, bottomMat, frontMat, frontMat];
  }, [woodId, topTexture, sideTexture, size]);

  return (
    <mesh position={position} material={materials}>
      <boxGeometry args={size} />
    </mesh>
  );
}

function BoardScene() {
  const { state } = useBoard();
  const textures = useThreeTextures();

  const totalWidthCm = totalBoardWidthCm(state.layers);
  if (totalWidthCm === 0) return null;

  const isEndGrain = state.grainType === 'end';
  const thickness = state.boardThicknessCm || 2;
  const numSlices = isEndGrain
    ? computeEndGrainSlices(state.boardHeightCm, thickness, state.bladeKerfCm)
    : 1;
  const depthCm = isEndGrain ? numSlices * thickness : state.boardHeightCm;

  if (depthCm === 0) return null;

  const halfWidth = totalWidthCm / 2;
  const halfDepth = depthCm / 2;

  const blocks: JSX.Element[] = [];

  if (!isEndGrain) {
    // Edge grain: one row of strips
    let xOffset = 0;
    for (const layer of state.layers) {
      const w = layer.widthCm - GLUE_GAP;
      const x = xOffset + layer.widthCm / 2 - halfWidth;
      blocks.push(
        <WoodBlock
          key={layer.id}
          position={[x, thickness / 2, 0]}
          size={[w, thickness, depthCm]}
          woodId={layer.woodId}
          topTexture={textures.edge[layer.woodId]}
          sideTexture={textures.end[layer.woodId]}
        />,
      );
      xOffset += layer.widthCm;
    }
  } else {
    // End grain: grid of blocks
    for (let row = 0; row < numSlices; row++) {
      const strips =
        state.rotateEndGrain && row % 2 === 1
          ? [...state.layers].reverse()
          : state.layers;
      const zPos = row * thickness + thickness / 2 - halfDepth;

      let xOffset = 0;
      for (let col = 0; col < strips.length; col++) {
        const layer = strips[col];
        const w = layer.widthCm - GLUE_GAP;
        const d = thickness - GLUE_GAP;
        const x = xOffset + layer.widthCm / 2 - halfWidth;
        blocks.push(
          <WoodBlock
            key={`${row}-${col}`}
            position={[x, thickness / 2, zPos]}
            size={[w, thickness, d]}
            woodId={layer.woodId}
            topTexture={textures.end[layer.woodId]}
            sideTexture={textures.edge[layer.woodId]}
          />,
        );
        xOffset += layer.widthCm;
      }
    }
  }

  return <group>{blocks}</group>;
}

export function BoardPreview3D() {
  const { state } = useBoard();
  const totalWidthCm = totalBoardWidthCm(state.layers);

  if (totalWidthCm === 0) {
    return <div className={styles.previewEmpty}>Add layers to see your board</div>;
  }

  // Camera distance based on board size
  const maxDim = Math.max(totalWidthCm, state.boardHeightCm);
  const camDist = maxDim * 1.0;

  return (
    <div className={styles.preview3d}>
      <Canvas
        camera={{
          position: [camDist * 0.3, camDist * 0.6, camDist * 0.8],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[15, 25, 15]} intensity={0.8} castShadow />
        <directionalLight position={[-10, 15, -10]} intensity={0.3} />
        <BoardScene />
        <OrbitControls
          makeDefault
          minDistance={5}
          maxDistance={200}
          enablePan
        />
      </Canvas>
    </div>
  );
}
