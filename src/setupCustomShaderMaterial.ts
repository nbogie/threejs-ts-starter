import {
    DoubleSide,
    ShaderMaterial
} from 'three';

import myShaderVert from './shaders/myShader.vert';
import myShaderFrag from './shaders/myShader.frag';

export function setupCustomShaderMaterial(): ShaderMaterial {
    const customMaterial = new ShaderMaterial({
        vertexShader: myShaderVert,
        fragmentShader: myShaderFrag,
        uniforms: {
            uTime: { value: 0.01 },
        },
        transparent: true,
        side: DoubleSide,
    })
    return customMaterial;
}
