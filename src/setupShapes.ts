import { Scene, Mesh, Vector3, Color, BoxGeometry, MeshStandardMaterial } from "three";
import { randFloat } from "three/src/math/MathUtils";

export function setupShapes(scene: Scene): Mesh[] {
    const cube1 = makeBoxAt(new Vector3(-10, 10, 0), new Color("magenta"));
    const cube2 = makeBoxAt(new Vector3(10, 15, 0), new Color("cyan"));
    const cube3 = makeBoxAt(new Vector3(0, 7, -15), new Color("lime"));
    const cube4 = makeBoxAt(new Vector3(5, 10, 15), new Color("yellow"));

    scene.add(cube1);
    scene.add(cube2);
    scene.add(cube3);
    scene.add(cube4);
    return [cube1, cube2, cube3, cube4];
}

function makeBoxAt(pos: Vector3, colour: Color) {
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshStandardMaterial({
        wireframe: false,
        color: colour,
        transparent: true,
        opacity: randFloat(0.2, 0.8)
    });

    const boxMesh: Mesh = new Mesh(geometry, material);
    boxMesh.position.copy(pos);
    boxMesh.rotation.x = randFloat(0, Math.PI * 2);
    boxMesh.rotation.y = randFloat(0, Math.PI * 2);
    boxMesh.rotation.z = randFloat(0, Math.PI * 2);
    return boxMesh;
}
