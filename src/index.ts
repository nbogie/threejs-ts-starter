import {
    Scene,
    Mesh,
    MeshStandardMaterial,
    BoxGeometry,
    PlaneGeometry,
    DoubleSide,
} from 'three';
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';

import { setupPhysics } from './setupPhysics';
export function setupThreeJSScene(): void {

    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);



    //Make some shape(s) and add them to the scene
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshStandardMaterial({
        color: 0xff00ff
    });


    const { cubeBodies, groundBody, world } = setupPhysics();
    const cubeMeshes: Mesh[] = [];
    for (const b of cubeBodies) {
        const cubeMesh: Mesh = new Mesh(geometry, material);
        scene.add(cubeMesh);
        cubeMesh.userData.body = b;
        cubeMeshes.push(cubeMesh)
    }

    const floorMesh = new Mesh(new PlaneGeometry(10, 10, 2), new MeshStandardMaterial({ side: DoubleSide }));
    scene.add(floorMesh)
    animate();




    function animate() {
        for (const mesh of cubeMeshes) {
            const body = mesh.userData.body;
            mesh.quaternion.copy(body.quaternion);
            mesh.position.copy(body.position);
        }

        //@ts-ignore
        floorMesh.position.copy(groundBody.position);
        //@ts-ignore
        floorMesh.quaternion.copy(groundBody.quaternion);

        world.step(1 / 60);

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }


}

setupThreeJSScene();
