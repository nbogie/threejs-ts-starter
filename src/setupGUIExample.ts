import {
    BoxGeometry, Color, Mesh,
    MeshStandardMaterial, Scene
} from 'three';
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { randFloat, randFloatSpread } from 'three/src/math/MathUtils';
import { pick } from './randomUtils';


/**
 * Creates and adds a simple GUI to the scene along with a new cube which the gui will alter.
 * 
 * Uses lil-gui: https://lil-gui.georgealways.com/
 */
export function setupGUIExample(scene: Scene): GUI {

    //make and add a cube so we have something to change with our gui!
    const cube = makeCube();
    scene.add(cube);


    //make an (optional) list of functions the gui can offer buttons for, too
    const actions = {
        randomiseBox: function () {
            cube.scale.x = pick([1, 2, 3, 10])
            cube.rotation.z = randFloatSpread(3.14);
            cube.position.z = pick([-40, -20, 20])
        }
    }

    //make the gui to edit various properties of the box
    const gui = new GUI();
    gui.add(cube.position, 'x', -50, 50, 5)
    gui.add(cube.position, 'y', 10, 50, 10)
    gui.add(cube.position, 'z', -50, 50, 25)
    gui.add(cube.material, 'wireframe')
    gui.add(cube.material, 'opacity', 0, 1, 0.01)
    gui.addColor(cube.material, 'color');
    gui.add(cube.scale, 'x', 0.1, 2).name("width").listen()
    gui.add(actions, "randomiseBox");

    return gui; //return the gui so that the caller can add more options to it.

}

/** Create and return a random cube */
function makeCube(): Mesh {
    const geometry = new BoxGeometry(12, 12, 12);
    const material = new MeshStandardMaterial({
        color: new Color("orange"),
        transparent: true,
        opacity: 0.8,
        wireframe: false
    });

    const myShape: Mesh = new Mesh(geometry, material);
    myShape.position.set(randFloatSpread(20), randFloat(10, 20), randFloatSpread(20))
    return myShape;
}