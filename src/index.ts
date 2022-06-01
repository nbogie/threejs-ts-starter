import {
    Scene,
    Mesh,
    MeshStandardMaterial,
    BoxGeometry,
} from 'three';
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

    const controls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);



    //Make some shape(s) and add them to the scene
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshStandardMaterial({
        color: 0xff00ff
    });

    const myShape: Mesh = new Mesh(geometry, material);
    myShape.position.y = 20;
    scene.add(myShape);



    animate();




    function animate() {
        myShape.rotation.y += 0.01;
        myShape.rotation.x += 0.02;

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }


}

setupThreeJSScene();
