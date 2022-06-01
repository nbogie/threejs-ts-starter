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

    //Simplified from this example
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

    const useSetup1 = Math.random() > 0.5;
    if (useSetup1) {
        composer.addPass(renderPass);
        composer.addPass(rgbShiftShaderPass);
        composer.addPass(bloomPass);
        if (Math.random() > 0.5) {
            composer.addPass(dotsShaderPass);
        }
    } else {
        composer.addPass(renderPass);
        composer.addPass(rgbShiftShaderPass);
        composer.addPass(grayscaleShaderPass);
        composer.addPass(sobelShaderPass);
        composer.addPass(bloomPass);
    }

    return composer;
}