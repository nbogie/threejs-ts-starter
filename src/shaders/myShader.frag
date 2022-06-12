precision mediump float;

uniform float uTime;

varying vec2 vUV;
void main()
{   
    //r from 0 to 1 as we go horizontally across the shape.
    float r = vUV.x;
    //g from 0 to 1 as we go horizontally across the shape.
    float g = vUV.y;
    //b from 0 to 1 sinusoidally over time, based on a uniform, uTime, we'll pass in from three.js
    float b = 0.5 + 0.5 * sin(uTime);

    gl_FragColor = vec4(r, g, b, 1.0);
    
}