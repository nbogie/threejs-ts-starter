import {
    BoxGeometry, Color, Mesh,
    MeshStandardMaterial, Scene, Vector3
} from 'three';

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

import { pick } from './randomUtils';
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';

export function setupThreeJSScene(): void {
    const gui = new GUI();

    const scene = new Scene();

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);

    setupLights(scene);

    setupHelpers(scene);
    let globalIds = 0;
    function makeCube(pos: Vector3, scene: Scene): Mesh {

        const palette = ["#efeecc", "#fe8b05", "#fe0557", "#400403", "#0aabba"]
        //Make some shape(s) and add them to the scene
        const geometry = new BoxGeometry(10, 10, 10);
        const material = new MeshStandardMaterial({
            color: new Color(pick(palette)),
            transparent: true,
        });

        const myShape: Mesh = new Mesh(geometry, material);
        myShape.position.copy(pos);
        myShape.userData.rotSpeed = 0.01;
        myShape.userData.id = globalIds++;
        scene.add(myShape);
        return myShape;
    }
    const myCubes: Mesh[] = [];

    myCubes.push(makeCube(new Vector3(-40, 30, 10), scene));
    myCubes.push(makeCube(new Vector3(50, 20, 10), scene));
    myCubes.push(makeCube(new Vector3(20, 30, 14), scene));

    for (const cube of myCubes) {
        const scaleControl = {
            set scale(val: number) {
                cube.scale.x = val;
                cube.scale.y = val;
                cube.scale.z = val;
            },
            get scale() { return cube.scale.x }
        }

        const folder = gui.addFolder(`myCubes[${cube.userData.id}]`)
        folder.add(cube.position, 'x', -50, 50)
        folder.add(cube.position, 'y', -50, 50)
        folder.add(cube.position, 'z', -50, 50)
        folder.add(cube.scale, 'x', 0.1, 2).name("scale.x")
        folder.add(scaleControl, 'scale', 0.1, 2).listen()
        folder.add(cube.userData, 'rotSpeed', -0.03, 0.03).listen()
        folder.add(cube.material, 'opacity', 0, 1)
        folder.add(cube.material, 'transparent')
        folder.add(cube.material, 'wireframe')
        gui.addColor(cube.material, 'color');
        folder.close()
    }
    gui.folders[0].open()

    animate();

    function animate() {
        for (const cube of myCubes) {
            cube.rotation.y += cube.userData.rotSpeed;
            cube.rotation.x += cube.userData.rotSpeed * 2;
        }

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }
}

setupThreeJSScene();
