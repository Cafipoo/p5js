# QCM - TD4 Shaders WebGL

## Question 1 - Structure des Shaders
Dans un vertex shader Three.js, que fait `varying vec2 vUv` ?
- A) Déclare une variable uniforme
- B) Déclare une variable qui sera passée au fragment shader ✓
- C) Déclare une variable locale
- D) Déclare une texture

## Question 2 - Coordonnées UV
Que représentent les coordonnées UV dans un shader ?
- A) Les coordonnées 3D de l'objet
- B) Les coordonnées de texture normalisées (0-1) ✓
- C) Les coordonnées de la caméra
- D) Les coordonnées de l'écran

## Question 3 - Distance Signée
Qu'est-ce que la distance signée (SDF) ?
- A) La distance entre deux points
- B) Une fonction qui retourne la distance signée à une forme ✓
- C) La distance de la caméra à l'objet
- D) La distance entre les vertices

## Question 4 - Union Lisse
Que fait la fonction `opSmoothUnion()` ?
- A) Combine deux formes avec des bords nets
- B) Combine deux formes avec des bords lisses ✓
- C) Sépare deux formes
- D) Calcule l'intersection de deux formes

## Question 5 - Modèle d'Éclairage
Dans le modèle de Phong, que calcule l'illumination diffuse ?
- A) `max(dot(normal, lightDir), 0.0)` ✓
- B) `dot(normal, viewDir)`
- C) `length(lightDir)`
- D) `normalize(lightDir)`

## Question 6 - Illumination Spéculaire
Dans Blinn-Phong, que représente `halfDir` ?
- A) La direction de la lumière
- B) La direction de la vue
- C) La moyenne entre la direction de la lumière et de la vue ✓
- D) La direction de la normale

## Question 7 - Bruit de Perlin
Qu'est-ce que le bruit de Perlin ?
- A) Un algorithme de génération de nombres aléatoires
- B) Un algorithme de génération de bruit procédural lisse ✓
- C) Un algorithme de compression d'image
- D) Un algorithme de détection de collision

## Question 8 - FBM (Fractional Brownian Motion)
Que fait la fonction FBM ?
- A) Combine plusieurs octaves de bruit ✓
- B) Calcule la distance entre deux points
- C) Génère des couleurs aléatoires
- D) Optimise les performances

## Question 9 - Uniformes
Que sont les uniformes dans un shader ?
- A) Des variables qui changent pour chaque vertex
- B) Des variables constantes pour tous les pixels ✓
- C) Des textures
- D) Des fonctions mathématiques

## Question 10 - Déformation de Géométrie
Dans l'exercice 6, où se fait la déformation des vertices ?
- A) Dans le fragment shader
- B) Dans le vertex shader ✓
- C) Dans le CPU
- D) Dans la géométrie Three.js

## Question 11 - Bruit de Worley
Quelle est la particularité du bruit de Worley ?
- A) Il génère des formes circulaires
- B) Il génère des formes cellulaires/organiques ✓
- C) Il est plus rapide que Perlin
- D) Il utilise moins de mémoire

## Question 12 - Transparence
Pour activer la transparence dans un shader, que faut-il faire ?
- A) Utiliser `gl_FragColor = vec4(color, 0.5)`
- B) Définir `transparent: true` dans le matériau ✓
- C) Utiliser `alphaTest`
- D) Toutes les réponses précédentes ✓

## Question 13 - Motif d'Échecs
Comment créer un motif d'échecs dans un shader ?
- A) `mod(floor(uv * scale), 2.0)` ✓
- B) `sin(uv.x) * cos(uv.y)`
- C) `length(uv - 0.5)`
- D) `fract(uv * scale)`

## Question 14 - Animation Temporelle
Pour animer un shader dans le temps, quel uniforme utilise-t-on ?
- A) `iResolution`
- B) `iMouse`
- C) `iTime` ✓
- D) `uTexture`

## Question 15 - Caméra Orthographique
Quelle est la différence entre une caméra orthographique et perspective ?
- A) L'orthographique n'a pas de perspective ✓
- B) L'orthographique est plus rapide
- C) L'orthographique utilise moins de mémoire
- D) Il n'y a pas de différence

---

**Réponses :**
1. B, 2. B, 3. B, 4. B, 5. A, 6. C, 7. B, 8. A, 9. B, 10. B, 11. B, 12. D, 13. A, 14. C, 15. A
