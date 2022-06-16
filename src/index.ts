import { Scene } from 'three';
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { createControlPoints } from './controlPoint';
import { makeLineOnCurveFromControlPositions, updateLineBasedOnCurve } from './curveAndLine';
import { randomWorldPos } from './randomUtils';
import { setupCamera } from './setupCamera';
import { setupDragControls } from './setupDragControls';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';

export async function setupThreeJSScene(): Promise<void> {
    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const orbitControls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);

    const controlPointMeshes = await createControlPoints(scene);

    const myLineMeshOnCurve = makeLineOnCurveFromControlPositions(controlPointMeshes, scene);

    const dragControls = setupDragControls(controlPointMeshes, camera, renderer.domElement, orbitControls);
    dragControls.addEventListener("drag", () => updateLineBasedOnCurve(myLineMeshOnCurve));

    //setup gui
    const gui = new GUI();
    const actions = {
        randomiseControlPoints: () => {
            controlPointMeshes.forEach(m => m.position.copy(randomWorldPos(60)))
            updateLineBasedOnCurve(myLineMeshOnCurve)
        }
    };
    gui.add(actions, "randomiseControlPoints")

    animate();

    function animate() {
        renderer.render(scene, camera);
        orbitControls.update();
        requestAnimationFrame(animate);
    }


}
setupThreeJSScene();

