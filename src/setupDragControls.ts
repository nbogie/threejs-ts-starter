import { Camera, Object3D } from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface DragControlCallbacks {
    dragEnd?: () => void;
    drag?: () => void;
}
export interface DragAndOrbitControlSettings {
    shouldUseOrbitControls: boolean;
}
export function setupDragControls(objects: Object3D[],
    camera: Camera,
    canvas: HTMLCanvasElement,
    options?: DragAndOrbitControlSettings,
    orbitControls?: OrbitControls,
    callbacks?: DragControlCallbacks): DragControls {


    const dragControls = new DragControls(objects, camera, canvas);

    dragControls.addEventListener('dragstart', function (event) {
        if (orbitControls && options?.shouldUseOrbitControls) {
            orbitControls.enabled = false;
        }
        event.object.material.emissive.set(0x777777);
    });

    dragControls.addEventListener('dragend', function (event) {
        if (orbitControls && options?.shouldUseOrbitControls) {
            orbitControls.enabled = true;
        }
        event.object.material.emissive.set(0x000000);
        if (callbacks?.dragEnd) {
            callbacks.dragEnd()
        }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dragControls.addEventListener('drag', function (event) {
        if (callbacks?.drag) {
            callbacks.drag()
        }
    });

    return dragControls;
}