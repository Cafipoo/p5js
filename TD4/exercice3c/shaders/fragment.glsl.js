export const fragmentShader = ` 
precision mediump float;

varying vec2 vUv;
uniform vec2 iResolution; // Résolution de l'écran
uniform vec2 iMouse;      // Position de la souris
uniform float iTime;      // Temps pour les animations
uniform sampler2D uTexture; // Texture de l'image

void main() {
    // Coordonnées normalisées (centrées et mises à l'échelle)
    vec2 p = (vUv - 0.5) * 2.0;
    
    // Ajuster l'aspect ratio
    p.x *= iResolution.x / iResolution.y;

    // Charger la texture de l'image
    vec4 originalColor = texture2D(uTexture, vUv);
    
    // Appliquer un filtre bleu (augmenter le canal bleu)
    vec3 blueFilter = originalColor.rgb;
    blueFilter.b = min(blueFilter.b * 1.5, 1.0); // Augmenter le bleu
    blueFilter.r = blueFilter.r * 0.7; // Réduire le rouge
    blueFilter.g = blueFilter.g * 0.8; // Réduire légèrement le vert
    
    // Position de la souris normalisée
    vec2 mousePos = (iMouse.xy / iResolution.xy) * 2.0 - 1.0;
    mousePos.x *= iResolution.x / iResolution.y; // Ajuster l'aspect ratio
    
    // Distance entre le pixel actuel et la position de la souris
    float dist = length(p - mousePos);
    
    // Rayon de la zone où le filtre est enlevé
    float radius = 0.3;
    
    // Fonction smoothstep pour créer une transition douce
    float mask = smoothstep(radius, radius - 0.1, dist);
    
    // Mélanger l'image originale et l'image filtrée
    vec3 finalColor = mix(blueFilter, originalColor.rgb, mask);
    
    // Sortie de la couleur finale
    gl_FragColor = vec4(finalColor, 1.0);
}
`;
