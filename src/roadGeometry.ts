import { BufferGeometry, CatmullRomCurve3, Color, DoubleSide, Float32BufferAttribute, Mesh, MeshNormalMaterial, MeshStandardMaterial, Vector2, Vector3 } from 'three';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { createRoadShaderMaterial } from './roadShader';
export interface RoadGeomParams {
    numSegments: number;
    thickness: number;
}
export function makeCurveFromControlPositions(controlPointMeshes: Mesh[], params: RoadGeomParams): CatmullRomCurve3 {
    //These position objects are importantly shared between the control-point meshes and the curve
    const controlPositions: Vector3[] = controlPointMeshes.map(mesh => mesh.position);

    const curve: CatmullRomCurve3 = new CatmullRomCurve3(controlPositions, false);
    // const points = curve.getPoints(params.numSegments - 1);

    // curve.updateArcLengths();
    // console.log("making curve: ", { points, params, curve })
    return curve;
}

export function createRoadMeshOnce(params: RoadGeomParams, curve: CatmullRomCurve3): Mesh {
    const geom = calculateGeometryForRoad(params, curve);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const materialNormal = new MeshNormalMaterial();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const materialStandard = new MeshStandardMaterial({ color: new Color("gray"), side: DoubleSide });
    const materialCustomShader = createRoadShaderMaterial();
    const mesh = new Mesh(geom, materialCustomShader);
    return mesh;
}

export function calculateGeometryForRoad(params: RoadGeomParams, curve: CatmullRomCurve3): BufferGeometry {
    const rawVerts: Vector3[] = [];
    const rawNorms: Vector3[] = [];
    const rawUVs: Vector2[] = [];

    const numSegments = Math.floor(params.numSegments);

    const w = params.thickness;

    const worldUp = new Vector3(0, 1, 0);
    const perpendicular = new Vector3();
    const normal = new Vector3();
    for (let i = 0; i < numSegments; i++) {
        const t = i / (numSegments - 1);
        const pt = curve.getPoint(t);//TODO: why *2 ?  this takes T to 2! getPoint wants 0-1
        const tangent = curve.getTangent(t);
        perpendicular.crossVectors(tangent, worldUp);
        perpendicular.normalize();
        const leftOffset = perpendicular.clone().multiplyScalar(-w);
        const rightOffset = perpendicular.clone().multiplyScalar(w);

        normal.crossVectors(perpendicular, tangent).normalize();

        rawVerts.push(leftOffset.add(pt));
        rawVerts.push(rightOffset.add(pt));

        rawNorms.push(normal.clone());
        rawNorms.push(normal.clone());

        rawUVs.push(new Vector2(0, t));
        rawUVs.push(new Vector2(1, t));
    }

    //copy details in, in their triangle orders.
    const positions: Vector3[] = [];
    const normals: Vector3[] = [];
    const uvs: Vector2[] = [];

    //step through the vertices, selecting a,b,c,d so that a is the left hand vertex of a new set.
    //note that we step through with a stride of 2, as there are two verts/norms/uvs in the arrays at each segment
    for (let i = 0; i < numSegments - 1; i++) {
        const [a, b, c, d] = rawVerts.slice(i * 2, i * 2 + 4)
        positions.push(a, b, c, b, d, c)

        const [na, nb, nc, nd] = rawNorms.slice(i * 2, i * 2 + 4);
        normals.push(na, nb, nc, nb, nd, nc)

        const [ua, ub, uc, ud] = rawUVs.slice(i * 2, i * 2 + 4);
        uvs.push(ua, ub, uc, ub, ud, uc)
    }
    const posAttr = new Float32BufferAttribute(positions.flatMap(p => [p.x, p.y, p.z]), 3);
    const normAttr = new Float32BufferAttribute(normals.flatMap(p => [p.x, p.y, p.z]), 3);
    const uvAttr = new Float32BufferAttribute(uvs.flatMap(p => [p.x, p.y]), 2);
    const geom = new BufferGeometry();
    geom.setAttribute("position", posAttr);
    geom.setAttribute("normal", normAttr);
    geom.setAttribute("uv", uvAttr);

    geom.attributes.position.needsUpdate = true;
    geom.attributes.normal.needsUpdate = true;
    geom.attributes.uv.needsUpdate = true;

    // geom.computeVertexNormals();
    return geom;
}





export function setupGUIForRoadParams(roadMesh: Mesh, params: RoadGeomParams, vertexNormalsHelper: VertexNormalsHelper, gui: GUI): void {
    function recalcGeom() {
        roadMesh.geometry = calculateGeometryForRoad(params, roadMesh.userData.curve);
        vertexNormalsHelper.update();
    }
    gui.add(params, "numSegments", 4, 200, 2).onChange(recalcGeom);
    gui.add(params, "thickness", 0.2, 10).onChange(recalcGeom);
    gui.add(roadMesh.material, "wireframe")
    gui.add(vertexNormalsHelper, "visible").name("show normals");
}
