export const fragmentShader = ` 
precision mediump float;

varying vec3 vNormal;
varying vec3 vViewPosition;
uniform vec3 u_ambient;
uniform vec3 u_lightPosition;
uniform vec3 u_fixedLightPosition;

void main() { 
   vec3 normal = normalize(vNormal);
   vec3 viewDir = normalize(vViewPosition);
   vec3 lightDir = normalize(u_lightPosition - vViewPosition);
   vec3 baseColor = vec3(0.1, 0.3, 0.9);
   float diffuse = max(dot(normal, lightDir), 0.7);
   vec3 halfDir = normalize(lightDir + viewDir);
   float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
   vec3 ambient = baseColor * u_ambient;
   vec3 color = ambient + baseColor * diffuse + vec3(1.0, 1.0, 1.0) * spec * 0.7;
   vec3 fixedLightDir = normalize(u_fixedLightPosition - vViewPosition);
   float fixedDiffuse = dot(normal, fixedLightDir);
   color += baseColor * fixedDiffuse * 0.93; // contribution plus douce

   gl_FragColor = vec4(color, 1.0);
} 
`;
