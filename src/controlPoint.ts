import { Color, Group, Mesh, MeshStandardMaterial, Object3D, SphereGeometry } from "three";
import { randFloatSpread } from "three/src/math/MathUtils";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
export async function loadFont(): Promise<Font> {
    const fontLoader = new FontLoader();
    const p: Promise<Font> = new Promise((resolve, reject) => {
        //TODO: this is already distributed in the npm package three
        fontLoader.load('./assets/helvetiker_bold.typeface.json', (f: Font) => resolve(f)
        );
    });
    return p;
}
export function makeControlPointSphere(colourString: string, font: Font): Object3D {

    const geometry = new SphereGeometry(5, 8, 8);
    const material = new MeshStandardMaterial({
        color: new Color(colourString),
        flatShading: true
    });
    const mesh: Mesh = new Mesh(geometry, material);


    const textGeom = new TextGeometry(colourString, { font: font, size: 4, height: 2, curveSegments: 12 });
    const text = new Mesh(textGeom, new MeshStandardMaterial({ color: "white" }));
    text.position.x += 6;
    const group = new Group();
    group.add(mesh);
    group.add(text);
    group.position.x = randFloatSpread(50)
    group.position.y = randFloatSpread(50)
    group.position.z = randFloatSpread(50)
    return group;
}

