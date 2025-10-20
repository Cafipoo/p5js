export const fragmentShader = ` 
precision mediump float;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;
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
   
   // Position des nuages avec animation plus complexe
   vec3 cloudPos = vWorldPosition * 0.3;
   cloudPos += vec3(u_time * 0.05, u_time * 0.03, u_time * 0.07);
   
   // Ajouter des mouvements d'air turbulents
   vec3 windOffset = vec3(
       sin(u_time * 0.1 + vWorldPosition.y * 0.5) * 0.1,
       cos(u_time * 0.08 + vWorldPosition.x * 0.3) * 0.05,
       sin(u_time * 0.12 + vWorldPosition.z * 0.4) * 0.08
   );
   cloudPos += windOffset;
   
   // Générer plusieurs couches de nuages avec différentes techniques
   float cloud1 = fbm(cloudPos);                    // Base principale
   float cloud2 = fbm(cloudPos * 2.0 + vec3(u_time * 0.1)); // Détails moyens
   float cloud3 = fbm(cloudPos * 4.0 + vec3(u_time * 0.15)); // Détails fins
   float cloud4 = fbm(cloudPos * 8.0 + vec3(u_time * 0.2));  // Micro-détails
   
   // Ajouter du bruit de Worley pour des formes plus organiques
   float worley1 = worleyFbm(cloudPos * 1.5);
   float worley2 = worleyFbm(cloudPos * 3.0 + vec3(u_time * 0.1));
   
   // Bruit ridged pour des structures plus définies
   float ridged1 = ridgedNoise(cloudPos * 2.0);
   float ridged2 = ridgedNoise(cloudPos * 4.0 + vec3(u_time * 0.12));
   
   // Combiner toutes les couches pour un effet de nuage réaliste
   float cloudPattern = cloud1 * 0.4 + 
                       cloud2 * 0.25 + 
                       cloud3 * 0.15 + 
                       cloud4 * 0.1 +
                       worley1 * 0.3 +
                       worley2 * 0.2 +
                       ridged1 * 0.15 +
                       ridged2 * 0.1;
   
   // Normaliser et créer des zones plus définies
   cloudPattern = smoothstep(0.1, 0.8, cloudPattern);
   
   // Ajouter de la transparence variable
   float alpha = smoothstep(0.3, 0.9, cloudPattern);
   
   // Couleurs de nuage plus réalistes avec des variations
   vec3 cloudColor1 = vec3(0.95, 0.97, 1.0);  // Blanc pur
   vec3 cloudColor2 = vec3(0.85, 0.9, 0.95);  // Blanc cassé
   vec3 cloudColor3 = vec3(0.7, 0.8, 0.9);    // Bleu très clair
   vec3 cloudColor4 = vec3(0.6, 0.75, 0.85);  // Bleu ciel
   vec3 cloudColor5 = vec3(0.5, 0.7, 0.8);    // Bleu plus profond
   
   // Mélanger les couleurs selon l'intensité et la position
   vec3 baseColor = mix(cloudColor5, cloudColor4, cloudPattern);
   baseColor = mix(baseColor, cloudColor3, cloudPattern * 1.2);
   baseColor = mix(baseColor, cloudColor2, cloudPattern * 1.5);
   baseColor = mix(baseColor, cloudColor1, cloudPattern * 2.0);
   
   // Ajouter des variations de couleur basées sur la position et le temps
   float colorVariation1 = sin(vWorldPosition.x * 2.0 + vWorldPosition.z * 1.5 + u_time * 0.1) * 0.1;
   float colorVariation2 = cos(vWorldPosition.y * 1.8 + vWorldPosition.x * 2.2 + u_time * 0.08) * 0.08;
   float colorVariation3 = sin(vWorldPosition.z * 2.3 + vWorldPosition.y * 1.7 + u_time * 0.12) * 0.06;
   
   // Appliquer les variations de couleur
   baseColor += vec3(0.1, 0.15, 0.2) * colorVariation1;
   baseColor += vec3(0.05, 0.1, 0.15) * colorVariation2;
   baseColor += vec3(0.08, 0.12, 0.18) * colorVariation3;
   
   // Ajouter des ombres internes pour plus de profondeur
   float shadowNoise = fbm(cloudPos * 1.5 + vec3(u_time * 0.05));
   float shadowFactor = smoothstep(0.2, 0.6, shadowNoise);
   baseColor *= (0.7 + 0.3 * shadowFactor);
   
   // Calcul de l'illumination diffuse (Lambert)
   float diffuse = max(dot(normal, lightDir), 0.0);
   
   // Calcul de l'illumination spéculaire (Blinn-Phong) - plus doux pour les nuages
   vec3 halfDir = normalize(lightDir + viewDir);
   float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);
   
   // Lumière ambiante
   vec3 ambient = baseColor * u_ambient;
   
   // Couleur finale avec la lumière tournante
   vec3 color = ambient + baseColor * diffuse * 0.8 + vec3(1.0, 1.0, 1.0) * spec * 0.3;
   
   // Ajout de la lumière fixe
   vec3 fixedLightDir = normalize(u_fixedLightPosition - vViewPosition);
   float fixedDiffuse = max(dot(normal, fixedLightDir), 0.0);
   color += baseColor * fixedDiffuse * 0.4;
   
   // Ajouter un effet de brume légère
   float fogFactor = exp(-length(vViewPosition) * 0.1);
   color = mix(vec3(0.8, 0.9, 1.0), color, fogFactor);

   gl_FragColor = vec4(color, alpha);
} 
`;
