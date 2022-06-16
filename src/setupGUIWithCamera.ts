import { Camera } from 'three';
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

export function setupGUIWithCamera(camera: Camera): GUI {
    camera.userData.desiredPosition = camera.position.clone();
    camera.userData.shouldLerp = false;

    const gui = new GUI();
    const folderCamera = gui.addFolder("camera - desired position");
    folderCamera.add(camera.userData.desiredPosition, "x", -50, 50).listen();
    folderCamera.add(camera.userData.desiredPosition, "y", -50, 50).listen();
    folderCamera.add(camera.userData.desiredPosition, "z", -50, 50).listen();
    folderCamera.add(camera.userData, "shouldLerp")
    return gui;
}
