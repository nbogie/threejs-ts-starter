import { Clock, Mesh, PlaneGeometry, Scene, ShaderMaterial } from 'three';
import { setupCamera } from './setupCamera';
import { setupCustomShaderMaterial } from './setupCustomShaderMaterial';
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

    const planeGeometry1 = new PlaneGeometry(30, 30, 30);
    const material = setupCustomShaderMaterial();

    const mesh: Mesh = new Mesh(planeGeometry1, material);
    mesh.position.z = -2;
    scene.add(mesh);

    const clock = new Clock();

    animate();


    function animate() {

        mesh.rotation.z += 0.002;
        (mesh.material as ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();

        //Draw the current scene to the canvas - one frame of animation.
        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        //Queue for this function to be called again when the browser is ready for another animation frame.
        requestAnimationFrame(animate);
    }


}

setupThreeJSScene();
