import {
    Scene,
    Mesh,
    MeshStandardMaterial,
    BoxGeometry,
    Color,
    Vector3,
} from 'three';
import { randFloat } from 'three/src/math/MathUtils';
import { setupCamera } from './setupCamera';
import { setupEffectComposer } from './setupEffectComposer';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';

export function setupThreeJSScene(): void {

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    const scene = new Scene();
    const effectComposer = setupEffectComposer(camera, renderer, scene);

    setupLights(scene);

    setupHelpers(scene);

    //shape(s)
    function makeBoxAt(pos: Vector3, colour: Color) {
        const geometry = new BoxGeometry(10, 10, 10);
        const material = new MeshStandardMaterial({
            wireframe: false,
            color: colour,
            transparent: true,
            opacity: randFloat(0.2, 0.8)
        });

        const boxMesh: Mesh = new Mesh(geometry, material);
        boxMesh.position.copy(pos);
        boxMesh.rotation.x = randFloat(0, Math.PI * 2);
        boxMesh.rotation.y = randFloat(0, Math.PI * 2);
        boxMesh.rotation.z = randFloat(0, Math.PI * 2);
        return boxMesh;
    }
    const cube1 = makeBoxAt(new Vector3(-10, 10, 0), new Color("magenta"));
    const cube2 = makeBoxAt(new Vector3(10, 15, 0), new Color("cyan"));
    const cube3 = makeBoxAt(new Vector3(0, 7, -15), new Color("lime"));
    const cube4 = makeBoxAt(new Vector3(5, 10, 15), new Color("yellow"));

    scene.add(cube1);
    scene.add(cube2);
    scene.add(cube3);
    scene.add(cube4);


    animate();


    function animate() {
        for (const cube of [cube1, cube2, cube3, cube4]) {
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
