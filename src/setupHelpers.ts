import { Scene, AxesHelper, GridHelper } from "three";

export function setupHelpers(scene: Scene): void {
    const axesHelper = new AxesHelper(10);
    axesHelper.position.set(0, 1, 0); //lift up from grid for visibility
    scene.add(axesHelper);
    const gridHelper = new GridHelper(100);
    gridHelper.position.y -= 0.5;
    scene.add(gridHelper);
}