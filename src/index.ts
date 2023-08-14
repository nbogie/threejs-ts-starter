import {
    Scene,
    Mesh,
    MeshStandardMaterial,
    BoxGeometry,
    AudioAnalyser,
    Color,
} from 'three';
import { once } from './once';
import { setupAudioAnalyser } from './setupAudioAnalyser';
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';

export function setupThreeJSScene(): void {

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);

    const scene = new Scene();

    setupLights(scene);

    setupHelpers(scene);

    //setup audio

    let audioAnalyser: AudioAnalyser | null;

    const numEqBands = 64;

    //The audio context can only be started reliably AFTER a user gesture
    renderer.domElement.addEventListener("click", once(() => audioAnalyser = setupAudioAnalyser(camera, { numBands: numEqBands })));


    //shape(s) make a lot of little cubes, one for each band of the EQ visualiser.
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshStandardMaterial({
        color: 0xff00ff
    });
    const eqShapes: Mesh[] = [];
    for (let i = 0; i < numEqBands; i++) {
        const myShape: Mesh = new Mesh(geometry, material);
        myShape.position.x = i;
        myShape.position.y = 20;
        scene.add(myShape);
        eqShapes.push(myShape);
    }
    //make a special cube for bass and for hi-hat
    const bassBox = new Mesh(geometry, new MeshStandardMaterial({ color: new Color("cyan") }))
    const hiHatBox = new Mesh(geometry, new MeshStandardMaterial({ color: new Color("cyan") }))
    bassBox.position.set(-25, 0, -10);
    hiHatBox.position.set(25, 0, -10);
    scene.add(bassBox)
    scene.add(hiHatBox)

    //let's go!
    animate();

    function animate() {

        //if the analyser is ready - might take a while to load audio
        if (audioAnalyser) {

            //seems to work - documentation is sparse
            audioAnalyser.getAverageFrequency();
            for (let i = 0; i < numEqBands; i++) {
                eqShapes[i].position.y = 20 * audioAnalyser.data[i] / 255;
            }
            //draw out some specific frequencies
            bassBox.scale.setScalar(10 * audioAnalyser.data[0] / 255);
            hiHatBox.scale.setScalar(15 * audioAnalyser.data[16] / 255);
        }
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        requestAnimationFrame(animate);
    }
}

setupThreeJSScene();
