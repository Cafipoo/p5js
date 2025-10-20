export const fragmentShader = ` 
precision mediump float;

varying vec2 vUv;
uniform vec2 iResolution; // Résolution de l'écran
uniform vec2 iMouse;      // Position de la souris
uniform float iTime;      // Temps pour les animations

// Fonction de distance signée pour un carré
float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// Fonction pour créer une grille répétitive
vec2 mod2(vec2 p, vec2 size) {
    return p - size * floor(p / size);
}

// Fonction pour créer un motif de grille
float gridPattern(vec2 p, float gridSize) {
    // Créer une grille de carrés
    vec2 gridPos = mod2(p, vec2(gridSize));
    vec2 center = vec2(gridSize * 0.5);
    float d = sdBox(gridPos - center, vec2(gridSize * 0.4));
    
    return d;
}

void main() {
    // Coordonnées normalisées (centrées et mises à l'échelle)
    vec2 p = (vUv - 0.5) * 2.0;
    
    // Ajuster l'aspect ratio
    p.x *= iResolution.x / iResolution.y;

    // Taille de la grille
    float gridSize = 0.15;
    
    // Animation de translation vers le bas à gauche
    vec2 offset = vec2(iTime * 0.3, -iTime * 0.2);
    p += offset;
    
    // Créer le motif de grille
    float d = gridPattern(p, gridSize);

    // Coloration des cubes
    vec3 col = vec3(1.0); // Blanc pour les cubes
    
    // Appliquer l'effet de distance pour les bords
    col *= 1.0 - smoothstep(0.0, 0.01, d);
    
    // Fond noir
    col = mix(vec3(0.0), col, 1.0 - smoothstep(0.0, 0.01, d));

    // Sortie de la couleur finale
    gl_FragColor = vec4(col, 1.0);
}
`;
