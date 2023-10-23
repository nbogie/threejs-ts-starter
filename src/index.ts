//press keys 1-3 to control animations (static poses)

import { AnimationMixer, Color, Object3D, Scene } from "three";
import { dumpObjectToConsoleAsString } from "./debugModel";
import { loadModel } from "./loadModel";
import { setupCamera } from "./setupCamera";
import { setupHelpers } from "./setupHelpers";
import { setupLights } from "./setupLights";
import { setupOrbitControls } from "./setupOrbitControls";
import { setupRenderer } from "./setupRenderer";

export async function setupThreeJSScene(): Promise<void> {
    const dimensions = { w: window.innerWidth, h: window.innerHeight };

    const camera = setupCamera(dimensions);

    const renderer = setupRenderer(camera, dimensions);
    //Currently, the orbit controls will fight with the automated camera movement in animate()
    const controls = setupOrbitControls(camera, renderer.domElement);

    const scene = new Scene();
    scene.background = new Color(0x707070);
    setupLights(scene);

    setupHelpers(scene);

    //Load a model of a submarine and add it to the scene!
    //   const modelDetails = await loadModel("./assets/lionSubmariners.glb");
    const modelDetails = await loadModel("./assets/wickedWitch.glb");
    if (!modelDetails) {
        throw new Error("Failed to load model");
    }
    const { model: witchModel, animations } = modelDetails;

    const mixer = new AnimationMixer(witchModel);

    witchModel.scale.set(3, 3, 3);
    witchModel.position.set(0, 0, 0);
    scene.add(witchModel);

    camera.position.set(0, 10, -20);
    camera.lookAt(witchModel.position);

    //Optional: See in console what the model / scene consists of
    dumpObjectToConsoleAsString(witchModel);

    // mixer.addEventListener("loop", function (e) {
    //     console.log("mixer event: loop", e);
    // });
    mixer.addEventListener("finished", function (e) {
        console.log("mixer event: finished", e);
    });

    window.addEventListener("keypress", (e) => {
        const animNum = keyAsNumber(e.key);

        if (animNum !== null) {
            const anim = animations[animNum - 1];
            console.log("playing anim " + animNum, anim);
            mixer.stopAllAction();

            //i think this caches the clips
            const action = mixer.clipAction(anim); // Assuming there's only one animation
            action.reset();

            console.log(action.getClip().duration, action, action.getClip());
            action.play();
        }
    });

    //   window.addEventListener("keydown", (e) => {
    //     console.log("key down: " + e.key);
    //   });

    //Optional: find a subpart of the model and store it in userData (or some other variable)
    // (for later animation)
    witchModel.traverse((child) => {
        if (child.name === "sub_prop") {
            witchModel.userData.propeller = child;
        }
        if (child.name === "sub_periscope") {
            witchModel.userData.periscope = child;
        }
    });

    //You can get more models from https://market.pmnd.rs/

    //keep a frame counter so we can use it as an input to an animation
    let frameCount = 0;
    let lastTime = 0;

    animate(0);

    function animate(elapsedTime: number) {
        const deltaTime = elapsedTime - lastTime;
        renderer.render(scene, camera);
        if (!modelDetails) {
            throw new Error("No model details");
        }

        const { model: submarine } = modelDetails;
        animateSubmarine(submarine);
        // moveCameraAlongsideSubmarine(modelDetails.model);
        //either /  or move the camera automatically or allow the user to control it
        controls.update(); // required if controls has .enableDamping .autoRotate set true.
        mixer.update(deltaTime);
        const infoElem = document.getElementById("info");
        if (infoElem && modelDetails) {
            infoElem.innerText =
                "z: " + Math.round(modelDetails.model.position.z);
        }
        requestAnimationFrame(animate);
        lastTime = elapsedTime;

        frameCount++;

        function animateSubmarine(submarine: Object3D) {
            //moving forward
            submarine.rotation.z = 0.5;

            // submarine.position.setZ((submarine.position.z -= 0.1));
            //bobbing up and down with a sine wave
            submarine.position.setY(Math.sin(frameCount / 20));

            if (submarine.userData.propeller) {
                submarine.userData.propeller.rotation.y += 0.1;
            }
            if (submarine.userData.periscope) {
                //correct
                submarine.userData.periscope.rotation.z = Math.sin(
                    frameCount / 40,
                );
                //but funnier
                // submarine.userData.periscope.rotation.y = Math.sin(frameCount / 10);
            }
        }
        //unimportant
        function moveCameraAlongsideSubmarine(submarine: Object3D) {
            camera.position.copy(submarine.position);
            camera.position.y = 10;
            camera.position.x -= 20;
            camera.position.z += 5 + Math.sin(frameCount / 120) * 20;
            const lookAtTarget = submarine.position.clone();
            lookAtTarget.y = 0;
            camera.lookAt(lookAtTarget);
        }
    }
}

function keyAsNumber(keyStr: string): number | null {
    return keyStr.charCodeAt(0) - "0".charCodeAt(0);
}

setupThreeJSScene();
