import {
    Scene,
} from 'three';
import { setupCamera } from './setupCamera';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { setupHelpers } from './setupHelpers';
import { setupLights } from './setupLights';
import { setupOrbitControls } from './setupOrbitControls';
import { setupRenderer } from './setupRenderer';
import { setupStatsPanel } from './setupStatsPanel';
import { setupTerrain } from './setupTerrain';

export function setupThreeJSScene(): void {

    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);

    const controls = setupOrbitControls(camera, renderer.domElement);

    const scene = new Scene();

    const statsPanel = setupStatsPanel();

    setupLights(scene);

    // setupHelpers(scene);

    setupTerrain(scene);

    animate();


    function animate() {

        renderer.render(scene, camera);

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        statsPanel.update();

        requestAnimationFrame(animate);
    }
}

setupThreeJSScene();
