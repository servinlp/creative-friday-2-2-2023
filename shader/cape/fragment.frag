precision mediump float;

varying vec2 vUv;

void main () {
    gl_FragColor = vec4(vUv, 1.0, 1.0);
    gl_FragColor = vec4(0.835,0.302,0.263, 1.0);
}