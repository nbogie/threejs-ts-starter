import { BoxGeometry, Camera, CatmullRomCurve3, Group, Mesh, MeshStandardMaterial, Scene } from "three";
import { loadModel } from "./loadModel";

export async function setupCarOnRoad(scene: Scene, camera: Camera): Promise<{ carGroup: Group, carBoxMesh: Mesh, carModel: Group }> {

    const carModel = await loadModel("./assets/little-red-truck.glb");
    if (!carModel) {
        throw new Error("aborting - issue loading model");
    }

    const boxGeom = new BoxGeometry(1, 1, 2);
    boxGeom.translate(0, 0.5, 0)
    const boxMat = new MeshStandardMaterial();
    const carBoxMesh = new Mesh(boxGeom, boxMat);

    const carGroup = new Group();
    carGroup.add(carModel);
    carGroup.add(carBoxMesh);
    carModel.visible = false;

    camera.userData.desiredPosition = carGroup.position;
    scene.add(carGroup);
    return { carGroup, carBoxMesh, carModel };
}

export function positionAndOrientCarOnCurve(carMesh: Group, curve: CatmullRomCurve3, animFrac: number): void {

    //position the car
    const pt = curve.getPoint(animFrac);
    carMesh.position.copy(pt);

    //orient the car
    const tangent = curve.getTangent(animFrac);
    carMesh.lookAt(carMesh.position.clone().add(tangent))


}