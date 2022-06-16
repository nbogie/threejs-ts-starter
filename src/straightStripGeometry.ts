import { BufferGeometry, Vector3, Float32BufferAttribute } from "three";

export interface StripParams {
    numSegments: number;
    thickness: number;
}
export function calculatStraightStripGeometry(params: StripParams): BufferGeometry {
    const rawVerts: Vector3[] = [];
    const rawNorms: Vector3[] = [];
    const numSegments = Math.floor(params.numSegments);
    const width = params.thickness;

    for (let i = 0; i < numSegments; i++) {
        const z = -i;
        const y = 0;

        rawVerts.push(new Vector3(-1 * width, y, z));
        rawVerts.push(new Vector3(1 * width, y, z));

        rawNorms.push(new Vector3(0, 1, 0));
        rawNorms.push(new Vector3(0, 1, 0));
    }

    //copy details in, in their triangle orders.
    const positions: Vector3[] = [];
    const normals: Vector3[] = [];
    //every segment has two corresponding verts at that level.
    //and 6 corresponding triangle-vertices (for two triangles)
    for (let i = 0; i < numSegments - 1; i++) {
        const [a, b, c, d] = rawVerts.slice(i * 2, i * 2 + 4)
        positions.push(a, b, c, b, d, c)

        const [na, nb, nc, nd] = rawNorms.slice(i * 2, i * 2 + 4);
        normals.push(na, nb, nc, nb, nd, nc)
    }
    //copy the x, y, z of each of these vectors into buffer attributes (just numbers not vectors)
    const posAttr = new Float32BufferAttribute(positions.flatMap(p => [p.x, p.y, p.z]), 3);
    const normAttr = new Float32BufferAttribute(normals.flatMap(p => [p.x, p.y, p.z]), 3);
    const geom = new BufferGeometry();
    geom.setAttribute("position", posAttr);
    geom.setAttribute("normal", normAttr);
    return geom;
}