// Daniel Shiffman
// http://codingtra.in

// Simple Particle System
// https://youtu.be/UcdigVaIYAk

const particles = [];
let wind = 0.05; // small wind to the right

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(0);
  for (let i = 0; i < 5; i++) {
    let p = new Particle();
    particles.push(p);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      // remove this particle
      particles.splice(i, 1);
    }
  }
}

class Particle {

  constructor() {
    // emitter follows mouse; default to center-bottom if mouse not on canvas yet
    this.x = (mouseX >= 0 && mouseX <= width) ? mouseX : width / 2;
    this.y = (mouseY >= 0 && mouseY <= height) ? mouseY : height - 20;
    this.vx = random(-1, 1);
    this.vy = random(-5, -1);
    this.alpha = 255;
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    // apply wind to the right
    this.vx += wind * random(0.8, 1.2);
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  show() {
    noStroke();
    //stroke(255);
    fill(255, this.alpha);
    ellipse(this.x, this.y, 16);
  }

}