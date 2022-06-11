import { Clock, Color, Scene } from 'three';
import { setupCamera } from './setupCamera';
import { setupGUIWithCamera } from './setupGUIWithCamera';
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
    scene.background = new Color("dodgerblue");

    const statsPanel = setupStatsPanel();

    setupLights(scene);

    // setupHelpers(scene);

    const gui = setupGUIWithCamera(camera);
    const terrain = setupTerrain(scene, 300, gui);
    const clock = new Clock();

    animate();

    function animate() {
        renderer.render(scene, camera);

        terrain.updateTerrain(clock.getElapsedTime() * 0.04);

        if (camera.userData.shouldLerp) {
            camera.position.lerp(camera.userData.desiredPosition, 0.05)
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        statsPanel.update();

        requestAnimationFrame(animate);
    }
}

setupThreeJSScene();
