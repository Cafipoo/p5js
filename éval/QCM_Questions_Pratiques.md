# QCM - Questions Pratiques et Cas d'Usage

## Question 1 - Problème de Performance
Vous avez une scène avec 1000 cubes qui bougent. Les FPS chutent. Quelle est la première solution à essayer ?
- A) Réduire la résolution
- B) Utiliser `InstancedMesh` ✓
- C) Supprimer les lumières
- D) Changer de navigateur

## Question 2 - Fuite Mémoire
Vos particules ne sont pas supprimées correctement. Que faut-il vérifier ?
- A) Appeler `geometry.dispose()` et `material.dispose()` ✓
- B) Réduire le nombre de particules
- C) Utiliser des géométries plus simples
- D) Redémarrer le navigateur

## Question 3 - Collision Non Détectée
Un objet passe à travers un autre. Quelle est la cause la plus probable ?
- A) La géométrie physique ne correspond pas à la géométrie visuelle ✓
- B) La gravité est trop faible
- C) Les matériaux sont identiques
- D) Le broadphase est mal configuré

## Question 4 - Shader Ne Fonctionne Pas
Votre shader personnalisé ne s'affiche pas. Que vérifier en premier ?
- A) La syntaxe GLSL ✓
- B) Les uniformes
- C) La géométrie
- D) Les lumières

## Question 5 - Animation Saccadée
L'animation de votre personnage est saccadée. Quelle est la solution ?
- A) Augmenter la fréquence de `requestAnimationFrame`
- B) Utiliser `clock.getDelta()` pour l'animation ✓
- C) Réduire la complexité du modèle
- D) Désactiver les ombres

## Question 6 - Objet Invisible
Un objet n'apparaît pas dans la scène. Que vérifier ?
- A) Position de la caméra
- B) Position de l'objet ✓
- C) Matériau de l'objet ✓
- D) Lumières dans la scène ✓

## Question 7 - Particules Trop Lentes
Vos particules bougent trop lentement. Comment les accélérer ?
- A) Augmenter la vélocité ✓
- B) Réduire la gravité
- C) Changer le matériau
- D) Modifier la géométrie

## Question 8 - Contrainte Cassée
Une contrainte entre deux objets se casse. Pourquoi ?
- A) La distance maximale est dépassée ✓
- B) Les objets sont trop lourds
- C) La gravité est trop forte
- D) Les matériaux sont incompatibles

## Question 9 - Raycaster Imprécis
Le Raycaster ne détecte pas les clics précisément. Que faire ?
- A) Vérifier les coordonnées de la souris ✓
- B) Augmenter la taille des objets
- C) Changer de caméra
- D) Utiliser des événements différents

## Question 10 - Texture Floue
Vos textures apparaissent floues. Quelle est la solution ?
- A) Augmenter la résolution de la texture ✓
- B) Changer le filtre à `NearestFilter`
- C) Réduire la taille de l'objet
- D) Modifier le shader

## Question 11 - Physique Instable
La simulation physique est instable. Que faire ?
- A) Réduire le pas de temps (`timeStep`) ✓
- B) Augmenter la gravité
- C) Utiliser plus d'objets
- D) Changer de solver

## Question 12 - Particules Qui Disparaissent
Vos particules disparaissent trop tôt. Comment les garder plus longtemps ?
- A) Augmenter la valeur de `lifeMax` ✓
- B) Réduire la vitesse de fade
- C) Changer le matériau
- D) Modifier la géométrie

## Question 13 - Caméra Qui Tremble
La caméra qui suit un objet tremble. Comment stabiliser ?
- A) Utiliser `lerp()` pour lisser le mouvement ✓
- B) Réduire la vitesse de suivi
- C) Changer de type de caméra
- D) Désactiver les contrôles

## Question 14 - Shader Trop Lent
Votre shader personnalisé ralentit l'application. Que faire ?
- A) Optimiser les calculs dans le shader ✓
- B) Réduire la résolution
- C) Utiliser moins d'uniformes
- D) Changer de matériau

## Question 15 - Collision Entre Particules
Vous voulez que les particules se repoussent. Comment faire ?
- A) Utiliser des forces dans Cannon.js ✓
- B) Modifier le shader
- C) Changer la géométrie
- D) Utiliser des contraintes

## Question 16 - Objet Qui Passe à Travers le Sol
Un objet passe à travers le sol. Quelle est la cause ?
- A) Le sol n'a pas de corps physique ✓
- B) La gravité est trop faible
- C) L'objet est trop léger
- D) Le matériau est incorrect

## Question 17 - Animation Qui Se Répète
Votre animation se répète en boucle. Comment l'arrêter ?
- A) `action.setLoop(THREE.LoopOnce)` ✓
- B) `action.stop()`
- C) `mixer.stopAllAction()`
- D) Changer de modèle

## Question 18 - Particules Qui S'Accumulent
Les particules s'accumulent au sol. Comment les recycler ?
- A) Vérifier la position Y et les repositionner ✓
- B) Réduire la gravité
- C) Augmenter la vitesse
- D) Changer le matériau

## Question 19 - Contrainte Trop Raide
Une contrainte est trop raide et casse la simulation. Que faire ?
- A) Réduire la raideur (`stiffness`) ✓
- B) Augmenter la masse des objets
- C) Changer de type de contrainte
- D) Modifier la gravité

## Question 20 - Performance sur Mobile
Votre application est lente sur mobile. Quelle optimisation prioritaire ?
- A) Réduire le nombre d'objets ✓
- B) Désactiver les ombres ✓
- C) Utiliser des matériaux plus simples ✓
- D) Toutes les réponses précédentes ✓

---

**Réponses :**
1. B, 2. A, 3. A, 4. A, 5. B, 6. B+C+D, 7. A, 8. A, 9. A, 10. A, 11. A, 12. A, 13. A, 14. A, 15. A, 16. A, 17. A, 18. A, 19. A, 20. D
