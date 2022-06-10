import { AmbientLight, DirectionalLight, Scene } from "three";

export function setupLights(scene: Scene): void {
    //lights
    const dirLight1 = new DirectionalLight(0xffffff, 0.7);
    scene.add(dirLight1);
    dirLight1.position.set(-2, 5, 2).multiplyScalar(3);
    const dirLight2 = new DirectionalLight(0xaaaaff, 0.3)
    dirLight2.position.set(-10, 2, -2).multiplyScalar(3);

    scene.add(dirLight2);

    // scene.add(new DirectionalLightHelper(dirLight1, 3));
    // scene.add(new DirectionalLightHelper(dirLight2, 3));

    const light = new AmbientLight(0x604040, 0.2); // soft white light
    scene.add(light);
}