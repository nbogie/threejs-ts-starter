import { Color, Float32BufferAttribute, Mesh, MeshStandardMaterial, PlaneGeometry, Scene } from "three";
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';

export interface NoiseValues {
    noiseVal: number;
    landHeight: number;
    colour: Color;
}

interface GridPos {
    col: number;
    row: number;
}

/** Add a grid of tiles (mesh objects) to the given scene, at different heights, to simulate (blocky) terrain.
 * Heights (and colours) are calculated from an open-simplex noise algorithm (from a library).
 */
export function setupTerrain(scene: Scene, gridSize: number): {
    updateTerrain: (time: number) => void
} {
    const coloursLookup = createColoursLookup();

    // initializing a new simplex instance
    // do this only once as it is relatively expensive
    const simplex = new SimplexNoise()

    const noiseScaling = 0.004;
    const verticalScaling = 8;
    const seaLevel = 0; //relative to simplex noise values of -1 to 1

    const geometry = new PlaneGeometry(100, 100, gridSize - 1, gridSize - 1);
    geometry.rotateX(-Math.PI / 2)
    const groundMaterial = new MeshStandardMaterial({
        color: 0xFFFFFF,
        vertexColors: true
    });
    const mesh = new Mesh(geometry, groundMaterial);
    scene.add(mesh)

    updateTerrain(0);

    /** Update position and colour of the terrain, based on the FBM noise for the given time.
     * @param time allows animation over time.
     */
    function updateTerrain(time: number) {
        //Useful reading: "how to update things"
        //https://threejs.org/docs/#manual/en/introduction/How-to-update-things

        //The types say geometry.attributes.position.array is read-only, 
        //but various official examples mutate it. ¯\_(ツ)_/¯
        const vertices = geometry.attributes.position.array as number[];

        const count = gridSize * gridSize;
        const colours: number[] = new Array(count * 3)


        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const nvs = getNoiseValuesAtGridPos({ col, row }, time)

                const ix = 3 * (col + row * gridSize);
                const yPosIndex = ix + 1; //positions stored as x, y, z - we need the second of those.

                colours[ix + 0] = nvs.colour.r;
                colours[ix + 1] = nvs.colour.g;
                colours[ix + 2] = nvs.colour.b;

                vertices[yPosIndex] = nvs.landHeight;
            }
        }
        const colourBufferAttribute = new Float32BufferAttribute(colours, 3);
        geometry.setAttribute('color', colourBufferAttribute);

        //If you want to change the position data values after the first render, you need to set the needsUpdate flag like so:
        geometry.attributes.position.needsUpdate = true; // required after the first render

        //"If you change the position data values after the initial render, you may need to recompute bounding volumes so other features of the engine like view frustum culling or helpers properly work.""
        //geometry.computeBoundingBox();

        geometry.computeVertexNormals();
    }

    /** 
     * Return a noise value that is generated by adding many different frequencies of noise at different amplitudes, for more realistic terrain.
     *
     * * see https://thebookofshaders.com/13/
     * 
     * @returns number between -1 and 1, theoretically, though in practice it's unlikely you'll see a value beyond -0.8 to 0.8
     */
    function getFBMNoiseValAtGridPos(pos: GridPos, time: number): number {
        const noiseVal1 = 1.5 * simplex.noise3d(pos.col * noiseScaling, pos.row * noiseScaling, time);
        const noiseVal2 = 0.6 * simplex.noise3d(pos.col * noiseScaling * 2, pos.row * noiseScaling * 2, time + 777);
        const noiseVal3 = 0.4 * simplex.noise3d(pos.col * noiseScaling * 4, pos.row * noiseScaling * 4, 3 * time + 999);
        const noiseVal4 = 0.2 * simplex.noise3d(pos.col * noiseScaling * 8, pos.row * noiseScaling * 8, 4 * time + 1333);
        const noiseVal5 = 0.03 * simplex.noise3d(pos.col * noiseScaling * 16, pos.row * noiseScaling * 16, 5 * time + 1999);
        const noiseVal6 = 0.02 * simplex.noise3d(pos.col * noiseScaling * 96, pos.row * noiseScaling * 96, 5 * time + 1777);
        const noiseVal = (noiseVal1 + noiseVal2 + noiseVal3 + noiseVal4 + noiseVal5 + noiseVal6) / 2.7;
        return noiseVal;
    }

    /** Get noise-based values for the terrain at a given grid position 
     * @pos grid position to find out about
     * @time animation time
     * @returns noise values (including raw noiseVal, the landHeight and the terrain colour based on that noiseVal)
    */
    function getNoiseValuesAtGridPos(pos: GridPos, time: number): NoiseValues {
        const noiseVal = 2 * getFBMNoiseValAtGridPos(pos, time);
        const landHeight = (noiseVal < seaLevel ? seaLevel : noiseVal) * verticalScaling;
        const colour = getColorForNoiseVal(noiseVal);
        return { noiseVal, landHeight, colour }
    }


    function getColorForNoiseVal(noiseVal: number): Color {
        if (noiseVal < -0.3) {
            return coloursLookup.deepWater;
        }
        if (noiseVal < 0) {
            return coloursLookup.shallowWater
        }
        if (noiseVal < 0.1) {
            return coloursLookup.sand
        }
        if (noiseVal < 0.7) {
            return coloursLookup.grass
        }
        if (noiseVal < 0.9) {
            return coloursLookup.rocks
        }
        return coloursLookup.snow
    }

    return { updateTerrain };
}


function createColoursLookup() {
    return {
        deepWater: new Color("navy"),
        shallowWater: new Color("dodgerblue"),
        sand: new Color("yellow"),
        grass: new Color("green"),
        rocks: new Color("gray"),
        snow: new Color("white"),
    }
}