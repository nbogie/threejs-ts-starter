import { Mesh, MeshStandardMaterial, Scene } from 'three';
//@ts-ignore  - no types?
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { calculateMeshGeometry, createQuadRing } from './setupQuadRing';
import { setupRenderer } from './setupRenderer';
import { setupStatsPanel } from './setupStatsPanel';

export function setupThreeJSScene(): void {
    const gui = new GUI();
    const statsPanel = setupStatsPanel();
    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);

    const quadRingMesh: Mesh = createQuadRing();

    scene.add(quadRingMesh);

    const params = {
        numSegments: 100,
        thickness: 2,
        radius: 20,
        spiralGain: 0
    }
    const matOptions = {
        isNormal: true,
        applyStandard: () => quadRingMesh.material = new MeshStandardMaterial({ color: 0xFF00FF }),
        setWireframe: () => (quadRingMesh.material as MeshStandardMaterial).wireframe = true
    }
    function recalcGeom() {
        quadRingMesh.geometry = calculateMeshGeometry(params);
    }
    gui.add(params, "numSegments", 4, 200, 2).onChange(recalcGeom);
    gui.add(params, "thickness", 0.2, 10).onChange(recalcGeom);
    gui.add(params, "spiralGain", -10, 40, 5).onChange(recalcGeom)
    gui.add(quadRingMesh.material, "wireframe")
    gui.add(matOptions, "applyStandard")
    gui.add(matOptions, "setWireframe")

    animate();

    function animate() {
        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);
        statsPanel.update();

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }
}

setupThreeJSScene();
