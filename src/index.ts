import {
    Scene,
    Mesh,
    MeshStandardMaterial,
    BoxGeometry,
    Color,
    PerspectiveCamera,
    Vector3,
    GridHelper,
} from "three";
import { lerp, clamp, mapLinear } from "three/src/math/MathUtils";
import { getExpectedElement } from "./domUtils";
import { between } from "./math";

import { setupCamera } from "./setupCamera";
import { setupLights } from "./setupLights";
import { getAspect, setupRenderer } from "./setupRenderer";
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
GSAP.registerPlugin(ScrollTrigger);

export function setupThreeJSScene(): void {
    const cameraLookAtTarget: Vector3 = new Vector3(0, 0, -200);
    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const scene = new Scene();
    scene.background = new Color(0x202020);
    const camera = setupCamera(dimensions);
    const camera2 = new PerspectiveCamera(30, getAspect(dimensions), 50, 150);
    camera2.position.set(0, 60, -80);

    const renderer = setupRenderer(camera, dimensions);

    const geom = new BoxGeometry(20, 20, 20);
    const cubeMesh = new Mesh(
        geom,
        new MeshStandardMaterial({ wireframe: false, color: new Color("cyan") })
    );

    const timeline = GSAP.timeline();

    timeline.to(cubeMesh.position, {
        x: 80,
        scrollTrigger: {
            trigger: ".extra1",
            markers: true,
            start: "top 20%",
            end: "bottom 20%",
            scrub: 1,

            // invalidateOnRefresh: true,
        },
        duration: 10,
    });

    // timeline.to(cubeMesh.position, { x: 20, duration: 5 });
    // timeline.to(cubeMesh.position, { x: -10, duration: 6 });

    cubeMesh.userData.desiredRotationY = 0;
    cubeMesh.userData.desiredRotationX = 0;

    cubeMesh.userData.desiredPosition = new Vector3(50, 15, 0);
    // cubeMesh.position.copy(cubeMesh.userData.desiredPosition);

    cubeMesh.userData.desiredDimHeight = 1;

    scene.add(cubeMesh);

    setupLights(scene);
    // setupHelpers(scene);
    const gridHelper = new GridHelper(100);
    scene.add(gridHelper);
    gridHelper.visible = false;

    let frameCount = 1;
    animate();

    function animate() {
        renderer.render(scene, camera);

        //lerp rotation towards its desired value, a little each frame
        cubeMesh.rotation.y = lerp(
            cubeMesh.rotation.y,
            cubeMesh.userData.desiredRotationY,
            0.1
        );
        cubeMesh.rotation.x = lerp(
            cubeMesh.rotation.x,
            cubeMesh.userData.desiredRotationX,
            0.1
        );

        //always add a bit of motion
        const posOffset = new Vector3(
            2 * Math.sin(frameCount / 44),
            0,
            0 + 2 * Math.cos(frameCount / 44)
        );
        const p = cubeMesh.userData.desiredPosition.clone();
        p.add(posOffset);
        // cubeMesh.position.lerp(p, 0.1);

        cubeMesh.scale.y = lerp(
            cubeMesh.scale.y,
            cubeMesh.userData.desiredDimHeight,
            0.1
        );
        camera2.lookAt(
            cubeMesh.position.x,
            cubeMesh.position.y,
            cubeMesh.position.z
        );

        requestAnimationFrame(animate);
        frameCount++;
    }
}

function setHudText(msg: string): void {
    const hudElem = document.getElementById("floating-info");
    if (hudElem) {
        hudElem.innerText = msg;
    }
}
setupThreeJSScene();
