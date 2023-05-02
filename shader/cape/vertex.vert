varying vec2 vUv;

uniform float uTime;

#include ../partials/perlin3dPeriodic.glsl

void main() {
    float perlin1 = perlin3dPeriodic(vec3(uv * 5.0 + uTime, 12.43), vec3(5.0));
    float perlin2 = perlin3dPeriodic(vec3(uv / 1.0 + uTime, 100.0), vec3(15.0));

    vec3 _position = position;

    _position.z += ((1.0-uv.y) * perlin1 * 0.1);
    _position.z += ((1.0-uv.y) * perlin2 * 0.5);
    gl_Position = projectionMatrix * modelViewMatrix* vec4(_position, 1.0);
    vUv = uv;
}