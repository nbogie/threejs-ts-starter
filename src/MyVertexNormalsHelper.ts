//Hacky change to the build-in VertexNormalsHelper to support geometry changing number of vertices
//This likely contains bad practices (e.g. it does not tidy up after itself, yet.)

import {
  BufferGeometry,
  Float32BufferAttribute, LineBasicMaterial, LineSegments, Matrix3, Mesh, Vector3
} from "three";

const _v1 = new Vector3();
const _v2 = new Vector3();
const _normalMatrix = new Matrix3();

class MyVertexNormalsHelper extends LineSegments {
  nNormals: number;
  object: Mesh;
  size: number;

  constructor(object: Mesh, size = 1, color = 0xff0000) {
    console.log("using my custom vnhelper");
    const geometry = new BufferGeometry();

    const nNormals: number = object.geometry.attributes.normal.count;
    const positions = new Float32BufferAttribute(nNormals * 2 * 3, 3);

    geometry.setAttribute("position", positions);

    super(geometry, new LineBasicMaterial({ color, toneMapped: false }));
    this.nNormals = nNormals;
    this.object = object;
    this.size = size;
    this.type = "VertexNormalsHelper";

    //

    this.matrixAutoUpdate = false;

    this.update();
  }

  update(): void {
    this.object.updateMatrixWorld(true);

    _normalMatrix.getNormalMatrix(this.object.matrixWorld);

    const matrixWorld = this.object.matrixWorld;

    const position = this.geometry.attributes.position;

    //

    const objGeometry = this.object.geometry;

    if (objGeometry) {
      const currentCount = objGeometry.attributes.normal.count;
      const origCount = position.count / 2;
      console.log({ currentCount, origCount })
      if (currentCount !== origCount) {
        //"Mismatch in number of normals - object geometry has been changed: " +

        //TODO: reclaim memory used by the old buffer atribute?
        //2 per normal because we'll keep a start and end position of every line
        const positions = new Float32BufferAttribute(currentCount * 2 * 3, 3);

        this.geometry.setAttribute("position", positions);
        this.geometry.attributes.position.needsUpdate = true;
      }
      const objPos = objGeometry.attributes.position;

      const objNorm = objGeometry.attributes.normal;

      let idx = 0;

      // for simplicity, ignore index and drawcalls, and render every normal

      for (let j = 0, jl = objPos.count; j < jl; j++) {
        //v1 is the vertex position.
        _v1.fromBufferAttribute(objPos, j).applyMatrix4(matrixWorld);

        //v2 starts as the normal.
        _v2.fromBufferAttribute(objNorm, j);

        //...but we multiply it by the size of the arrow, and add it as an offset to the position (v1)
        _v2
          .applyMatrix3(_normalMatrix)
          .normalize()
          .multiplyScalar(this.size)
          .add(_v1);

        position.setXYZ(idx, _v1.x, _v1.y, _v1.z);

        //only incremented by 1 not by 3, as the buffer attribute itself takes care of indices in relation to its own .itemSize
        idx = idx + 1;

        position.setXYZ(idx, _v2.x, _v2.y, _v2.z);

        idx = idx + 1;

      }
    }

    position.needsUpdate = true;
  }
}

export { MyVertexNormalsHelper };
