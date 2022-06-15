import { Color, Mesh, MeshStandardMaterial, Object3D, SphereGeometry } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { randFloatSpread } from "three/src/math/MathUtils";

export async function loadFont(): Promise<Font> {
    const fontLoader = new FontLoader();
    const p: Promise<Font> = new Promise((resolve, reject) => {
        //TODO: this is already distributed in the npm package three.  Load from there.
        fontLoader.load('./assets/helvetiker_bold.typeface.json', (f: Font) => resolve(f)
        );
    });
    return p;
}
export function makeControlPointSphere(colourString: string, ix: number, font: Font): Object3D {

    const geometry = new SphereGeometry(5, 8, 8);
    const material = new MeshStandardMaterial({
        color: new Color(colourString),
        flatShading: true
    });
    const mesh: Mesh = new Mesh(geometry, material);

    const textGeom = new TextGeometry((1 + ix) + "", { font: font, size: 4, height: 2, curveSegments: 12 });
    const text = new Mesh(textGeom, new MeshStandardMaterial({ color: "white" }));
    text.position.x += 6;
    mesh.position.x = randFloatSpread(50)
    mesh.position.y = randFloatSpread(50)
    mesh.position.z = randFloatSpread(50)
    mesh.add(text);
    return mesh;
}

