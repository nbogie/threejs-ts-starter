import { CatmullRomCurve3, Mesh, Scene, Vector3 } from 'three';
//@ts-ignore  - no types?
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { loadFont, makeControlPointSphere } from './controlPoint';
import { calculateGeometryForRoad, createRoadMesh, RoadGeomParams, setupGUI } from './CustomRoadGeometry';
import { randomWorldPos } from './randomUtils';
import { setupCamera } from './setupCamera';
import { setupDragControls } from './setupDragControls';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';
import { setupStatsPanel } from './setupStatsPanel';



export async function setupThreeJSScene(): Promise<void> {
    // const ARC_SEGMENTS = 210;
    const statsPanel = setupStatsPanel();
    const gui = new GUI();

    const scene = new Scene();

    const params: RoadGeomParams = {
        numSegments: 210,
        thickness: 2,

    }
    const actions = {
        randomiseControlPoints: () => {
            controlPointMeshes.forEach(m => m.position.copy(randomWorldPos(60)))
        }
    };

    gui.add(actions, "randomiseControlPoints")

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const orbitControls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);

    const font = await loadFont();
    const controlPointMeshes: Mesh[] = ["red", "green", "blue", "yellow"]
        .map((c, ix) => makeControlPointSphere(c, ix, font))
    scene.add(...controlPointMeshes);

    setupDragControls(controlPointMeshes, camera, renderer.domElement, orbitControls, {
        drag: () => {
            const curve: CatmullRomCurve3 = makeCurveFromControlPositions(controlPointMeshes, params);
            roadMesh.userData.curve = curve;
            roadMesh.geometry = calculateGeometryForRoad(params, roadMesh.userData.curve)
        }
    });

    const curve: CatmullRomCurve3 = makeCurveFromControlPositions(controlPointMeshes, params);
    const roadMesh: Mesh = createRoadMesh(params, curve);
    roadMesh.userData.curve = curve;

    scene.add(roadMesh);
    setupGUI(roadMesh, params, gui)

    animate();

    function animate() {

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);
        statsPanel.update();
        // required if controls.enableDamping or controls.autoRotate are set to true
        orbitControls.update();

        //TODO: don't recalculate this every frame, only when a position has changed (or a curve param)
        // const attribVals = new Float32BufferAttribute(pts, 3);
        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }


}


function makeCurveFromControlPositions(controlPointMeshes: Mesh[], params: RoadGeomParams): CatmullRomCurve3 {
    //These position objects are importantly shared between the control-point meshes and the curve
    const controlPositions: Vector3[] = controlPointMeshes.map(mesh => mesh.position);

    const curve: CatmullRomCurve3 = new CatmullRomCurve3(controlPositions, false);
    const points = curve.getPoints(params.numSegments - 1);

    // curve.updateArcLengths();
    console.log("making curve: ", { points, params, curve })
    return curve;
}

setupThreeJSScene();

