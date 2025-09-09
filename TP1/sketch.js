let video;
let step = 5; // 1 pixel sur 10

function setup() {
  createCanvas(640, 480);
  
  // Créer la capture vidéo
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide(); // Cacher l'élément vidéo HTML
}

function draw() {
  background(255);
  
  // Charger les pixels de la vidéo
  video.loadPixels();
  
  // Parcourir les pixels par pas de 10
  for (let x = 0; x < video.width; x += step) {
    for (let y = 0; y < video.height; y += step) {
      // Calculer l'index du pixel dans le tableau pixels
      let index = (x + y * video.width) * 4;
      
      // Récupérer les valeurs RGB du pixel
      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      
      // Calculer la luminosité (moyenne pondérée des composantes RGB)
      // La formule standard pour la luminosité perçue est : 0.299*R + 0.587*G + 0.114*B
      let brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Normaliser la luminosité entre 0 et 1
      let normalizedBrightness = brightness / 255;
      
      
      // Définir la couleur du cercle
      fill(r, g, b);
      noStroke();
      
      // Dessiner le cercle
      circle(x, y, 5);
    }
  }
}
