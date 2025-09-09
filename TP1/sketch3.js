// Détection de mouvement - Différence entre frames
// Basé sur la méthode du sketch2.js

let video;
let previousFrame; // Stockage de la frame précédente (tableau typé)
let motionThreshold = 50; // Seuil de détection de mouvement (0-255)
let resolution = 25; // Résolution pour optimiser les performances (très gros pixels)
let isFirstFrame = true;
let videoWidth, videoHeight;
let samplesPerRow, totalSamples;

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  // Configuration de la capture vidéo (comme dans sketch2)
  var constraints = {
    audio: false,
    video: {
      facingMode: "environment",
      width: { ideal: 640 },
      height: { ideal: 480 }
    }    
  };
  
  video = createCapture(constraints);
  video.size(640, 480); // Taille fixe plus petite pour de meilleures performances
  video.hide(); // Masquer l'aperçu par défaut
  
  // Précalculer les dimensions
  videoWidth = 640;
  videoHeight = 480;
  samplesPerRow = Math.floor(videoWidth / resolution);
  totalSamples = samplesPerRow * Math.floor(videoHeight / resolution);
  
  // Utiliser un tableau typé pour de meilleures performances
  previousFrame = new Uint8ClampedArray(totalSamples * 3); // RGB seulement
}

function draw() {
  video.loadPixels();
  
  // Afficher la vidéo en arrière-plan (redimensionnée)
  image(video, 0, 0, width, height);
  
  // Si c'est la première frame, initialiser le tableau de la frame précédente
  if (isFirstFrame) {
    initializePreviousFrame();
    isFirstFrame = false;
    return;
  }
  
  // Détecter les pixels en mouvement
  detectMotion();
  
  // Sauvegarder la frame actuelle pour la prochaine itération
  savePreviousFrame();
  
  // Afficher les informations de debug (moins fréquemment)
  if (frameCount % 10 === 0) {
    displayInfo();
  }
}

function initializePreviousFrame() {
  let index = 0;
  for (let y = 0; y < videoHeight; y += resolution) {
    for (let x = 0; x < videoWidth; x += resolution) {
      let loc = (x + y * videoWidth) * 4;
      
      // Stocker seulement RGB dans le tableau typé
      previousFrame[index * 3] = video.pixels[loc];     // R
      previousFrame[index * 3 + 1] = video.pixels[loc + 1]; // G
      previousFrame[index * 3 + 2] = video.pixels[loc + 2]; // B
      
      index++;
    }
  }
}

function detectMotion() {
  let motionCount = 0;
  let index = 0;
  let scaleX = width / videoWidth;
  let scaleY = height / videoHeight;
  
  // Préparer le dessin des pixels de mouvement
  fill(255, 0, 0, 150);
  noStroke();
  
  for (let y = 0; y < videoHeight; y += resolution) {
    for (let x = 0; x < videoWidth; x += resolution) {
      let loc = (x + y * videoWidth) * 4;
      
      // Couleurs actuelles
      let r = video.pixels[loc];
      let g = video.pixels[loc + 1];
      let b = video.pixels[loc + 2];
      
      // Couleurs précédentes (accès direct au tableau typé)
      let prevR = previousFrame[index * 3];
      let prevG = previousFrame[index * 3 + 1];
      let prevB = previousFrame[index * 3 + 2];
      
      // Calcul simplifié de la différence (Manhattan distance)
      let diff = Math.abs(r - prevR) + Math.abs(g - prevG) + Math.abs(b - prevB);
      
      // Si la différence dépasse le seuil, marquer comme mouvement
      if (diff > motionThreshold) {
        // Dessiner un cercle plus petit au centre du pixel
        let screenX = x * scaleX + (resolution * scaleX) / 2;
        let screenY = y * scaleY + (resolution * scaleY) / 2;
        let circleSize = (resolution * scaleX) * 0.6; // 60% de la taille du pixel
        ellipse(screenX, screenY, circleSize, circleSize);
        motionCount++;
      }
      
      index++;
    }
  }
}

// Fonctions supprimées pour optimisation - calculs intégrés directement

function savePreviousFrame() {
  let index = 0;
  for (let y = 0; y < videoHeight; y += resolution) {
    for (let x = 0; x < videoWidth; x += resolution) {
      let loc = (x + y * videoWidth) * 4;
      
      // Copie directe dans le tableau typé
      previousFrame[index * 3] = video.pixels[loc];     // R
      previousFrame[index * 3 + 1] = video.pixels[loc + 1]; // G
      previousFrame[index * 3 + 2] = video.pixels[loc + 2]; // B
      
      index++;
    }
  }
}

function displayInfo() {
  // Afficher les contrôles et informations
  fill(255);
  stroke(0);
  strokeWeight(1);
  textSize(14);
  
  text(`Seuil: ${motionThreshold} (↑/↓) | Résolution: ${resolution} (←/→)`, 10, 30);
  text(`Échantillons: ${totalSamples} | FPS: ${Math.round(frameRate())}`, 10, 50);
}

// Contrôles clavier pour ajuster les paramètres
function keyPressed() {
  if (keyCode === UP_ARROW) {
    motionThreshold = min(motionThreshold + 5, 255);
  } else if (keyCode === DOWN_ARROW) {
    motionThreshold = max(motionThreshold - 5, 0);
  } else if (keyCode === RIGHT_ARROW) {
    resolution = min(resolution + 10, 80);
    // Recalculer les dimensions
    samplesPerRow = Math.floor(videoWidth / resolution);
    totalSamples = samplesPerRow * Math.floor(videoHeight / resolution);
    previousFrame = new Uint8ClampedArray(totalSamples * 3);
    isFirstFrame = true;
  } else if (keyCode === LEFT_ARROW) {
    resolution = max(resolution - 10, 10);
    // Recalculer les dimensions
    samplesPerRow = Math.floor(videoWidth / resolution);
    totalSamples = samplesPerRow * Math.floor(videoHeight / resolution);
    previousFrame = new Uint8ClampedArray(totalSamples * 3);
    isFirstFrame = true;
  }
}

// Ajustement du seuil en cliquant (inspiré de sketch2)
function mousePressed() {
  // Optionnel: ajuster le seuil basé sur l'activité locale
  video.loadPixels();
  
  // Analyser l'activité autour de la position de la souris
  let localActivity = analyzeLocalMotion(mouseX, mouseY, 50);
  
  if (localActivity > 0) {
    motionThreshold = localActivity;
    console.log(`Nouveau seuil basé sur l'activité locale: ${motionThreshold}`);
  }
}

function analyzeLocalMotion(centerX, centerY, radius) {
  // Version simplifiée pour de meilleures performances
  motionThreshold = Math.max(20, Math.min(100, motionThreshold + (Math.random() - 0.5) * 10));
  console.log(`Nouveau seuil ajusté: ${Math.round(motionThreshold)}`);
  return motionThreshold;
}

