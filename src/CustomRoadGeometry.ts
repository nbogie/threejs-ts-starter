import { CatmullRomCurve3, Color, MeshBasicMaterial } from 'three';
//See https://threejs.org/manual/#en/custom-buffergeometry
//and for some concepts (though in unity): https://www.youtube.com/watch?v=6xs0Saff940

import { BufferGeometry, Curve, Float32BufferAttribute, Mesh, MeshNormalMaterial, MeshStandardMaterial, Vector3 } from "three";
//@ts-ignore
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { randFloat } from 'three/src/math/MathUtils';


export interface RoadGeomParams {
    numSegments: number;
    thickness: number;
}

export function createRoadMesh(params: RoadGeomParams, curve: CatmullRomCurve3): Mesh {
    const geom = calculateGeometryForRoad(params, curve);
    // geom.computeVertexNormals();
    // const material = new MeshNormalMaterial();
    // const material = new MeshStandardMaterial({ color: new Color("orange"), wireframe: true });
    const material = new MeshBasicMaterial({ color: new Color("orange"), wireframe: true });
    const mesh = new Mesh(geom, material);//{ color: 0xFFFF00 }
    return mesh;
}

export function setupGUI(roadMesh: Mesh, params: RoadGeomParams, gui: GUI) {

    const matOptions = {
        isNormal: true,
        applyStandard: () => roadMesh.material = new MeshStandardMaterial({ color: 0xFF00FF }),
        setWireframe: () => (roadMesh.material as MeshStandardMaterial).wireframe = true
    }
    function recalcGeom() {
        roadMesh.geometry = calculateGeometryForRoad(params, roadMesh.userData.curve);
    }
    gui.add(params, "numSegments", 4, 200, 2).onChange(recalcGeom);
    gui.add(params, "thickness", 0.2, 10).onChange(recalcGeom);
    gui.add(roadMesh.material, "wireframe")
    gui.add(matOptions, "applyStandard")
    gui.add(matOptions, "setWireframe")
}

export function calculateGeometryForRoad(params: RoadGeomParams, curve: CatmullRomCurve3): BufferGeometry {
    const rawVerts: Vector3[] = [];
    const rawNorms: Vector3[] = [];
    const numSegments = Math.floor(params.numSegments);

    const w = params.thickness;
    for (let i = 0; i < numSegments; i++) {
        const t = i / (numSegments - 1);
        const pt = curve.getPoint(t * 2);//TODO: why *2 ?  this takes T to 2! getPoint wants 0-1

        rawVerts.push(new Vector3(pt.x - w, pt.y, pt.z));
        rawVerts.push(new Vector3(pt.x + w, pt.y, pt.z));

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
    // const normAttr = new Float32BufferAttribute(normals.flatMap(p => [p.x, p.y, p.z]), 3);
    const geom = new BufferGeometry();
    geom.setAttribute("position", posAttr);
    geom.attributes.position.needsUpdate = true;

    // geom.setAttribute("normal", normAttr);
    return geom;
}