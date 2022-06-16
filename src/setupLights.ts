// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AmbientLight, Color, DirectionalLight, DirectionalLightHelper, Scene } from "three";

export function setupLights(scene: Scene): void {
    const directionalLight1 = new DirectionalLight(new Color("white"));
    directionalLight1.position.set(-10, 15, 10);
    scene.add(directionalLight1);

    const directionalLight2 = new DirectionalLight(new Color("red"));
    directionalLight2.position.set(-15, 6, -6);
    scene.add(directionalLight2);

    // const helper1 = new DirectionalLightHelper(directionalLight1);
    // const helper2 = new DirectionalLightHelper(directionalLight2);
    // scene.add(helper1, helper2);

    const ambLight = new AmbientLight(0x604040); // a little warm-white light from everywhere
    scene.add(ambLight);
}