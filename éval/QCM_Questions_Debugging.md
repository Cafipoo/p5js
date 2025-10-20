# QCM - Questions de Debugging et Résolution de Problèmes

## Question 1 - Objet Invisible
Votre cube n'apparaît pas. Quelle est la cause la plus probable ?
- A) La caméra est mal positionnée ✓
- B) Le matériau est transparent
- C) L'objet est trop petit
- D) La géométrie est incorrecte

## Question 2 - Performance Dégradée
Votre application ralentit avec beaucoup d'objets. Quelle solution essayer en premier ?
- A) Réduire la résolution
- B) Utiliser `InstancedMesh` ✓
- C) Désactiver les ombres
- D) Changer de navigateur

## Question 3 - Fuite Mémoire
La mémoire augmente continuellement. Que vérifier ?
- A) Appeler `dispose()` sur les géométries et matériaux ✓
- B) Réduire le nombre d'objets
- C) Utiliser des textures plus petites
- D) Redémarrer le navigateur

## Question 4 - Collision Non Détectée
Un objet passe à travers un autre. Quelle vérification faire ?
- A) Vérifier que les deux objets ont des corps physiques ✓
- B) Augmenter la gravité
- C) Changer les matériaux
- D) Modifier la géométrie

## Question 5 - Shader Erreur
Votre shader personnalisé ne fonctionne pas. Que vérifier ?
- A) La syntaxe GLSL ✓
- B) Les uniformes
- C) La géométrie
- D) Les lumières

## Question 6 - Animation Saccadée
L'animation est saccadée. Quelle solution ?
- A) Utiliser `clock.getDelta()` ✓
- B) Augmenter la fréquence de rendu
- C) Réduire la complexité
- D) Changer de matériau

## Question 7 - Particules Qui Disparaissent
Vos particules disparaissent trop tôt. Comment les garder ?
- A) Augmenter `lifeMax` ✓
- B) Réduire la vitesse
- C) Changer le matériau
- D) Modifier la géométrie

## Question 8 - Caméra Qui Tremble
La caméra qui suit un objet tremble. Comment stabiliser ?
- A) Utiliser `lerp()` pour lisser ✓
- B) Réduire la vitesse
- C) Changer de type de caméra
- D) Désactiver les contrôles

## Question 9 - Raycaster Imprécis
Le Raycaster ne détecte pas les clics précisément. Que faire ?
- A) Vérifier les coordonnées de la souris ✓
- B) Augmenter la taille des objets
- C) Changer de caméra
- D) Utiliser des événements différents

## Question 10 - Texture Floue
Vos textures sont floues. Quelle solution ?
- A) Augmenter la résolution de la texture ✓
- B) Changer le filtre
- C) Réduire la taille de l'objet
- D) Modifier le shader

## Question 11 - Physique Instable
La simulation physique est instable. Que faire ?
- A) Réduire le pas de temps ✓
- B) Augmenter la gravité
- C) Utiliser plus d'objets
- D) Changer de solver

## Question 12 - Objet Qui Passe à Travers le Sol
Un objet passe à travers le sol. Quelle cause ?
- A) Le sol n'a pas de corps physique ✓
- B) La gravité est trop faible
- C) L'objet est trop léger
- D) Le matériau est incorrect

## Question 13 - Animation Qui Se Répète
Votre animation se répète en boucle. Comment l'arrêter ?
- A) `action.setLoop(THREE.LoopOnce)` ✓
- B) `action.stop()`
- C) `mixer.stopAllAction()`
- D) Changer de modèle

## Question 14 - Particules Qui S'Accumulent
Les particules s'accumulent au sol. Comment les recycler ?
- A) Vérifier la position Y et les repositionner ✓
- B) Réduire la gravité
- C) Augmenter la vitesse
- D) Changer le matériau

## Question 15 - Contrainte Trop Raide
Une contrainte est trop raide. Que faire ?
- A) Réduire la raideur ✓
- B) Augmenter la masse
- C) Changer de type de contrainte
- D) Modifier la gravité

## Question 16 - Performance sur Mobile
Votre application est lente sur mobile. Quelle optimisation ?
- A) Réduire le nombre d'objets ✓
- B) Désactiver les ombres ✓
- C) Utiliser des matériaux plus simples ✓
- D) Toutes les réponses précédentes ✓

## Question 17 - Erreur WebGL
Vous obtenez une erreur WebGL. Que vérifier ?
- A) Le navigateur supporte WebGL ✓
- B) Les drivers graphiques sont à jour ✓
- C) Le contexte WebGL est créé correctement ✓
- D) Toutes les réponses précédentes ✓

## Question 18 - Objet Qui Tremble
Un objet tremble dans la simulation physique. Pourquoi ?
- A) Les contraintes sont trop raides ✓
- B) Le pas de temps est trop grand
- C) Les masses sont trop différentes
- D) La gravité est trop forte

## Question 19 - Shader Trop Lent
Votre shader ralentit l'application. Que faire ?
- A) Optimiser les calculs dans le shader ✓
- B) Réduire la résolution
- C) Utiliser moins d'uniformes
- D) Changer de matériau

## Question 20 - Collision Entre Particules
Vous voulez que les particules se repoussent. Comment ?
- A) Utiliser des forces dans Cannon.js ✓
- B) Modifier le shader
- C) Changer la géométrie
- D) Utiliser des contraintes

---

**Réponses :**
1. A, 2. B, 3. A, 4. A, 5. A, 6. A, 7. A, 8. A, 9. A, 10. A, 11. A, 12. A, 13. A, 14. A, 15. A, 16. D, 17. D, 18. A, 19. A, 20. A
