import { randFloatSpread } from 'three/src/math/MathUtils';
import {
    BufferGeometry, CatmullRomCurve3, Line,
    LineBasicMaterial, Object3D, Scene, Vector3
} from 'three';
import { loadFont, makeControlPointSphere } from './controlPoint';
import { setupCamera } from './setupCamera';
import { setupDragControls } from './setupDragControls';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';
//@ts-ignore  - no types?
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { randomWorldPos } from './randomUtils';



export async function setupThreeJSScene(): Promise<void> {
    const ARC_SEGMENTS = 210;
    const gui = new GUI();
    const scene = new Scene();

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
    const controlPointMeshes: Object3D[] = ["red", "green", "blue", "yellow"].map((c, ix) => makeControlPointSphere(c, ix, font))
    scene.add(...controlPointMeshes);

    setupDragControls(controlPointMeshes, camera, renderer.domElement, orbitControls);

    const myLineMeshOnCurve = makeLineOnCurveFromControlPositions();

    function makeLineOnCurveFromControlPositions(): Line {
        //These position objects are importantly shared between the control-point meshes and the curve
        const controlPositions: Vector3[] = controlPointMeshes.map(mesh => mesh.position);

        const curve: CatmullRomCurve3 = new CatmullRomCurve3(controlPositions);

        const points = curve.getPoints(ARC_SEGMENTS - 1);
        const geometry = new BufferGeometry().setFromPoints(points);
        const material = new LineBasicMaterial({ color: 0xffffff, });
        const lineMesh = new Line(geometry, material);

        lineMesh.userData.curve = curve;
        scene.add(lineMesh);
        return lineMesh;
    }
    animate();


    function animate() {

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        orbitControls.update();

        //TODO: don't recalculate this every frame, only when a position has changed (or a curve param)
        updateLine(myLineMeshOnCurve);

        // const attribVals = new Float32BufferAttribute(pts, 3);
        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }

    function updateLine(spline: Line) {
        //It seems it is not necessary to update the curve because
        // its .points array is a list of shared references with the positions of controlPointMeshes.

        //We will update this positions buffer attribute for the line
        const lineGeomPositions = spline.geometry.attributes.position;

        //The curve shares (aliased) position objects with our controlPointMeshes
        const curve: CatmullRomCurve3 = spline.userData.curve;

        //temp to copy into
        const curvePt = new Vector3();

        for (let i = 0; i < ARC_SEGMENTS; i++) {
            const t = i / (ARC_SEGMENTS - 1);//interpolation fraction
            //Ask the curve for an interpolated position from 0-1.
            //Give it an object to copy into (for performance)
            curve.getPoint(t, curvePt);//get interpolated point t of the way through

            //set this to the line's position
            lineGeomPositions.setXYZ(i, curvePt.x, curvePt.y, curvePt.z);
        }

        lineGeomPositions.needsUpdate = true;
    }


}
setupThreeJSScene();

