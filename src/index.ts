import {
    Mesh, Scene
} from 'three';
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { collect } from './collectionUtils';
import { makeRandomBox } from './randomBox';
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';

export function setupThreeJSScene(): void {

    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const orbitControls = setupOrbitControls(camera, renderer.domElement);


    setupLights(scene);

    setupHelpers(scene);

    const boxes: Mesh[] = collect(10, makeRandomBox);
    scene.add(...boxes);



    //This is the only line you need if you're not using orbit controls, too
    const dragControls = new DragControls(boxes, camera, renderer.domElement);

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

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }


}

setupThreeJSScene();
