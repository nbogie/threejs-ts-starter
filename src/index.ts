import {
    BoxGeometry,
    Color, Mesh,
    MeshStandardMaterial, Scene
} from 'three';
import { setupCamera } from './setupCamera';
// import { setupGUIExample } from './setupGUIExample';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';

/** 
 * Build a three.js scene and start it animating.
 * (This function can be named whatever you like.)
 */
export function setupAndAnimateMyThreeJSScene(): void {

    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const orbitControls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);

    //You can try this!
    //setupGUIExample(scene);


    //Make a cube and add it to the scene.
    //A mesh needs a geometry and a material...
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshStandardMaterial({ color: new Color("yellow") });
    const myCubeMesh = new Mesh(geometry, material);
    myCubeMesh.position.y = 20;
    scene.add(myCubeMesh);

    animate();




    /** 
     * This will update some objects in the scene, 
     * render one frame to the canvas,
     * and queue itself to be called again very soon.
     * You can name this function whatever you like.
     */
    function animate() {
        myCubeMesh.rotation.y += 0.01;
        myCubeMesh.rotation.x += 0.02;

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        orbitControls.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }


}

setupAndAnimateMyThreeJSScene();
