export const fragmentShader = ` 
precision mediump float;

varying vec2 vUv;
uniform vec2 iResolution; // Résolution de l'écran
uniform vec2 iMouse;      // Position de la souris
uniform float iTime;      // Temps pour les animations

// Fonction de distance signée pour un cercle
float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

// Fonction d'union lisse (smooth union)
float opSmoothUnion(float d1, float d2, float k) {
    k *= 4.0;
    float h = max(k - abs(d1 - d2), 0.0);
    return min(d1, d2) - h * h * 0.25 / k;
}

void main() {
    // Coordonnées normalisées (centrées et mises à l'échelle)
    vec2 p = (vUv - 0.5) * 2.0;
    
    // Ajuster l'aspect ratio pour que le cercle soit parfaitement rond
    p.x *= iResolution.x / iResolution.y;

    // Position du premier cercle (fixe au centre)
    vec2 center1 = vec2(0.0, 0.0);
    float d1 = sdCircle(p - center1, 0.3);
    
    // Position du deuxième cercle (contrôlée par la souris)
    vec2 mousePos = (iMouse.xy / iResolution.xy) * 2.0 - 1.0;
    mousePos.x *= iResolution.x / iResolution.y; // Ajuster l'aspect ratio
    float d2 = sdCircle(p - mousePos, 0.3);
    
    // Union lisse des deux cercles
    float k = 0.1; // Paramètre de lissage
    float d = opSmoothUnion(d1, d2, k);

    // Coloration du résultat
    vec3 col = (d > 0.0) ? vec3(0.9, 0.6, 0.3) : vec3(0.65, 0.85, 1.0);
    col *= 1.0 - exp(-6.0 * abs(d));
    col *= 0.8 + 0.2 * cos(150.0 * d);
    col = mix(col, vec3(1.0), 1.0 - smoothstep(0.0, 0.01, abs(d)));

    // Sortie de la couleur finale
    gl_FragColor = vec4(col, 1.0);
}
`;