import * as CANNON from 'cannon-es';
import { Body, World } from 'cannon-es';
import { BoxGeometry, Camera, Color, DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, Quaternion, Scene, Vector3 } from "three";
import { randFloat, randFloatSpread } from "three/src/math/MathUtils";
import { pick } from "./randomUtils";

//getting started docs: https://pmndrs.github.io/cannon-es/docs/index.html

export function setupPhysics(): { world: World } {
    const world = new World();
    world.gravity.set(0, -9.82, 0); // m/s²    
    return { world };
}

export function createGroundBodyAndMesh(world: World, scene: Scene): { groundBody: Body, groundMesh: Mesh } {
    //A static body can only be positioned in the world and isn't affected by forces nor velocity.

    const groundBody = new Body({
        mass: 0,  //will be automatically flagged as a static body
        shape: new CANNON.Plane
    });

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    // groundBody.position.y = 0;
    world.addBody(groundBody);

    const groundMesh = new Mesh(new PlaneGeometry(10, 10, 2), new MeshStandardMaterial({ side: DoubleSide }));
    groundMesh.userData.body = groundBody;
    scene.add(groundMesh)
    return { groundBody, groundMesh };
}

export function createRandomBoxBodyAndMesh(world: World,
    scene: Scene): Mesh {

    const body = createRandomBoxBody(world);
    const mesh = createBoxMeshForBody(body, scene)
    mesh.userData.body = body;
    return mesh
}

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
    //We ought to reuse these for better performance.
    const geometry = new BoxGeometry(w * 2, h * 2, d * 2);
    const material = new MeshStandardMaterial({
        color
    });
    const mesh: Mesh = new Mesh(geometry, material);
    scene.add(mesh);
    return mesh;

}


export function alignMeshToItsBody(mesh: Mesh): void {
    const body = mesh.userData.body as Body;
    console.assert(body, "mesh.userData.body should not be null.  ", mesh)
    mesh.quaternion.copy(body.quaternion as unknown as Quaternion);
    mesh.position.copy(body.position as unknown as Vector3);
}

/** 
Fire a rigid body projectile from (almost) the given camera's position, in (almost) the given camera's direction.

Adds the rigid body to the given physics world.

Creates a representative three.js mesh and adds that to the given scene.

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