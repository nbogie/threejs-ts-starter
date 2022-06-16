import { BoxGeometry, Color, Mesh, MeshStandardMaterial, Scene } from "three";
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';


/** Add a grid of tiles (mesh objects) to the given scene, at different heights, to simulate (blocky) terrain.
 * Heights (and colours) are calculated from an open-simplex noise algorithm (from a library).
 */
export function setupTerrain(scene: Scene): void {
    // initializing a new simplex instance
    // do this only once as it is relatively expensive
    const simplex = new SimplexNoise()

    const gridSize = 100;
    const noiseScaling = 0.02;
    const verticalScaling = 6;
    const seaLevel = 0; //relative to simplex noise values of -1 to 1
    const geometry = new BoxGeometry(1, 1, 1);

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {

            //Get a noise value to use for tile's terrain height and colour
            const noiseVal = 1.5 * fbmNoise(col, row);

            //(beginners, seek to understand this simpler alternative, first)
            // const noiseVal = simplestNoise(col, row);

            const colourName = getColourNameForNoiseVal(noiseVal);
            const material = new MeshStandardMaterial({
                color: new Color(colourName)
            });

            //make a tile
            const oneTileMesh: Mesh = new Mesh(geometry, material);

            //position the tile
            oneTileMesh.position.x = col - gridSize / 2;
            oneTileMesh.position.z = row - gridSize / 2;

            const landHeight = noiseVal < seaLevel ? seaLevel : noiseVal;
            oneTileMesh.position.y = verticalScaling * landHeight;

            scene.add(oneTileMesh);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function simplestNoise(col: number, row: number): number {
        return simplex.noise3d(col * noiseScaling, row * noiseScaling, 0);
    }

    //get a noise value for a position by summing layers of different-frequency noise
    //See "fractal brownian motion": https://thebookofshaders.com/13/
    function fbmNoise(col: number, row: number): number {
        let total = 0;
        let ampSum = 0;
        let amp = 1;
        let freq = 1;
        const numLayers = 6;
        for (let layerIx = 0; layerIx < numLayers; layerIx++) {
            const n = amp * simplex.noise3d(col * noiseScaling * freq, row * noiseScaling * freq, 0);
            total += n;
            ampSum += amp;
            freq = freq * 2;
            amp *= 0.5;
        }
        return total / ampSum;
    }
}

function getColourNameForNoiseVal(noiseVal: number): string {
    if (noiseVal < -0.3) {
        return "navy";  //deep water
    }
    if (noiseVal < 0) {
        return "dodgerblue";  //shallow water
    }
    if (noiseVal < 0.1) {
        return "yellow";  //sand
    }
    if (noiseVal < 0.7) {
        return "green";  //grass
    }
    if (noiseVal < 0.9) {
        return "gray";  //rocks
    }
    return "white";  //snow!

}