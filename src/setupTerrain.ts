import { MeshStandardMaterial, Mesh, Scene, Color, BoxGeometry } from "three";

//https://www.npmjs.com/package/simplex-noise
import SimplexNoise from 'simplex-noise';

/** Add a grid of tiles (mesh objects) to the given scene, at different heights, to simulate (blocky) terrain.
 * Heights (and colours) are calculated from an open-simplex noise algorithm (from a library).
 */
export function setupTerrain(scene: Scene): void {
    // initializing a new simplex instance
    // do this only once as it is relatively expensive
    const simplex = new SimplexNoise()

    const gridSize = 100;
    const noiseScaling = 0.05;
    const verticalScaling = 3;
    const seaLevel = 0; //relative to simplex noise values of -1 to 1
    const geometry = new BoxGeometry(1, 0.1, 1);

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {

            //Get a noise value to use for tile's terrain height and colour
            const noiseVal = simplex.noise2D(col * noiseScaling, row * noiseScaling);

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