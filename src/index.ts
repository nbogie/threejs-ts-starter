
import { Mesh, Scene } from 'three';
import { createHeightFieldAndMesh } from './physicsHeightfieldUtils';
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { updateMeshAccordingToItsBody, createRandomBallBodyAndMesh, fireProjectile, setupPhysics, toggleGravity } from './setupPhysics';
import { setupRenderer } from './setupRenderer';
import { setupStatsPanel } from './setupStatsPanel';
export function setupThreeJSScene(): void {

    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const statsPanel = setupStatsPanel();

    const controls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);

    const { world } = setupPhysics();
    createHeightFieldAndMesh(world, scene, 50, (x, y) => 2 + (Math.cos(x / 3) + Math.sin(y / 3)));

    const ballMeshes: Mesh[] = [];

    setInterval(() => {
        ballMeshes.push(createRandomBallBodyAndMesh(world, scene));
    }, 1000);


    document.addEventListener("mousedown", () => {
        const projectileMesh = fireProjectile(world, scene, camera)
        ballMeshes.push(projectileMesh)
    })
    document.addEventListener("keydown", (event) => {
        if (event.key === "g") {
            toggleGravity(world)
        }
    })

    animate();
    function animate() {
        world.fixedStep(); // 1/60th of second, adjusted for delays.

        for (const mesh of ballMeshes) {
            updateMeshAccordingToItsBody(mesh);
        }

        // alignMeshToItsBody(groundMesh);
        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        statsPanel.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }

}

setupThreeJSScene();

