import * as CANNON from 'cannon-es';
import { Body, GSSolver, NaiveBroadphase, World } from 'cannon-es';
import { BoxGeometry, Camera, Color, DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry, Quaternion, Scene, Vector3 } from "three";
import { randFloat, randFloatSpread } from "three/src/math/MathUtils";
import { pick } from "./randomUtils";

export function setupPhysics(): { world: World; } {
    const world = new World();
    world.gravity.set(0, -9.82, 0); // m/s²
    world.broadphase = new NaiveBroadphase();
    (world.solver as GSSolver).iterations = 10;

    world.defaultContactMaterial.contactEquationStiffness = 1e7;
    world.defaultContactMaterial.contactEquationRelaxation = 4;
    return { world };
}

export function createGroundBodyAndMesh(world: World, scene: Scene): { groundBody: Body, groundMesh: Mesh } {
    const groundShape = new CANNON.Plane()
    const groundBody = new Body({ mass: 0 });
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    groundBody.position.y = 0;
    groundBody.addShape(groundShape);
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

    const body = new Body({ mass: 30 });
    body.addShape(new CANNON.Box(dimensions));
    body.position.set(randFloatSpread(10), randFloat(5, 15), randFloatSpread(10));
    body.velocity.set(0, 0, 0);

    body.angularVelocity.copy(new CANNON.Vec3(randFloatSpread(0.5), randFloatSpread(0.5), randFloatSpread(0.5)).scale(10));
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

export function fireProjectile(world: World, scene: Scene, camera: Camera): Mesh {
    const camDir = new Vector3();
    camera.getWorldDirection(camDir);
    const camPos = camera.position;
    const spawnOffset = camDir.multiplyScalar(1);//how far in front of cam?  (camDir is normalized.)
    const spawnPos = new Vector3().addVectors(camPos, spawnOffset);

    const projectileMesh = createRandomBoxBodyAndMesh(world, scene);

    const body = projectileMesh.userData.body as Body;

    body.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
    projectileMesh.position.copy(spawnPos)

    body.applyImpulse(new CANNON.Vec3(camDir.x, camDir.y, camDir.z).scale(500))

    return projectileMesh;
}