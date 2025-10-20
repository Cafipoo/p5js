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

void main() {
    // Coordonnées normalisées (centrées et mises à l'échelle)
    vec2 p = (vUv - 0.5) * 2.0;
    
    // Ajuster l'aspect ratio pour que le cercle soit parfaitement rond
    p.x *= iResolution.x / iResolution.y;

    // Calcul de la distance signée pour le cercle
    float d = sdCircle(p, 0.5);

    // Coloration du cercle
    vec3 col = (d > 0.0) ? vec3(0.9, 0.6, 0.3) : vec3(0.65, 0.85, 1.0);
    col *= 1.0 - exp(-6.0 * abs(d));
    col *= 0.8 + 0.2 * cos(150.0 * d);
    col = mix(col, vec3(1.0), 1.0 - smoothstep(0.0, 0.01, abs(d)));

    // Sortie de la couleur finale
    gl_FragColor = vec4(col, 1.0);
}
`;