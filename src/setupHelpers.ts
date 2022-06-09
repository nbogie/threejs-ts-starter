import { Scene, AxesHelper, GridHelper } from "three";

export function setupHelpers(scene: Scene): void {
    const axesHelper = new AxesHelper(10);
    axesHelper.position.set(-5, 5, 0); //lift up from grid for visibility
    scene.add(axesHelper);
    const gridHelper = new GridHelper(100);
    gridHelper.position.y = 1;
    scene.add(gridHelper);
}