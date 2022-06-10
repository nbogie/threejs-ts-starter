import * as CANNON from 'cannon-es';
import { Body, World } from 'cannon-es';
import { Camera, Color, DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, Quaternion, Scene, Vector3 } from "three";
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { randFloat, randFloatSpread } from "three/src/math/MathUtils";
import { pick } from "./randomUtils";

//getting started docs: https://pmndrs.github.io/cannon-es/docs/index.html

const DEFAULT_GRAVITY_STRENGTH = -9.82; // m/s²


/** Create a cannon physics world with default Earth-like gravity, with no bodies in it. */
export function setupPhysics(): { world: World } {
    const world = new World();
    world.gravity.set(0, DEFAULT_GRAVITY_STRENGTH, 0);
    return { world };
}

export function createGroundBodyAndMesh(world: World, scene: Scene): { groundBody: Body, groundMesh: Mesh } {
    //The ground will be a static body, which can only be positioned in the world and isn't affected by forces nor velocity.

    const groundBody = new Body({
        mass: 0,  //will be automatically flagged as a static body
        shape: new CANNON.Plane
    });

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    // groundBody.position.y = 0;
    world.addBody(groundBody);

    const groundMesh = new Mesh(new PlaneGeometry(1000, 1000, 2), new MeshStandardMaterial({ side: DoubleSide, color: 0x202020 }));
    groundMesh.userData.body = groundBody;
    scene.add(groundMesh)
    return { groundBody, groundMesh };
}


/** Create body a random box physics body AND an accompanying three.js mesh to visualise it, 
 * adding them the given physics world and three.js scene respectively.
 *  
 * The mesh position and orientation will NOT be kept in sync with the body automatically.
 * 
 * @returns the created three.js mesh, with a reference to the physics body stored in mesh.userData.body
 */
export function createRandomBoxBodyAndMesh(world: World,
    scene: Scene): Mesh {

    const body = createRandomBoxBody(world);
    const mesh = createBoxMeshForBody(body, scene)
    mesh.userData.body = body;
    return mesh
}


/** Create a random (invisible) cannon physics body of box shape, and add it to the given physics world.
 @param world the world to add the new body to
 @returns the created body
 */
function createRandomBoxBody(world: World): Body {

    const dimensions = new CANNON.Vec3(randFloat(0.3, 0.8), randFloat(0.3, 0.8), randFloat(0.3, 0.8));

    const body = new Body({
        mass: 30,
        shape: new CANNON.Box(dimensions)
    });
    body.position.set(randFloatSpread(10), randFloat(5, 15), randFloatSpread(10));
    body.velocity.set(0, 0, 0);

    body.angularVelocity.copy(new CANNON.Vec3(randFloatSpread(0.5), randFloatSpread(0.5), randFloatSpread(0.5)).scale(10));
    body.angularDamping = 0.3
    world.addBody(body);
    return body;
}


/** Create a three.js mesh which will represent the given cannon body, and add it to the given scene.
 * sets dimensions, position and orientation to match the body.
 * @param body the cannon physics body. This should be of type CANNON.Box
 * @param scene the three.js scene to add the mesh to.
 * @returns a three.js mesh, already added to the scene, but which will need to be updated each frame to match the body's changed position and orientation.
 * 
 */
function createBoxMeshForBody(body: Body, scene: Scene): Mesh {
    const colourStrings = [
        "#fc354c",
        "#29221f",
        "#13747d",
        "#0abfbc",
        "#fcf7c5"
    ];
    const color = new Color(pick(colourStrings));

    const bodyShape = body.shapes[0] as CANNON.Box;
    console.assert(bodyShape.type === 4, "given body should have box shape", bodyShape);
    const { x: w, y: h, z: d } = bodyShape.halfExtents;
    //We ought to reuse geometry and material for better performance.

    //The physical box doesn't have rounded edges, but the visualisation will, to show that they can be different.
    const geometry = new RoundedBoxGeometry(w * 2, h * 2, d * 2);
    const material = new MeshStandardMaterial({
        color
    });
    const mesh: Mesh = new Mesh(geometry, material);
    alignMeshToBody(mesh, body); //match position and orientation
    scene.add(mesh);
    return mesh;

}

/** Update given mesh to match the position and orientation of the cannon body we assume is stored in mesh.userData.body  */
export function alignMeshToItsBody(mesh: Mesh): void {
    const body = mesh.userData.body as Body;
    console.assert(body, "mesh.userData.body should not be null.  ", mesh)
    alignMeshToBody(mesh, body);
}

/** Update given mesh to match the position and orientation of the given cannon body */
export function alignMeshToBody(mesh: Mesh, body: CANNON.Body): void {
    mesh.quaternion.copy(body.quaternion as unknown as Quaternion);
    mesh.position.copy(body.position as unknown as Vector3);
}

/** 
Fire a rigid body projectile from (almost) the given camera's position, in (almost) the given camera's direction.

Adds the rigid body to the given physics world.

Creates a representative three.js mesh and adds that to the given scene.

@param world to add the body to.
@param scene to add the mesh to.
@param camera to use for position and direction.

@returns the representative mesh (which has the rigid body as its userData.body) to be updated each frame.
*/
export function fireProjectile(world: World, scene: Scene, camera: Camera): Mesh {

    const projectileMesh = createRandomBoxBodyAndMesh(world, scene);

    //calculate direction - slightly up from camera direction
    const fireDir = new Vector3(); //this will by mutated by getWorldDirection()
    camera.getWorldDirection(fireDir);
    //improve fireDir a bit by adding a further upward component
    const upBoost = camera.up.clone().setLength(0.3);
    fireDir.add(upBoost).normalize();

    //set a spawn position somewhat in front of camera
    const camPos = camera.position;
    const spawnOffset = fireDir.setLength(1.2);//how far in front of cam?
    const spawnPos = new Vector3().addVectors(camPos, spawnOffset);
    const body = projectileMesh.userData.body as Body;
    body.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
    projectileMesh.position.copy(spawnPos)

    body.angularVelocity.set(0, 6, 0);
    body.applyImpulse(new CANNON.Vec3(fireDir.x, fireDir.y, fireDir.z).scale(500))

    return projectileMesh;
}

/** Toggle the given world's gravity on and off between zero-g and an Earth-like default gravity. */
export function toggleGravity(world: World): void {
    if (world.gravity.almostZero()) {
        world.gravity.set(0, DEFAULT_GRAVITY_STRENGTH, 0);
    } else {
        world.gravity.set(0, 0, 0);
    }
}