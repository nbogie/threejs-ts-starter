//See https://threejs.org/manual/#en/custom-buffergeometry
//and for some concepts (though in unity): https://www.youtube.com/watch?v=6xs0Saff940

import { BufferGeometry, Float32BufferAttribute, Mesh, MeshNormalMaterial, Vector3 } from "three";
export function createQuadRing(params: RingParams): Mesh {
    const geom = calculateGeometryForRing(params);
    const material = new MeshNormalMaterial();
    // const material = new MeshStandardMaterial({ color: new Color("orange"), wireframe: true });
    const mesh = new Mesh(geom, material);//{ color: 0xFFFF00 }

    return mesh;
}

export interface RingParams {
    numSegments: number;
    thickness: number;
    radius: number;
    spiralGain: number;
}


export function calculateGeometryForRing(params: RingParams): BufferGeometry {
    const rawVerts: Vector3[] = [];
    const rawNorms: Vector3[] = [];
    console.log({ params })
    const numSegments = Math.floor(params.numSegments);

    const outerRadius = params.radius;
    const innerRadius = params.radius - params.thickness;
    const spiralGain = params.spiralGain;

    for (let i = 0; i < numSegments; i++) {
        const angle = i * 2 * Math.PI / (numSegments - 1);

        const z1 = outerRadius * Math.sin(angle);
        const z2 = innerRadius * Math.sin(angle);
        const y = i * spiralGain / numSegments;

        const x1 = outerRadius * Math.cos(angle);
        const x2 = innerRadius * Math.cos(angle);
        rawVerts.push(new Vector3(x1, y, z1));
        rawVerts.push(new Vector3(x2, y, z2));

        rawNorms.push(new Vector3(0, 1, 0)); //incorrect if the ring has a slope.
        rawNorms.push(new Vector3(0, 1, 0)); //same
    }

    //copy details in, in their triangle orders.
    const posAttr = new Float32BufferAttribute(rawVerts.flatMap(p => [p.x, p.y, p.z]), 3);
    const normAttr = new Float32BufferAttribute(rawNorms.flatMap(p => [p.x, p.y, p.z]), 3);
    const geom = new BufferGeometry();
    geom.setAttribute("position", posAttr);
    geom.setAttribute("normal", normAttr);

    const indices = [];
    for (let i = 0; i < numSegments - 1; i++) {
        const off = i * 2;
        indices.push(off + 0, off + 1, off + 2, off + 1, off + 3, off + 2);
    }
    geom.setIndex(indices);

    // geom.computeVertexNormals() //alternatively
    return geom;
}