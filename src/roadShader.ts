import { DoubleSide, ShaderMaterial } from "three";

export function createRoadShaderMaterial(): ShaderMaterial {
    const { vertexShader, fragmentShader } = createRoadShader();
    const shaderMaterial = new ShaderMaterial({ vertexShader, fragmentShader, side: DoubleSide })
    return shaderMaterial;
}

//https://threejs.org/docs/?q=webgl#api/en/renderers/webgl/WebGLProgram
export function createRoadShader(): { vertexShader: string, fragmentShader: string } {
    const vertexShader = /* glsl */`
    varying vec2 vUV;
    void main()               
    {                 
        vUV = uv;        
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
    }
   `;
    const fragmentShader = /* glsl */`
    varying vec2 vUV;
    void main(){
        float border1 = step(0.9, vUV.x);
        float border2 = step(0.9, 1.-vUV.x);
        float borders = max(border1, border2);

        float stripe = step(0.95, 1. - abs(0.5 - vUV.x)) * step(0.5, mod(vUV.y * 50., 1.));

        float v = max(borders, stripe);

        gl_FragColor = vec4(v, v, stripe, 1.);        
    }
    `;

    return { vertexShader, fragmentShader }
}