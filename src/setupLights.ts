import { AmbientLight, DirectionalLight, Mesh, MeshStandardMaterial, Object3D, Scene, SpotLight, SpotLightHelper, Vector3 } from "three";

export function setupLights(scene: Scene): void {
    const directionalLight1 = new DirectionalLight();
    directionalLight1.position.set(-2, 3, 2);
    scene.add(directionalLight1);

    const directionalLight2 = new DirectionalLight();
    directionalLight2.position.set(-5, 2, -2);
    scene.add(directionalLight2);

    const ambLight = new AmbientLight(0x604040); // soft white light from everywhere
    scene.add(ambLight);
}

export function positionSpotlightsAbove(spotlights: SpotLight[], controlPointMeshes: Object3D[]): void {
    console.log({ positioning: { spotlights, controlPointMeshes } })
    spotlights.forEach((sl, ix) => {
        const cp = controlPointMeshes[ix];
        sl.position.copy(cp.position.clone().add(new Vector3(0, 5, 0)))
        sl.userData.helper?.position.copy(sl.position)
        sl.target = cp;
    })
}
export function createSpotlights(scene: Scene, controlPointMeshes: Mesh[]): SpotLight[] {
    const spotlights = controlPointMeshes.map(cpMesh => new SpotLight((cpMesh.material as MeshStandardMaterial).color, 3, 30));
    scene.add(...spotlights);

    positionSpotlightsAbove(spotlights, controlPointMeshes);


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const spotlightHelpers = spotlights.map(sl => {
        const h = new SpotLightHelper(sl)
        sl.userData.helper = h;
        return h;
    })
    // scene.add(...spotlightHelpers);

    return spotlights;
}