export const vertexShader = ` 
precision mediump float;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying float vDisplacement; // Passer la valeur de déplacement au fragment shader
uniform float u_time;
uniform float u_displacementStrength;
uniform float u_noiseScale;

// Fonction de hachage pour générer des valeurs pseudo-aléatoires
float hash(float n) { 
   return fract(sin(n) * 43758.5453123); 
}

// Fonction de bruit 3D (bruit de Perlin)
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

// Fractal Brownian Motion - combine plusieurs octaves de bruit
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

// Bruit de Ridged pour des structures plus définies
float ridgedNoise(vec3 p) {
   float n = fbm(p);
   return 1.0 - abs(n);
}

void main() { 
   // Position dans l'espace monde
   vec4 worldPosition = modelMatrix * vec4(position, 1.0);
   vWorldPosition = worldPosition.xyz;
   
   // Position pour le calcul du bruit avec animation (amplifiée)
   vec3 noisePos = worldPosition.xyz * u_noiseScale * 0.5;
   noisePos += vec3(u_time * 0.2, u_time * 0.15, u_time * 0.25);
   
   // Calculer le déplacement basé sur le bruit (amplifié)
   float displacement1 = fbm(noisePos);
   float displacement2 = ridgedNoise(noisePos * 1.5 + vec3(u_time * 0.1));
   float displacement3 = fbm(noisePos * 3.0 + vec3(u_time * 0.08));
   float displacement4 = fbm(noisePos * 6.0 + vec3(u_time * 0.05));
   
   // Combiner les déplacements pour un effet plus complexe et amplifié
   float totalDisplacement = displacement1 * 0.4 + 
                            displacement2 * 0.3 + 
                            displacement3 * 0.2 + 
                            displacement4 * 0.1;
   
   // Amplifier le déplacement et normaliser entre -1 et 1
   totalDisplacement = (totalDisplacement * 2.0 - 1.0) * 1.5;
   
   // Appliquer le déplacement le long du vecteur normal
   vec3 displacedPosition = position + normal * totalDisplacement * u_displacementStrength;
   
   // Stocker la valeur de déplacement pour le fragment shader
   vDisplacement = totalDisplacement;
   
   // Calculer la position finale avec déplacement
   vec4 modelViewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
   gl_Position = projectionMatrix * modelViewPosition;
   
   vViewPosition = -modelViewPosition.xyz;
   vNormal = normalize(normalMatrix * normal);
   vUv = uv;
} 
`;