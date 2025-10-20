export const fragmentShader = ` 
precision mediump float;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;
uniform vec3 u_ambient;
uniform vec3 u_lightPosition;
uniform vec3 u_fixedLightPosition;

void main() { 
   vec3 normal = normalize(vNormal);
   vec3 viewDir = normalize(vViewPosition);
   vec3 lightDir = normalize(u_lightPosition - vViewPosition);
   
   // Création du motif de plateau d'échecs
   float scale = 22.0; // Nombre de cases par côté
   vec2 grid = floor(vUv * scale);
   float checker = mod(grid.x + grid.y, 2.0);
   
   // Couleurs du plateau d'échecs
   vec3 color1 = vec3(0.1, 0.3, 0.9); // Bleu foncé
   vec3 color2 = vec3(0.8, 0.8, 0.9); // Bleu clair
   vec3 baseColor = mix(color1, color2, checker);
   
   // Calcul de l'illumination diffuse (Lambert)
   float diffuse = max(dot(normal, lightDir), 0.0);
   
   // Calcul de l'illumination spéculaire (Blinn-Phong)
   vec3 halfDir = normalize(lightDir + viewDir);
   float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
   
   // Lumière ambiante
   vec3 ambient = baseColor * u_ambient;
   
   // Couleur finale avec la lumière tournante
   vec3 color = ambient + baseColor * diffuse + vec3(1.0, 1.0, 1.0) * spec * 0.7;
   
   // Ajout de la lumière fixe
   vec3 fixedLightDir = normalize(u_fixedLightPosition - vViewPosition);
   float fixedDiffuse = max(dot(normal, fixedLightDir), 0.0);
   color += baseColor * fixedDiffuse * 0.3; // contribution plus douce

   gl_FragColor = vec4(color, 1.0);
} 
`;
