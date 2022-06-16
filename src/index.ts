import { DragControls } from 'three/examples/jsm/controls/DragControls';
import {
    BufferGeometry, CatmullRomCurve3, Line,
    LineBasicMaterial, Object3D, Scene, Vector3
} from 'three';
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { loadFont, makeControlPointSphere } from './controlPoint';
import { randomWorldPos } from './randomUtils';
import { setupCamera } from './setupCamera';
import { setupDragControls } from './setupDragControls';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';
import { makeLineOnCurveFromControlPositions, updateLineBasedOnCurve } from './curveAndLine';



export async function setupThreeJSScene(): Promise<void> {
    const gui = new GUI();
    const scene = new Scene();


    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const orbitControls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);

    const font = await loadFont();
    const controlPointMeshes: Object3D[] = ["red", "green", "blue", "yellow", "magenta", "cyan"].map((c, ix) => makeControlPointSphere(c, ix, font))
    scene.add(...controlPointMeshes);

    const myLineMeshOnCurve = makeLineOnCurveFromControlPositions(controlPointMeshes, scene);

    const dragControls = setupDragControls(controlPointMeshes, camera, renderer.domElement, orbitControls);
    dragControls.addEventListener("drag", () => updateLineBasedOnCurve(myLineMeshOnCurve));


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

