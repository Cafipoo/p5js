# QCM - Questions Générales et Intégration

## Question 1 - Architecture Générale
Quelle est la structure typique d'une application Three.js ?
- A) Scene → Camera → Renderer → Mesh
- B) Scene → Camera → Renderer → Geometry → Material → Mesh ✓
- C) Camera → Scene → Mesh → Renderer
- D) Renderer → Scene → Camera → Mesh

## Question 2 - Gestion Mémoire
Quelle est la meilleure pratique pour éviter les fuites mémoire avec Three.js ?
- A) Ne jamais utiliser `dispose()`
- B) Toujours appeler `dispose()` sur les géométries et matériaux ✓
- C) Utiliser seulement des géométries partagées
- D) Redémarrer l'application régulièrement

## Question 3 - Performance
Quelle technique améliore le plus les performances avec beaucoup d'objets similaires ?
- A) Instanced rendering ✓
- B) Utiliser des matériaux différents
- C) Augmenter la résolution
- D) Ajouter plus de lumières

## Question 4 - Événements
Comment gérer les événements de clic sur des objets 3D ?
- A) Avec des event listeners sur le DOM
- B) Avec Raycaster ✓
- C) Avec des callbacks sur les matériaux
- D) Avec des timers

## Question 5 - Animation
Quelle est la différence entre `requestAnimationFrame` et `setInterval` ?
- A) `requestAnimationFrame` est synchronisé avec le refresh de l'écran ✓
- B) `setInterval` est plus précis
- C) `requestAnimationFrame` est plus lent
- D) Il n'y a pas de différence

## Question 6 - Coordonnées
Dans Three.js, quel axe pointe vers le haut par défaut ?
- A) X
- B) Y ✓
- C) Z
- D) Cela dépend de la caméra

## Question 7 - Matériaux
Quelle est la différence entre `MeshBasicMaterial` et `MeshStandardMaterial` ?
- A) `MeshStandardMaterial` supporte l'éclairage physique ✓
- B) `MeshBasicMaterial` est plus rapide ✓
- C) `MeshStandardMaterial` a plus d'options ✓
- D) Toutes les réponses précédentes ✓

## Question 8 - Lumières
Quel type de lumière est le plus réaliste pour simuler le soleil ?
- A) `AmbientLight`
- B) `DirectionalLight` ✓
- C) `PointLight`
- D) `SpotLight`

## Question 9 - Ombres
Pour activer les ombres dans Three.js, que faut-il faire ?
- A) `renderer.shadowMap.enabled = true` ✓
- B) `scene.shadows = true`
- C) `camera.shadows = true`
- D) `material.shadows = true`

## Question 10 - Chargement de Modèles
Quel format de modèle 3D est le plus adapté pour le web ?
- A) OBJ
- B) FBX
- C) GLTF ✓
- D) 3DS

## Question 11 - Shaders
Quelle est la différence entre vertex shader et fragment shader ?
- A) Vertex shader traite les sommets, fragment shader traite les pixels ✓
- B) Fragment shader est plus rapide
- C) Vertex shader gère les couleurs
- D) Il n'y a pas de différence

## Question 12 - Uniformes
Les uniformes dans un shader sont-ils :
- A) Identiques pour tous les pixels ✓
- B) Différents pour chaque pixel
- C) Calculés par le CPU
- D) Stockés dans la géométrie

## Question 13 - Physique
Quelle est la différence entre physique continue et discrète ?
- A) Continue : calculs à chaque frame, Discrète : calculs à intervalles fixes ✓
- B) Continue : plus rapide, Discrète : plus précis
- C) Continue : pour les objets statiques, Discrète : pour les objets dynamiques
- D) Il n'y a pas de différence

## Question 14 - Collisions
Qu'est-ce que le broadphase dans la détection de collisions ?
- A) La phase finale de détection
- B) La phase d'optimisation qui élimine les paires impossibles ✓
- C) La phase de calcul des forces
- D) La phase de rendu

## Question 15 - Intégration
Quel est le défi principal lors de l'intégration de physique et de rendu ?
- A) Synchronisation des positions et rotations ✓
- B) Gestion de la mémoire
- C) Performance du rendu
- D) Compatibilité des navigateurs

## Question 16 - Optimisation
Quelle technique réduit le plus la consommation mémoire avec des particules ?
- A) Utiliser des géométries partagées ✓
- B) Réduire le nombre de particules
- C) Utiliser des matériaux plus simples
- D) Désactiver les ombres

## Question 17 - Debugging
Quel outil est le plus utile pour déboguer une scène Three.js ?
- A) `console.log`
- B) `THREE.SceneUtils` (deprecated)
- C) `stats.js` pour les FPS ✓
- D) `THREE.WireframeHelper`

## Question 18 - Responsive Design
Comment adapter une scène Three.js à différentes tailles d'écran ?
- A) Redimensionner le canvas et mettre à jour la caméra ✓
- B) Changer la résolution des textures
- C) Réduire le nombre d'objets
- D) Utiliser des shaders différents

## Question 19 - Compatibilité
Quel navigateur supporte le mieux WebGL ?
- A) Internet Explorer
- B) Chrome/Firefox/Safari modernes ✓
- C) Edge uniquement
- D) Tous les navigateurs

## Question 20 - Bonnes Pratiques
Quelle est la meilleure pratique pour organiser le code Three.js ?
- A) Tout dans un seul fichier
- B) Séparer en modules (scène, caméra, objets, etc.) ✓
- C) Utiliser des classes globales
- D) Éviter les commentaires

---

**Réponses :**
1. B, 2. B, 3. A, 4. B, 5. A, 6. B, 7. D, 8. B, 9. A, 10. C, 11. A, 12. A, 13. A, 14. B, 15. A, 16. A, 17. C, 18. A, 19. B, 20. B
