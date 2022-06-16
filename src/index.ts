import { CatmullRomCurve3, Clock, Group, Mesh, Scene } from 'three';
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { positionAndOrientCarOnCurve, setupCarOnRoad } from './car';
import { makeControlPointMeshes } from './controlPoint';
import { logJSONToHTML } from './pageUtils';
import { randomWorldPos } from './randomUtils';
import { calculateGeometryForRoad, createRoadMeshOnce, makeCurveFromControlPositions, RoadGeomParams, setupGUIForRoadParams } from './roadGeometry';
import { setupCamera } from './setupCamera';
import { DragAndOrbitControlSettings, setupDragControls } from './setupDragControls';
import { setupHelpers } from './setupHelpers';
import { createSpotlights, positionSpotlightsAbove, setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';
import { setupStatsPanel } from './setupStatsPanel';

export async function setupThreeJSScene(): Promise<void> {
    const statsPanel = setupStatsPanel();
    const gui = new GUI();

    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const orbitControls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);

    const controlPointMeshes: Mesh[] = await makeControlPointMeshes(scene);

    const dragAndOrbitControlOptions: DragAndOrbitControlSettings = { shouldUseOrbitControls: true }
    const dragControls = setupDragControls(controlPointMeshes, camera, renderer.domElement, dragAndOrbitControlOptions, orbitControls, {
        drag: () => {
            regenerateCurveAndGeometry();
        }
    });

    const roadParams: RoadGeomParams = {
        numSegments: 210,
        thickness: 2,
    }

    const curve: CatmullRomCurve3 = makeCurveFromControlPositions(controlPointMeshes, roadParams);
    const roadMesh: Mesh = createRoadMeshOnce(roadParams, curve);
    scene.add(roadMesh);
    roadMesh.userData.curve = curve;
    setupGUIForRoadParams(roadMesh, roadParams, gui)


    const carMesh = setupCarOnRoad(scene, camera);

    const spotlights = createSpotlights(scene, controlPointMeshes);

    const actions = {
        randomiseControlPoints: () => {
            controlPointMeshes.forEach(m => m.position.copy(randomWorldPos(60)))
            positionSpotlightsAbove(spotlights, controlPointMeshes)
            regenerateCurveAndGeometry();
        }
    };

    gui.add(actions, "randomiseControlPoints")

    gui.add(dragAndOrbitControlOptions, "shouldUseOrbitControls").name("layout mode").onChange(
        (v: boolean) => {
            orbitControls.enabled = v
            if (v) {
                orbitControls.reset()
                dragControls.enabled = true;
            } else {
                camera.position.set(0, 2, 0)
                dragControls.enabled = false;
            }
        })

    const clock = new Clock();

    //Use a camera group to lift the camera up off the road.
    const cameraGroup = new Group();
    cameraGroup.add(camera);
    if (!dragAndOrbitControlOptions.shouldUseOrbitControls) {
        //Place the camera up relative to the pivot of its group
        camera.position.set(0, 2, 0);
    }

    animate();

    function animate() {
        renderer.render(scene, camera);
        statsPanel.update();

        const animFrac = (clock.getElapsedTime() / 20) % 1;
        positionAndOrientCarOnCurve(carMesh, curve, animFrac);

        //update camera (either leave it to orbit controls or have it chase car)
        if (dragAndOrbitControlOptions.shouldUseOrbitControls) {
            orbitControls.update();
        } else {
            //chase.  at start of loop, race quickly back to car
            if (animFrac < 0.01) {
                cameraGroup.position.lerp(camera.userData.desiredPosition, 0.1);
            } else {
                cameraGroup.position.lerp(camera.userData.desiredPosition, 0.02);
            }
            camera.lookAt(camera.userData.desiredPosition);
        }

        logJSONToHTML({ animFrac })

        requestAnimationFrame(animate);
    }

    function regenerateCurveAndGeometry() {
        //TODO: what can we re-use, rather than regenerate?
        const curve: CatmullRomCurve3 = makeCurveFromControlPositions(controlPointMeshes, roadParams);
        roadMesh.userData.curve = curve;
        roadMesh.geometry = calculateGeometryForRoad(roadParams, roadMesh.userData.curve)
    }
}

setupThreeJSScene();

