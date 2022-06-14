import { AmbientLight, Color, DirectionalLight, Scene } from "three";

export function setupLights(scene: Scene): void {
    const directionalLight1 = new DirectionalLight(new Color("white"), 0.4);
    directionalLight1.position.set(-2, 3, 2);
    scene.add(directionalLight1);

    const directionalLight2 = new DirectionalLight(new Color("white"), 0.3);
    directionalLight2.position.set(-5, 2, -2);
    scene.add(directionalLight2);

    const ambLight = new AmbientLight(0xa08080, 1); // soft white light from everywhere
    scene.add(ambLight);
}