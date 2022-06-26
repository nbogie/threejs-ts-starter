import { BufferGeometry, CatmullRomCurve3, Color, DoubleSide, Float32BufferAttribute, Mesh, MeshNormalMaterial, MeshStandardMaterial, Vector2, Vector3 } from 'three';
// import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper';
import { MyVertexNormalsHelper } from "./MyVertexNormalsHelper";
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { createRoadShaderMaterial } from './roadShader';
export interface RoadGeomParams {
    numSegments: number;
    thickness: number;
}
export function makeCurveFromControlPositions(controlPointMeshes: Mesh[]): CatmullRomCurve3 {
    //These position objects are importantly shared between the control-point meshes and the curve
    const controlPositions: Vector3[] = controlPointMeshes.map(mesh => mesh.position);
    const curve: CatmullRomCurve3 = new CatmullRomCurve3(controlPositions, false);
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
        const pt = curve.getPoint(t);
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
    /*
    Triangulation order
     
    etc...
    etc...
    | \|
    6--7
    |\ |
    | \|
    4--5    <-- segment 2
    |\ |
    | \|
    2--3    <-- segment 1
    |\ |
    | \|
    0--1    <-- segment 0

    So sequence in which geometry should read through vertices to form triangles is:
    0,1,2 (triangle 1), then 1, 3, 2 (triangle 2), then repeating, but offset by 2: (2, 3, 4), (3, 5, 4)...
    */

    //Make geometry index which will be used to compose triangles by stepping over the existing vertex data.
    const indices: number[] = [];
    //Note: There are two triangles starting at each segment EXCEPT the last segment, hence numSegments - 1
    for (let i = 0; i < numSegments - 1; i++) {
        const offset = i * 2;
        indices.push(0 + offset, 1 + offset, 2 + offset, 1 + offset, 3 + offset, 2 + offset)
    }

    const posAttr = new Float32BufferAttribute(rawVerts.flatMap(p => [p.x, p.y, p.z]), 3);
    const normAttr = new Float32BufferAttribute(rawNorms.flatMap(p => [p.x, p.y, p.z]), 3);
    const uvAttr = new Float32BufferAttribute(rawUVs.flatMap(p => [p.x, p.y]), 2);
    const geom = new BufferGeometry();
    geom.setAttribute("position", posAttr);
    geom.setAttribute("normal", normAttr);
    geom.setAttribute("uv", uvAttr);
    geom.setIndex(indices);

    //TODO: I think these don't need set to needsUpdate if we've only just created the geom
    geom.attributes.position.needsUpdate = true;
    geom.attributes.normal.needsUpdate = true;
    geom.attributes.uv.needsUpdate = true;

    // geom.computeVertexNormals();
    return geom;
}


export function setupGUIForRoadParams(roadMesh: Mesh, params: RoadGeomParams, vertexNormalsHelper: MyVertexNormalsHelper, gui: GUI): void {
    function recalcGeom() {
        roadMesh.geometry = calculateGeometryForRoad(params, roadMesh.userData.curve);
        //TODO: vertexNormalsHelper currently has a static number of positions.
        //so if we increase the number of segments (therefore positions and normals) in the geometry, 
        //the helper will not create more "arrows" to match
        vertexNormalsHelper.update();
    }
    gui.add(params, "numSegments", 4, 300, 2).onChange(recalcGeom);
    gui.add(params, "thickness", 0.2, 10).onChange(recalcGeom);
    gui.add(roadMesh.material, "wireframe")
    gui.add(vertexNormalsHelper, "visible").name("show normals");
}
