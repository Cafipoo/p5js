export const vertexShader = ` 
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() { 
   vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
   gl_Position = projectionMatrix * modelViewPosition;
   vViewPosition = -modelViewPosition.xyz;
   vNormal = normalize(normalMatrix * normal);
} 
`;
