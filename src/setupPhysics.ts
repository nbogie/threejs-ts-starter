import { randFloatSpread, randFloat } from "three/src/math/MathUtils";
import CANNON from "cannon";

export function setupPhysics() {
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // m/s²
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;

    world.defaultContactMaterial.contactEquationStiffness = 1e7;
    world.defaultContactMaterial.contactEquationRelaxation = 4;

    // ground plane
    const groundShape = new CANNON.Plane()
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    groundBody.position.y = 0;
    groundBody.addShape(groundShape);
    world.addBody(groundBody);


    const cubeBodies = [];
    for (let i = 0; i < 40; i++) {
        // Shape on plane
        const cubeBody = new CANNON.Body({ mass: 30 });
        cubeBody.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
        cubeBody.position.set(randFloatSpread(10), randFloat(2, 5), randFloatSpread(10));
        cubeBody.velocity.set(0, 0, 0);
        cubeBody.angularVelocity.set(0, 0, 0);
        world.addBody(cubeBody);
        cubeBodies.push(cubeBody);
    }
    return { cubeBodies, groundBody, world };
}