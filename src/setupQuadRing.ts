import { BufferGeometry, Color, Float32BufferAttribute, Mesh, MeshNormalMaterial, MeshStandardMaterial, Vector3 } from "three";
export function createQuadRing(): Mesh {

    const geom = calculateMeshGeometry({ numSegments: 100, thickness: 4, radius: 15, spiralGain: 5 });
    // geom.computeVertexNormals();
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

export function OLDcalculateMeshGeometry(params: RingParams): BufferGeometry {
    const rawVerts: Vector3[] = [];
    const rawNorms: Vector3[] = [];
    const numSegments = Math.floor(params.numSegments);
    const width = params.thickness;
    for (let i = 0; i < numSegments; i++) {
        const z = -i;
        const y = i / 4;

        rawVerts.push(new Vector3(-1 * width, y, z));
        rawVerts.push(new Vector3(1 * width, y, z));

        rawNorms.push(new Vector3(0, 1, 0));
        rawNorms.push(new Vector3(0, 1, 0));
    }

    //copy details in, in their triangle orders.
    const positions: Vector3[] = [];
    const normals: Vector3[] = [];
    for (let i = 0; i < numSegments - 1; i++) {
        const [a, b, c, d] = rawVerts.slice(i, i + 4)
        positions.push(a, b, c, b, d, c)

        const [na, nb, nc, nd] = rawNorms.slice(i, i + 4);
        normals.push(na, nb, nc, nb, nd, nc)
    }
    const posAttr = new Float32BufferAttribute(positions.flatMap(p => [p.x, p.y, p.z]), 3);
    const normAttr = new Float32BufferAttribute(normals.flatMap(p => [p.x, p.y, p.z]), 3);
    const geom = new BufferGeometry();
    geom.setAttribute("position", posAttr);
    geom.setAttribute("normal", normAttr);
    return geom;
}

export function calculateMeshGeometry(params: RingParams): BufferGeometry {
    const rawVerts: Vector3[] = [];
    const rawNorms: Vector3[] = [];
    console.log({ params })
    const numSegments = Math.floor(params.numSegments);

    const outerRadius = params.radius;
    const innerRadius = params.radius - params.thickness;
    const spiralGain = params.spiralGain;

    for (let i = 0; i < numSegments; i++) {
        const angle = 2 * i * Math.PI * 2 / numSegments;

        const z1 = outerRadius * Math.sin(angle);
        const z2 = innerRadius * Math.sin(angle);
        const y = i * spiralGain / numSegments;

        const x1 = outerRadius * Math.cos(angle);
        const x2 = innerRadius * Math.cos(angle);
        rawVerts.push(new Vector3(x1, y, z1));
        rawVerts.push(new Vector3(x2, y, z2));

        rawNorms.push(new Vector3(0, 1, 0));
        rawNorms.push(new Vector3(0, 1, 0));
    }

    //copy details in, in their triangle orders.
    const positions: Vector3[] = [];
    const normals: Vector3[] = [];
    for (let i = 0; i < numSegments - 1; i++) {
        const [a, b, c, d] = rawVerts.slice(i, i + 4)
        positions.push(a, b, c, b, d, c)

        const [na, nb, nc, nd] = rawNorms.slice(i, i + 4);
        normals.push(na, nb, nc, nb, nd, nc)
    }
    const posAttr = new Float32BufferAttribute(positions.flatMap(p => [p.x, p.y, p.z]), 3);
    const normAttr = new Float32BufferAttribute(normals.flatMap(p => [p.x, p.y, p.z]), 3);
    const geom = new BufferGeometry();
    geom.setAttribute("position", posAttr);
    geom.setAttribute("normal", normAttr);
    return geom;
}