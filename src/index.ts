import { Scene } from 'three';
import { setupCamera } from './setupCamera';
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

    const terrain = setupTerrain(scene);

    let frameCount = 0;

    animate();

    function animate() {
        renderer.render(scene, camera);
        for (const tile of terrain.tiles) {
            const noiseValues = terrain.getValuesAtGridPos(tile.userData.gridPos, frameCount / 300);
            tile.position.y = noiseValues.landHeight;
            tile.material = noiseValues.material;
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        controls.update();

        statsPanel.update();

        requestAnimationFrame(animate);
        frameCount++
    }
}

setupThreeJSScene();
