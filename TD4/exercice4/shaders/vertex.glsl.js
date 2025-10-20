export const vertexShader = ` 
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

void main() { 
   vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
   gl_Position = projectionMatrix * modelViewPosition;
   vViewPosition = -modelViewPosition.xyz;
   vNormal = normalize(normalMatrix * normal);
   vUv = uv;
} 
`;
