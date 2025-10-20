export const fragmentShader = ` 
precision mediump float;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying float vDisplacement; // Valeur de déplacement du vertex shader
uniform vec3 u_ambient;
uniform vec3 u_lightPosition;
uniform vec3 u_fixedLightPosition;
uniform float u_time;

// Fonction de hachage améliorée
float hash(float n) { 
   return fract(sin(n) * 43758.5453123); 
} 

// Fonction de hachage 2D pour plus de variété
float hash2(vec2 p) {
   return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// Bruit de Perlin 3D amélioré
float noise(vec3 p) { 
   vec3 i = floor(p); 
   vec3 f = fract(p); 
   f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0); 
   float n = dot(i, vec3(1.0, 57.0, 113.0)); 
   float res = mix(mix(mix( hash(n + 0.0), hash(n + 1.0), f.x), 
                       mix( hash(n + 57.0), hash(n + 58.0), f.x), f.y), 
                   mix(mix( hash(n + 113.0), hash(n + 114.0), f.x), 
                       mix( hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z); 
   return res; 
} 

// Bruit de Worley pour des formes plus organiques
float worley(vec3 p) {
   vec3 i = floor(p);
   vec3 f = fract(p);
   
   float minDist = 1.0;
   for(int x = -1; x <= 1; x++) {
       for(int y = -1; y <= 1; y++) {
           for(int z = -1; z <= 1; z++) {
               vec3 neighbor = vec3(float(x), float(y), float(z));
               vec3 point = neighbor + vec3(hash2(i.xy + neighbor.xy), 
                                          hash2(i.yz + neighbor.yz), 
                                          hash2(i.xz + neighbor.xz));
               vec3 diff = neighbor + point - f;
               float dist = length(diff);
               minDist = min(minDist, dist);
           }
       }
   }
   return 1.0 - minDist;
}

// FBM amélioré avec plus d'octaves
float fbm(vec3 p) { 
   float value = 0.0; 
   float amplitude = 0.5; 
   float frequency = 1.0;   
   for(int i = 0; i < 6; i++) { 
       value += amplitude * noise(p * frequency); 
       frequency *= 2.0; 
       amplitude *= 0.5; 
   } 
   return value; 
}

// FBM de Worley pour des formes plus nuageuses
float worleyFbm(vec3 p) {
   float value = 0.0;
   float amplitude = 0.5;
   float frequency = 1.0;
   for(int i = 0; i < 4; i++) {
       value += amplitude * worley(p * frequency);
       frequency *= 2.0;
       amplitude *= 0.5;
   }
   return value;
}

// Fonction de bruit de Ridged pour des structures plus définies
float ridgedNoise(vec3 p) {
   float n = fbm(p);
   return 1.0 - abs(n);
}

void main() { 
   vec3 normal = normalize(vNormal);
   vec3 viewDir = normalize(vViewPosition);
   vec3 lightDir = normalize(u_lightPosition - vViewPosition);
   
   // Couleur de base simple - blanc avec des variations subtiles
   vec3 baseColor = vec3(0.9, 0.95, 1.0);
   
   // Ajouter des variations de couleur basées sur le déplacement
   float displacementVariation = sin(vDisplacement * 8.0 + u_time * 0.2) * 0.15;
   baseColor += vec3(0.1, 0.15, 0.2) * displacementVariation;
   
   // Ajouter des variations basées sur la position
   float positionVariation = sin(vWorldPosition.x * 3.0 + vWorldPosition.z * 2.0 + u_time * 0.15) * 0.1;
   baseColor += vec3(0.05, 0.1, 0.15) * positionVariation;
   
   // Calcul de l'illumination diffuse (Lambert)
   float diffuse = max(dot(normal, lightDir), 0.0);
   
   // Calcul de l'illumination spéculaire (Blinn-Phong)
   vec3 halfDir = normalize(lightDir + viewDir);
   float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
   
   // Lumière ambiante
   vec3 ambient = baseColor * u_ambient;
   
   // Couleur finale avec la lumière tournante
   vec3 color = ambient + baseColor * diffuse + vec3(1.0, 1.0, 1.0) * spec * 0.5;
   
   // Ajout de la lumière fixe
   vec3 fixedLightDir = normalize(u_fixedLightPosition - vViewPosition);
   float fixedDiffuse = max(dot(normal, fixedLightDir), 0.0);
   color += baseColor * fixedDiffuse * 0.3;

   gl_FragColor = vec4(color, 1.0);
} 
`;