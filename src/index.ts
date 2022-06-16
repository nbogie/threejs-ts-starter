import {
    Scene
} from 'three';
import { setupCamera } from './setupCamera';
import { setupEffectComposer1 } from './setupEffectComposer1';

//try this alternative for more effects (controlled with num keys)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { setupEffectComposer2 } from './setupEffectComposer2';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';
import { setupShapes } from './setupShapes';

export function setupThreeJSScene(): void {

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;

    const scene = new Scene();

    //This is where the post-processing gets set up.
    //Later in animate we'll call effectComposer.render() to actually *use* it
    const effectComposer = setupEffectComposer1(camera, renderer, scene);

    setupHelpers(scene);

    //OR use this slightly fancier one
    //(but don't setup the grid helper with it). 
    //Use the number keys 0, 1,2 or 3 with this one to choose which effect to see.
    // const effectComposer = setupEffectComposer2(camera, renderer, scene);

    setupLights(scene);

    //Add something to look at!  exactly *what* is not important in the study of the post-processing.
    const myCubes = setupShapes(scene);

    animate();

    function animate() {
        for (const cube of myCubes) {
            cube.rotation.y += 0.01;
            cube.rotation.x += 0.02;
        }

        // renderer.render(scene, camera);
        effectComposer.render();

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        requestAnimationFrame(animate);
    }
}

setupThreeJSScene();
