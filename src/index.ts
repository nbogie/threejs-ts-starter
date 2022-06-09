
import { Clock, Mesh, Scene } from 'three';
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { alignMeshToItsBody, createGroundBodyAndMesh, createRandomBoxBodyAndMesh, setupPhysics } from './setupPhysics';
import { setupRenderer } from './setupRenderer';

export function setupThreeJSScene(): void {

    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);

    const { world } = setupPhysics();
    const { groundMesh } = createGroundBodyAndMesh(world, scene);

    //make some initial cubes
    const cubeMeshes: Mesh[] = [];
    for (let i = 0; i < 40; i++) {
        cubeMeshes.push(createRandomBoxBodyAndMesh(world, scene));
    }

    //make a new cube periodically 
    setInterval(() => {
        cubeMeshes.push(createRandomBoxBodyAndMesh(world, scene));
    }, 100);

    const clock = new Clock();
    animate();
    function animate() {
        const deltaTime = clock.getDelta() || 1 / 60;
        world.step(deltaTime);

        for (const mesh of cubeMeshes) {
            alignMeshToItsBody(mesh);
        }

        alignMeshToItsBody(groundMesh);
        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }

}

setupThreeJSScene();

