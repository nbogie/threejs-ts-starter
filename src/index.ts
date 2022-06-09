
import {
    BoxGeometry, BufferGeometry, Color, DoubleSide, Material, Mesh, MeshStandardMaterial, PlaneGeometry, Scene
} from 'three';
import { pick } from './randomUtils';
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { createRandomCubeBody, setupPhysics } from './setupPhysics';
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



    const { cubeBodies, groundBody, world } = setupPhysics();
    const cubeMeshes: Mesh[] = [];
    for (const b of cubeBodies) {
        const cubeMesh = createCubeMeshForBody(b, scene)
        cubeMeshes.push(cubeMesh)
    }

    const floorMesh = new Mesh(new PlaneGeometry(10, 10, 2), new MeshStandardMaterial({ side: DoubleSide }));
    scene.add(floorMesh)

    setInterval(() => {
        const cubeBody = createRandomCubeBody(world);
        cubeBodies.push(cubeBody);
        cubeMeshes.push(createCubeMeshForBody(cubeBody, scene))
    }, 100);

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

function createCubeMeshForBody(body: CANNON.Body, scene: Scene): Mesh {
    const colourStrings = [
        "#fc354c",
        "#29221f",
        "#13747d",
        "#0abfbc",
        "#fcf7c5"
    ];
    const color = new Color(pick(colourStrings));
    //We ought to reuse these for better performance.
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshStandardMaterial({
        color
    });
    const cubeMesh: Mesh = new Mesh(geometry, material);
    cubeMesh.userData.body = body;
    scene.add(cubeMesh);
    return cubeMesh;

}