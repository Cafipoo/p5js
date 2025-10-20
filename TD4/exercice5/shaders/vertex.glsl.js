export const vertexShader = ` 
precision mediump float;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;
uniform float u_time;

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
                       mix( hash(n + 170.0), hash(n + 171.0), f.x), 
f.y), f.z); 
   return res; 
}

// Fractal Brownian Motion - combine plusieurs octaves de bruit
float fbm(vec3 p) { 
   float value = 0.0; 
   float amplitude = 0.5; 
   float frequency = 1.0;   
   for(int i = 0; i < 4; i++) { 
       value += amplitude * noise(p * frequency); 
       frequency *= 2.0; 
       amplitude *= 0.5; 
   } 
   return value; 
}

void main() { 
   // Position dans l'espace monde
   vec4 worldPosition = modelMatrix * vec4(position, 1.0);
   vWorldPosition = worldPosition.xyz;
   
   // Ajouter une légère déformation de la géométrie pour un effet de nuage plus organique
   vec3 cloudPos = worldPosition.xyz * 0.2;
   cloudPos += vec3(u_time * 0.02, u_time * 0.015, u_time * 0.025);
   
   // Déformation subtile basée sur le bruit
   float deformation = fbm(cloudPos) * 0.1;
   vec3 deformedPosition = position + normal * deformation;
   
   // Calculer la position finale avec déformation
   vec4 modelViewPosition = modelViewMatrix * vec4(deformedPosition, 1.0);
   gl_Position = projectionMatrix * modelViewPosition;
   
   vViewPosition = -modelViewPosition.xyz;
   vNormal = normalize(normalMatrix * normal);
   vUv = uv;
} 
`;
