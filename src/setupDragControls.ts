import { Camera, Object3D } from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export function setupDragControls(objects: Object3D[],
    camera: Camera,
    canvas: HTMLCanvasElement,
    orbitControls: OrbitControls): DragControls {


    const dragControls = new DragControls(objects, camera, canvas);

    dragControls.addEventListener('dragstart', function (event) {
        orbitControls.enabled = false;
        event.object.material.emissive.set(0x777777);
    });

    dragControls.addEventListener('dragend', function (event) {
        orbitControls.enabled = true;
        event.object.material.emissive.set(0x000000);
    });

    return dragControls;
}