import {
    DoubleSide,
    ShaderMaterial
} from 'three';

import gloopVert from './shaders/gloop.vert';
import gloopFrag from './shaders/gloop.frag';

export function setupCustomShaderMaterial(): ShaderMaterial {
    const customMaterial = new ShaderMaterial({
        vertexShader: gloopVert,
        fragmentShader: gloopFrag,
        uniforms: {
            u_time: { value: 0.9 },
        },
        transparent: true,
        side: DoubleSide,
    })
    return customMaterial;
}
