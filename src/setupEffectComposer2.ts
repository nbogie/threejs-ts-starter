import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader.js';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader.js';


export function setupEffectComposer2(camera: PerspectiveCamera, renderer: WebGLRenderer, scene: Scene): EffectComposer {

    //Built initially from this example
    //https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html

    const renderPass = new RenderPass(scene, camera);


    const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.5
    bloomPass.radius = 0;


    const rgbShiftShaderPass = new ShaderPass(RGBShiftShader);
    rgbShiftShaderPass.uniforms['amount'].value = 0.0015;


    const dotsShaderPass = new ShaderPass(DotScreenShader);
    dotsShaderPass.uniforms['scale'].value = 4;


    const grayscaleShaderPass = new ShaderPass(LuminosityShader);
    const sobelShaderPass = new ShaderPass(SobelOperatorShader);
    sobelShaderPass.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio;
    sobelShaderPass.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio;


    const composer = new EffectComposer(renderer);

    //Function to compose one of a number of presets.
    type EffectChoice = "0" | "1" | "2" | "3";
    function chooseEffect(choice: EffectChoice): void {
        const configs = {
            "0": [renderPass],
            "1": [renderPass, rgbShiftShaderPass, bloomPass],
            "2": [renderPass, rgbShiftShaderPass, bloomPass, dotsShaderPass],
            "3": [renderPass, rgbShiftShaderPass, grayscaleShaderPass, sobelShaderPass, bloomPass],
        }
        const passes = configs[choice];
        composer.reset();//get rid of whatever was set up before, if anything
        for (const p of passes) {
            composer.addPass(p);
        }
    }
    chooseEffect("1");

    document.body.addEventListener("keydown", (e) => {
        const possibleChoices: EffectChoice[] = ["0", "1", "2", "3"];
        if (possibleChoices.includes(e.key as EffectChoice)) {
            chooseEffect(e.key as EffectChoice)
        }
    })

    return composer;
}
