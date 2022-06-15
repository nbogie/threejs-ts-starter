import { BoxGeometry, Camera, Curve, Mesh, MeshStandardMaterial, Scene } from "three";

export function setupCarOnRoad(scene: Scene, camera: Camera): Mesh {
    const carGeom = new BoxGeometry(1, 1, 2);
    carGeom.translate(0, 0.5, 0)
    const carMat = new MeshStandardMaterial();
    const carMesh = new Mesh(carGeom, carMat);
    camera.userData.desiredPosition = carMesh.position;
    scene.add(carMesh);
    return carMesh;
}

export function poscar(carMesh: Mesh, curve: Curve, animFrac: number) {

    //position the car
    const pt = curve.getPoint(animFrac);
    carMesh.position.copy(pt);

    //orient the car
    const tangent = curve.getTangent(animFrac);
    carMesh.lookAt(carMesh.position.clone().add(tangent))


}