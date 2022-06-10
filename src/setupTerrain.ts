import { BoxGeometry, Color, Material, Mesh, MeshStandardMaterial, Scene } from "three";
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';

export interface NoiseValues { noiseVal: number, landHeight: number, material: Material }


interface GridPos {
    col: number;
    row: number;
}

/** Add a grid of tiles (mesh objects) to the given scene, at different heights, to simulate (blocky) terrain.
 * Heights (and colours) are calculated from an open-simplex noise algorithm (from a library).
 */
export function setupTerrain(scene: Scene): {
    tiles: Mesh[],
    getValuesAtGridPos: (g: GridPos, time: number) => NoiseValues
} {
    const materialsLookup = createMaterialsLookup();

    // initializing a new simplex instance
    // do this only once as it is relatively expensive
    const simplex = new SimplexNoise()

    const gridSize = 100;
    const noiseScaling = 0.05;
    const verticalScaling = 4;
    const seaLevel = 0; //relative to simplex noise values of -1 to 1
    const geometry = new BoxGeometry(1, 0.1, 1);//shared. For best performance consider THREE.InstancedMesh.

    const tiles: Mesh[] = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const { landHeight, material } = getValuesAtGridPos({ col, row }, 0);

            //make a tile
            const oneTileMesh: Mesh = new Mesh(geometry, material);
            oneTileMesh.userData.gridPos = { col, row };

            //position the tile
            oneTileMesh.position.x = col - gridSize / 2;
            oneTileMesh.position.z = row - gridSize / 2;
            oneTileMesh.position.y = landHeight;

            scene.add(oneTileMesh);
            tiles.push(oneTileMesh)
        }
    }

    function getValuesAtGridPos(pos: GridPos, time: number): NoiseValues {
        const noiseVal = simplex.noise3d(pos.col * noiseScaling, pos.row * noiseScaling, time);
        const landHeight = (noiseVal < seaLevel ? seaLevel : noiseVal) * verticalScaling;
        const material = getMaterialForNoiseVal(noiseVal);
        return { noiseVal, landHeight, material }
    }

    function getMaterialForNoiseVal(noiseVal: number): Material {
        if (noiseVal < -0.3) {
            return materialsLookup.deepWater;
        }
        if (noiseVal < 0) {
            return materialsLookup.shallowWater
        }
        if (noiseVal < 0.1) {
            return materialsLookup.sand
        }
        if (noiseVal < 0.7) {
            return materialsLookup.grass
        }
        if (noiseVal < 0.9) {
            return materialsLookup.rocks
        }
        return materialsLookup.snow
    }

    return { tiles, getValuesAtGridPos };
}

function createMaterialsLookup() {
    return {
        deepWater: new MeshStandardMaterial({ color: new Color("navy") }),
        shallowWater: new MeshStandardMaterial({ color: new Color("dodgerblue") }),
        sand: new MeshStandardMaterial({ color: new Color("yellow") }),
        grass: new MeshStandardMaterial({ color: new Color("green") }),
        rocks: new MeshStandardMaterial({ color: new Color("gray") }),
        snow: new MeshStandardMaterial({ color: new Color("white") }),
    }
}