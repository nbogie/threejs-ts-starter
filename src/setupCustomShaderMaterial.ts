import {
    RawShaderMaterial
} from 'three';
//@ts-ignore - these strings will be loaded by parcel as a non-ts part of the build
import frag from './shaders/two.frag';
//@ts-ignore - strings loaded by parcel as a non-ts part of the build
import vert from './shaders/two.vert';

export function setupCustomShaderMaterial(): RawShaderMaterial {
    const customMaterial = new RawShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag
    })
    return customMaterial;

}