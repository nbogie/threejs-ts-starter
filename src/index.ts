import {
    BufferGeometry, Group,
    Line,
    LineBasicMaterial, Object3D, Scene
} from 'three';
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { loadFont, makeControlPointSphere } from './controlPoint';
import { setupCamera } from './setupCamera';
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

    //This is the only line you need if you're not using orbit controls, too
    const font = await loadFont();
    const boxes: Object3D[] = ["red", "green", "blue", "yellow"].map(c => makeControlPointSphere(c, font))
    scene.add(...boxes);

    //create a blue LineBasicMaterial
    const material = new LineBasicMaterial({ color: 0x0000ff });

    const points = boxes.map(mesh => mesh.position);

    const geometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(geometry, material);
    scene.add(line);

    const dragControls = new DragControls(boxes, camera, renderer.domElement);
    dragControls.transformGroup = true;

    dragControls.addEventListener('dragstart', function (event) {
        orbitControls.enabled = false;
        event.object.material.emissive.set(0x777777);
    });

    dragControls.addEventListener('dragend', function (event) {
        orbitControls.enabled = true;
        event.object.material.emissive.set(0x000000);
    });



    animate();




    function animate() {

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        orbitControls.update();
        const pts = [];
        for (let ix = 0; ix < boxes.length; ix++) {
            const { position: { x, y, z } } = boxes[ix];
            pts.push(x, y, z);
            line.geometry.attributes.position.setXYZ(ix, x, y, z,);
        }
        line.geometry.attributes.position.needsUpdate = true;

        // const attribVals = new Float32BufferAttribute(pts, 3);
        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }


}

setupThreeJSScene();
