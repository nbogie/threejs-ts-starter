import { Scene, BoxGeometry, MeshStandardMaterial, Color, Mesh } from "three";
import { randFloat, randFloatSpread } from "three/src/math/MathUtils";

import { pick } from "./randomUtils";

export function setupShapeCluster(scene: Scene): void {
    //From https://nice-colours-quicker.netlify.app/
    const palette = [
        "#00a0b0",
        "#6a4a3c",
        "#cc333f",
        "#eb6841",
        "#edc951"
    ];

    for (let i = 0; i < 40; i++) {
        const w = randFloat(8, 16);
        const h = randFloat(8, 16);
        const d = randFloat(8, 16);

        const geometry = new BoxGeometry(w, h, d);
        const material = new MeshStandardMaterial({
            color: new Color(pick(palette))
        });

        const myShape: Mesh = new Mesh(geometry, material);
        const x = randFloatSpread(40);
        const y = randFloatSpread(40);
        const z = randFloatSpread(40);
        myShape.position.set(x, y, z);

        scene.add(myShape);
    }
}
