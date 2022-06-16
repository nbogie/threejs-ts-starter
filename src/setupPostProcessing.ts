import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export function setupPostProcessing(camera: PerspectiveCamera, renderer: WebGLRenderer, scene: Scene): { composer: EffectComposer, bloomPass: UnrealBloomPass } {

    //Simplified from this example
    //https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html

    //The default render of the scene.  our postprocessing pipeline will start with this.
    const renderPass = new RenderPass(scene, camera);

    //Define (but do not yet apply) a bloom effect (a glow/blur effect)
    const threshold = 0.5;
    const strength = 0.7
    const radius = 0;
    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), strength, radius, threshold);

    //Compose a simple pipeline - our basic render then pass it through the bloom effect
    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    return { composer, bloomPass };
}