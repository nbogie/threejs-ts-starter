import { Scene } from 'three';
import { setupCamera } from './setupCamera';
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';
import { setupShapeCluster } from './setupShapeCluster'

//Try out this alternative
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { setupSymmetricalShapeCluster } from './setupSymmetricalShapeCluster';

export function setupThreeJSScene(): void {

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);

    const scene = new Scene();

    setupLights(scene);

    setupHelpers(scene);

    setupShapeCluster(scene);
    //setupSymmetricalShapeCluster(scene);

    setupKeyHandlers();

    animate();



    function animate() {

        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        requestAnimationFrame(animate);
    }

    function setupKeyHandlers(): void {

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "r") {
                controls.autoRotate = !controls.autoRotate;
            }
        }
        document.addEventListener("keydown", handleKeyDown);
    }
}

setupThreeJSScene();
