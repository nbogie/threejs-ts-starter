varying vec2 vUV;

void main()
{
    vUV = uv;  //Makes this available, but interpolated, to the downstream frag shader.
    
    //Standard
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}