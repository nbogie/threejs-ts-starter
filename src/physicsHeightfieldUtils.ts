import * as CANNON from 'cannon-es';
import { Heightfield, World } from "cannon-es";
import { BufferGeometry, Euler, Float32BufferAttribute, Mesh, MeshStandardMaterial, Scene } from "three";

/** Create a CANNON heightfield and representatitve three.js mesh, adding them to the corresponding world and scene, 
 * with the heights at each location being based on the given heightFn 
 * @world to add heightfield body to
 * @scene to add three.js mesh to 
 * @param gridSize num positions along one side.  Field will have gridSize * gridSize positions.  
 * @param heightFn callback function called during setup for each x,y position in the field, to determine its height.
 * */
export function createHeightFieldAndMesh(
    world: World,
    scene: Scene,
    gridSize: number,
    heightFn: (x: number, y: number) => number
): void {

    //Generate some height data(y-values).
    const heights: number[][] = []
    for (let rowIx = 0; rowIx < gridSize; rowIx++) {
        const row: number[] = [];
        heights.push(row);
        for (let colIx = 0; colIx < gridSize; colIx++) {
            const y = heightFn(colIx, rowIx)
            row.push(y)
        }
    }

    const heightfieldShape = new CANNON.Heightfield(heights, {
        elementSize: 1 // Distance between the data points in X and Y directions
    })

    const heightfieldBody = new CANNON.Body({ shape: heightfieldShape })

    // const geometry = convertHeightfieldToGeometry(heightfieldShape);
    const geometry = convertHeightfieldToGeometry(heightfieldShape)
    const mesh = new Mesh(geometry, new MeshStandardMaterial({ color: 0x998877, flatShading: false }))

    heightfieldBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    mesh.quaternion.setFromEuler(new Euler(-Math.PI / 2, 0, 0));

    heightfieldBody.position.x -= gridSize / 2;
    heightfieldBody.position.z += gridSize / 2;
    mesh.translateX(-gridSize / 2)
    mesh.translateY(-gridSize / 2)

    world.addBody(heightfieldBody)
    scene.add(mesh)
}



//This function from cannon-es-debugger (MIT licence)
//https://github.com/pmndrs/cannon-es-debugger/blob/master/src/cannon-es-debugger.ts
/** 
 * Create and return a three.js Geometry from a given Heightfield.
 * 
*/
export function convertHeightfieldToGeometry(shape: Heightfield): BufferGeometry {
    const geometry = new BufferGeometry()
    const s = shape.elementSize || 1 // assumes square heightfield, else i*x, j*y
    const positions = shape.data.flatMap((row, i) => row.flatMap((z, j) => [i * s, j * s, z]))
    const indices = []

    for (let xi = 0; xi < shape.data.length - 1; xi++) {
        for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
            const stride = shape.data[xi].length
            const index = xi * stride + yi
            indices.push(index + 1, index + stride, index + stride + 1)
            indices.push(index + stride, index + 1, index)
        }
    }

    geometry.setIndex(indices)
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.computeBoundingSphere()
    geometry.computeVertexNormals()
    return geometry
}
