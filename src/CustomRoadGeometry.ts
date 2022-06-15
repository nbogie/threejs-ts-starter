import { BufferGeometry, CatmullRomCurve3, Color, Float32BufferAttribute, Mesh, MeshStandardMaterial, Vector3 } from 'three';
//@ts-ignore
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


export interface RoadGeomParams {
    numSegments: number;
    thickness: number;
}

export function createRoadMeshOnce(params: RoadGeomParams, curve: CatmullRomCurve3): Mesh {
    const geom = calculateGeometryForRoad(params, curve);
    // const material = new MeshNormalMaterial();
    const material = new MeshStandardMaterial({
        color: new Color("gray"),
        wireframe: false
    });
    const mesh = new Mesh(geom, material);
    return mesh;
}

export function setupGUIForRoadParams(roadMesh: Mesh, params: RoadGeomParams, gui: GUI): void {
    function recalcGeom() {
        roadMesh.geometry = calculateGeometryForRoad(params, roadMesh.userData.curve);
    }
    gui.add(params, "numSegments", 4, 200, 2).onChange(recalcGeom);
    gui.add(params, "thickness", 0.2, 10).onChange(recalcGeom);
    gui.add(roadMesh.material, "wireframe")
}

export function calculateGeometryForRoad(params: RoadGeomParams, curve: CatmullRomCurve3): BufferGeometry {
    const rawVerts: Vector3[] = [];
    const rawNorms: Vector3[] = [];
    const numSegments = Math.floor(params.numSegments);

    const w = params.thickness;
    const worldUp = new Vector3(0, 1, 0);
    const perp = new Vector3();
    const normVec = new Vector3();
    for (let i = 0; i < numSegments; i++) {
        const t = i / (numSegments - 1);
        const pt = curve.getPoint(t * 2);//TODO: why *2 ?  this takes T to 2! getPoint wants 0-1
        const tangent = curve.getTangent(t * 2);
        perp.crossVectors(tangent, worldUp);
        perp.normalize();
        const leftOffset = perp.clone().multiplyScalar(w);
        const rightOffset = perp.clone().multiplyScalar(-w);

        normVec.crossVectors(perp, tangent).normalize();

        rawVerts.push(leftOffset.add(pt));
        rawVerts.push(rightOffset.add(pt));

        rawNorms.push(normVec.clone());
        rawNorms.push(normVec.clone());
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
    geom.attributes.position.needsUpdate = true;
    geom.setAttribute("normal", normAttr);

    // geom.computeVertexNormals();
    return geom;
}



export function makeCurveFromControlPositions(controlPointMeshes: Mesh[], params: RoadGeomParams): CatmullRomCurve3 {
    //These position objects are importantly shared between the control-point meshes and the curve
    const controlPositions: Vector3[] = controlPointMeshes.map(mesh => mesh.position);

    const curve: CatmullRomCurve3 = new CatmullRomCurve3(controlPositions, false);
    const points = curve.getPoints(params.numSegments - 1);

    // curve.updateArcLengths();
    console.log("making curve: ", { points, params, curve })
    return curve;
}
