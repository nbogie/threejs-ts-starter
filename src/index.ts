import { Object3D } from "three";
import { Scene } from "three";
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

  setupLights(scene);

  setupHelpers(scene);

  //Load a model of a submarine and add it to the scene!
  const submarine = await loadModel("./assets/lionSubmariners.glb");
  if (submarine) {
    submarine.scale.set(5, 5, 5);
    submarine.position.setZ(50);
    scene.add(submarine);

    //Optional: See in console what the model / scene consists of
    dumpObjectToConsoleAsString(submarine);

    //Optional: find a subpart of the model and store it in userData (or some other variable)
    // (for later animation)
    submarine.traverse((child) => {
      if (child.name === "sub_prop") {
        submarine.userData.propeller = child;
      }
      if (child.name === "sub_periscope") {
        submarine.userData.periscope = child;
      }
    });
  }

  //You can get more models from https://market.pmnd.rs/

  //keep a frame counter so we can use it as an input to an animation
  let frameCount = 0;

  animate();

  function animate() {
    renderer.render(scene, camera);

    if (submarine) {
      animateSubmarine(submarine);
      moveCameraAlongsideSubmarine(submarine);
      //either /  or move the camera automatically or allow the user to control it
      false && controls.update(); // required if controls has .enableDamping .autoRotate set true.
    }

    const infoElem = document.getElementById("info");
    if (infoElem && submarine) {
      infoElem.innerText = "z: " + Math.round(submarine.position.z);
    }
    requestAnimationFrame(animate);
    frameCount++;
  }

  function animateSubmarine(submarine: Object3D) {
    //moving forward
    submarine.position.setZ((submarine.position.z -= 0.1));
    //bobbing up and down with a sine wave
    submarine.position.setY(Math.sin(frameCount / 20));
    if (submarine.userData.propeller) {
      submarine.userData.propeller.rotation.y += 0.1;
    }
    if (submarine.userData.periscope) {
      //correct
      submarine.userData.periscope.rotation.z = Math.sin(frameCount / 40);
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

setupThreeJSScene();
