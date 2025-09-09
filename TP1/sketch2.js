// Daniel Shiffman
// http://codingtra.in
// Traduction en p5.js

let video;
let trackColor;
let threshold = 5; // Valeur fixe pour le seuil
let resolution = 5;
let searchRadius = 100;

let previousAvgX = 0;
let previousAvgY = 0;

function setup() {
  //createCanvas(240, 540);
	createCanvas(displayWidth, displayHeight);
  // Initialisation de la capture vidéo
	var constraints = {
    audio: false,
    video: {
      facingMode: "environment"
    }    
    //video: {
      //facingMode: "user"
    //} 
  };
  video = createCapture(constraints);
  //video.size(260, 540);
	video.size(displayWidth, displayHeight);
  video.hide(); // Masquer l'aperçu par défaut

  trackColor = color(232, 247, 170); // Couleur par défaut à suivre
  previousAvgX = width / 2;
  previousAvgY = height / 2;
}

function draw() {
  video.loadPixels();
  // Flip the video (optional)
  //translate(video.width, 0);
  //scale(-1, 1);
  image(video, 0, 0);

  let avgX = 0;
  let avgY = 0;
  let count = 0;

  // Parcours de chaque pixel de la vidéo
  for (let x = 0; x < video.width; x+=resolution) {
    for (let y = 0; y < video.height; y+=resolution) {
      if (dist(x, y, previousAvgX, previousAvgY) > searchRadius)
        continue; 
      let loc = (x + y * video.width) * 4;

      // Couleur actuelle du pixel
      let r1 = video.pixels[loc];
      let g1 = video.pixels[loc + 1];
      let b1 = video.pixels[loc + 2];
      
      let r2 = red(trackColor);
      let g2 = green(trackColor);
      let b2 = blue(trackColor);

      // Calcul de la distance carrée
      let d = distSq(r1, g1, b1, r2, g2, b2);

      if (d < threshold * threshold) {
        stroke(0);
        strokeWeight(2);
        point(x, y);
				d = 1 - d/(threshold * threshold)
        avgX += x*d;
        avgY += y*d;
        count+=d;
      }
    }
  }

  // Si des pixels correspondants sont trouvés
  if (count > 0) {
    avgX = avgX / count;
    avgY = avgY / count;

    // Dessiner un cercle autour de la zone suivie
    fill(255);
    strokeWeight(4);
    stroke(0);
    ellipse(avgX, avgY, 24, 24);

		console.log(dist(avgX, avgY, width/2, height/2));
    previousAvgX = avgX;
    previousAvgY = avgY;
  }
}

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, v = max;

  let d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatique
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h*360, s: s*100, v: v*100 };
}

function distSq(x1, y1, z1, x2, y2, z2) {
  // Switch to HSV
  let c1 = rgbToHsv(x1, y1, z1);
  let c2 = rgbToHsv(x2, y2, z2);
  // Utiliser h pour la teinte
  let d = (c1.h - c2.h) * (c1.h - c2.h); 
  // Utiliser v pour la luminosité
  //let d = (c1.v - c2.v) * (c1.v - c2.v);
  //let d = (c1.h - c2.h) * (c1.h - c2.h) + (c1.s - c2.s) * (c1.s - c2.s) + (c1.v - c2.v) * (c1.v - c2.v);
  //let d = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
  return d;
}

function mousePressed() {
  // Enregistrer la couleur du pixel sous la souris
  video.loadPixels();
  let loc = (video.width - mouseX + mouseY * video.width) * 4;
  trackColor = color(video.pixels[loc], video.pixels[loc + 1], video.pixels[loc + 2]);
  console.log(trackColor);
  console.log(rgbToHsv(red(trackColor), green(trackColor), blue(trackColor)));
  previousAvgX = mouseX;
  previousAvgY = mouseY;
}
