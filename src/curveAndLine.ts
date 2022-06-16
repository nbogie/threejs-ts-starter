import { Line, Vector3, CatmullRomCurve3, BufferGeometry, LineBasicMaterial, Object3D, Scene } from "three";
const ARC_SEGMENTS = 210;

export function makeLineOnCurveFromControlPositions(controlPointMeshes: Object3D[], scene: Scene): Line {
    //These position objects are importantly shared between the control-point meshes and the curve
    const controlPositions: Vector3[] = controlPointMeshes.map(mesh => mesh.position);

    const curve: CatmullRomCurve3 = new CatmullRomCurve3(controlPositions);

    const points = curve.getPoints(ARC_SEGMENTS - 1);
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({ color: 0xffffff, });
    const lineMesh = new Line(geometry, material);

    lineMesh.userData.curve = curve;
    scene.add(lineMesh);
    return lineMesh;
}

export function updateLineBasedOnCurve(spline: Line): void {
    //It seems it is not necessary to update the curve because
    // its .points array is a list of shared references with the positions of controlPointMeshes.

    //We will update this positions buffer attribute for the line
    const lineGeomPositions = spline.geometry.attributes.position;

    //The curve shares (aliased) position objects with our controlPointMeshes
    const curve: CatmullRomCurve3 = spline.userData.curve;

    //temp to copy into
    const curvePt = new Vector3();

    for (let i = 0; i < ARC_SEGMENTS; i++) {
        const t = i / (ARC_SEGMENTS - 1);//interpolation fraction
        //Ask the curve for an interpolated position from 0-1.
        //Give it an object to copy into (for performance)
        curve.getPoint(t, curvePt);//get interpolated point t of the way through

        //set this to the line's position
        lineGeomPositions.setXYZ(i, curvePt.x, curvePt.y, curvePt.z);
    }

    lineGeomPositions.needsUpdate = true;
}
