import { Color, Mesh, MeshStandardMaterial, Scene } from 'three';
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { calculateGeometryForRing, createQuadRing } from './setupQuadRing';
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

    const ringParams = {
        numSegments: 130,
        thickness: 2,
        radius: 20,
        spiralGain: 0
    }
    const ringMesh: Mesh = createQuadRing(ringParams);

    scene.add(ringMesh);

    const vertexNormalsHelper = new VertexNormalsHelper(ringMesh, 1, 0xffffff);
    scene.add(vertexNormalsHelper);

    const matOptions = {
        applyStandard: () => ringMesh.material = new MeshStandardMaterial({ color: new Color("gray") }),
        setWireframe: () => (ringMesh.material as MeshStandardMaterial).wireframe = true
    }
    function recalcGeom() {
        ringMesh.geometry = calculateGeometryForRing(ringParams);
        vertexNormalsHelper.update()
    }
    gui.add(ringParams, "numSegments", 4, 200, 2).onChange(recalcGeom);
    gui.add(ringParams, "thickness", 0.2, 10).onChange(recalcGeom);
    gui.add(ringParams, "spiralGain", -10, 200, 5).onChange(recalcGeom)
    gui.add(ringMesh.material, "wireframe")
    gui.add(matOptions, "applyStandard")
    gui.add(matOptions, "setWireframe")
    gui.add(vertexNormalsHelper, "visible").name("show normals")
    animate();

    function animate() {
        renderer.render(scene, camera);
        statsPanel.update();

        controls.update();

        requestAnimationFrame(animate);
    }
}

setupThreeJSScene();
