# QCM - TPColision Physique et Détection de Collisions

## Question 1 - Cannon.js
Qu'est-ce que Cannon.js ?
- A) Une bibliothèque de physique 3D pour JavaScript ✓
- B) Une bibliothèque de rendu 3D
- C) Une bibliothèque d'animation
- D) Une bibliothèque de son

## Question 2 - Monde Physique
Comment créer un monde physique avec gravité dans Cannon.js ?
- A) `new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) })` ✓
- B) `new CANNON.Scene({ gravity: 9.82 })`
- C) `new CANNON.Physics({ force: -9.82 })`
- D) `new CANNON.Gravity(0, -9.82, 0)`

## Question 3 - Corps Statique vs Dynamique
Quelle est la différence entre un corps statique et dynamique ?
- A) Le statique a une masse de 0 ✓
- B) Le dynamique ne peut pas bouger
- C) Le statique est plus lourd
- D) Il n'y a pas de différence

## Question 4 - Formes Physiques
Quelles formes physiques sont disponibles dans Cannon.js ?
- A) Sphere, Box, Plane ✓
- B) Circle, Triangle, Rectangle
- C) Cube, Cylinder, Torus
- D) Toutes les formes géométriques

## Question 5 - Synchronisation
Pour synchroniser un mesh Three.js avec un corps Cannon.js, que faut-il faire ?
- A) Copier la position et la rotation ✓
- B) Copier seulement la position
- C) Copier seulement la rotation
- D) Utiliser des contraintes

## Question 6 - Matériaux Physiques
À quoi servent les matériaux physiques dans Cannon.js ?
- A) À définir l'apparence visuelle
- B) À définir les propriétés de collision (friction, restitution) ✓
- C) À optimiser les performances
- D) À gérer la mémoire

## Question 7 - ContactMaterial
Que fait `ContactMaterial` ?
- A) Définit l'apparence des objets en contact
- B) Définit les propriétés de collision entre deux matériaux ✓
- C) Crée des contraintes entre objets
- D) Gère les événements de collision

## Question 8 - Contraintes
Qu'est-ce qu'une `DistanceConstraint` ?
- A) Une contrainte qui maintient une distance fixe entre deux corps ✓
- B) Une contrainte qui empêche la rotation
- C) Une contrainte qui limite la vitesse
- D) Une contrainte qui gère les collisions

## Question 9 - HingeConstraint
Que permet une `HingeConstraint` ?
- A) De maintenir une distance fixe
- B) De permettre une rotation autour d'un axe ✓
- C) De bloquer complètement le mouvement
- D) De créer des ressorts

## Question 10 - Raycaster
Dans l'exercice 2, à quoi sert le Raycaster ?
- A) À détecter les collisions physiques
- B) À lancer des balles vers un point ciblé ✓
- C) À calculer les ombres
- D) À optimiser le rendu

## Question 11 - TextGeometry
Qu'est-ce que `TextGeometry` ?
- A) Une géométrie Three.js pour créer du texte 3D ✓
- B) Une texture de texte
- C) Un matériau de texte
- D) Un shader de texte

## Question 12 - Contraintes de Degrés de Liberté
Dans l'exercice 3, que fait `linearFactor` ?
- A) Contrôle quels axes peuvent bouger ✓
- B) Contrôle la vitesse de rotation
- C) Contrôle la friction
- D) Contrôle la restitution

## Question 13 - Effet de Vague
Dans l'exercice 3, comment est créé l'effet de vague ?
- A) En appliquant des forces simultanées
- B) En appliquant des impulsions avec des délais ✓
- C) En utilisant des contraintes élastiques
- D) En modifiant la gravité

## Question 14 - Broadphase
Qu'est-ce que le broadphase dans Cannon.js ?
- A) Un algorithme d'optimisation des collisions ✓
- B) Un type de matériau
- C) Une forme géométrique
- D) Une contrainte

## Question 15 - Solver
Que fait le solver dans Cannon.js ?
- A) Résout les équations de physique ✓
- B) Optimise le rendu
- C) Gère la mémoire
- D) Calcule les ombres

## Question 16 - Damping
Que fait le damping (amortissement) ?
- A) Ralentit les mouvements pour plus de réalisme ✓
- B) Accélère les objets
- C) Change la direction des objets
- D) Crée des vibrations

## Question 17 - Impulse vs Force
Quelle est la différence entre `applyImpulse` et `applyForce` ?
- A) L'impulse est instantanée, la force est continue ✓
- B) L'impulse est plus forte
- C) La force est plus précise
- D) Il n'y a pas de différence

## Question 18 - Collision Detection
Quand les collisions sont-elles détectées dans Cannon.js ?
- A) À chaque frame
- B) Selon la fréquence du broadphase ✓
- C) Seulement au démarrage
- D) Quand on le demande

## Question 19 - Performance
Pour améliorer les performances avec beaucoup d'objets physiques, que peut-on faire ?
- A) Utiliser `allowSleep: true` ✓
- B) Augmenter la gravité
- C) Réduire la taille des objets
- D) Utiliser moins de matériaux

## Question 20 - Intégration Three.js
Quel est l'avantage d'utiliser Cannon.js avec Three.js ?
- A) Synchronisation automatique
- B) Physique réaliste avec rendu 3D ✓
- C) Meilleures performances
- D) Code plus simple

---

**Réponses :**
1. A, 2. A, 3. A, 4. A, 5. A, 6. B, 7. B, 8. A, 9. B, 10. B, 11. A, 12. A, 13. B, 14. A, 15. A, 16. A, 17. A, 18. B, 19. A, 20. B
