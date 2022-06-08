import { BoxGeometry, MeshStandardMaterial, Color, Mesh } from "three";
import { randFloat, randFloatSpread } from "three/src/math/MathUtils";
import { pick } from "./randomUtils";

export function makeRandomBox(): Mesh {
    const palette = [
        "#a7c5bd",
        "#e5ddcb",
        "#eb7b59",
        "#cf4647",
        "#524656"
    ]
    //Make some shape(s) and add them to the scene
    const geometry = new BoxGeometry(randFloat(4, 10), randFloat(4, 10), randFloat(4, 10),);
    const material = new MeshStandardMaterial({
        color: new Color(pick(palette))
    });
    const mesh: Mesh = new Mesh(geometry, material);
    mesh.position.x = randFloatSpread(50)
    mesh.position.y = randFloatSpread(50)
    mesh.position.z = randFloatSpread(50)
    return mesh;
}
