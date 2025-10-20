export const fragmentShader = ` 
varying vec2 vUv; 

void main() { 
   vec2 center = vec2(0.5); 
   float distanceFromCenter = distance(vUv, center); 
   float radius = 0.5; // Rayon du cercle (0.5 pour couvrir toute la surface)

   // Calcul de la couleur en fonction de la distance (dégradé)
   float gradient = smoothstep(radius, 0.0, distanceFromCenter);
   vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), gradient); // Dégradé rouge -> bleu

   gl_FragColor = vec4(color, 1.0); 
} 
`;