const blobs = [];
var canvas;
var mouseHeld = false;
let character;
window.current_height = 270;
const bullets = [];

class Bullet {
  constructor(x, y, vel) {
    this.pos = createVector(x, y);
    this.vel = vel;
    this.size = 5;
    this.color = color(255, 0, 0);
  }

  update() {
    this.pos.add(this.vel);
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  offScreen() {
    return (this.pos.y < 0 ||this.pos.y > height ||  this.pos.x < 0 || this.pos.x > width);
  }
}

class Character {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.size = size;
  }

  display() {
    fill(255);
    rect(this.pos.x, this.pos.y, this.size, this.size);
  }
}

function setup() {
  canvas= createCanvas(windowWidth , windowHeight);

  canvas.id('blob-canvas');
  for (let i = 0; i < 100; i++) {
    blobs.push(new Blob(random(width), random(height), random(20, 50)));
  }
  character = new Character(width / 2, height / 2, 20);
}
document.addEventListener('keydown', (event) => {
  
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
  }
  
});
function draw() {
  background(0);

  for (let blob of blobs) {
    blob.update();
    blob.display();
    blob.checkEdges(window.current_height);
    blob.checkCollision(blobs);
  }
  if (mouseHeld) {
    for (let i = blobs.length - 1; i >= 0; i--) {
      if (blobs[i].isClicked(mouseX, mouseY)) {
        let newBlobs = blobs[i].split();
        blobs.splice(i, 1);
        blobs.push(...newBlobs);
        break;
      }
    }
  }
  character.display();

  const speed = 5;
  if (keyIsDown(LEFT_ARROW)) {
    character.pos.x -= speed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    character.pos.x += speed;
  }
  if (keyIsDown(UP_ARROW)) {
    character.pos.y -= speed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    character.pos.y += speed;
  }
  if (keyIsDown(32)){
    const bulletSpeed = 10;


    bullets.push(new Bullet(character.pos.x + character.size / 2, character.pos.y, createVector(0, -bulletSpeed))); // Up
    bullets.push(new Bullet(character.pos.x + character.size / 2, character.pos.y, createVector(0, bulletSpeed))); // Down
    bullets.push(new Bullet(character.pos.x + character.size / 2, character.pos.y, createVector(-bulletSpeed, 0))); // Left
    bullets.push(new Bullet(character.pos.x + character.size / 2, character.pos.y, createVector(bulletSpeed, 0))); // Right
    
    
    
  }

  // Check for collisions between the character and the blobs
  for (let i = blobs.length - 1; i >= 0; i--) {
    if (characterCollidesWithBlob(character, blobs[i])) {
      let newBlobs = blobs[i].split();
      blobs.splice(i, 1);
      // Only add new blobs if there are less than 250 blobs
      if (blobs.length + newBlobs.length <= 250) {
        blobs.push(...newBlobs);
      }
    }
  }
  for (let i = blobs.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (bulletHitsBlob(bullets[j], blobs[i])) {
        blobs.splice(i, 1);
        break;
      }
    }
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();

    // Remove bullets that are offscreen
    if (bullets[i].offScreen()) {
      bullets.splice(i, 1);
    }
  }

}
function bulletHitsBlob(bullet, blob) {
  return dist(bullet.pos.x, bullet.pos.y, blob.pos.x, blob.pos.y) <= (blob.size / 2) + (bullet.size / 2);
}
function characterCollidesWithBlob(character, blob) {
  return (
    character.pos.x + character.size > blob.pos.x - blob.size / 2 &&
    character.pos.x < blob.pos.x + blob.size / 2 &&
    character.pos.y + character.size > blob.pos.y - blob.size / 2 &&
    character.pos.y < blob.pos.y + blob.size / 2
  );
}
function mousePressed() {
  mouseHeld = true;
}

function mouseReleased() {
  mouseHeld = false;
}
class Blob {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.size = random(20, 40);
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.pos.add(this.vel);
    if (this.vel.mag() > 10) {
      this.vel.setMag(10);
    }
 
  }
  isClicked(x, y) {
    return dist(x, y, this.pos.x, this.pos.y) <= this.size / 2;
  }

  split() {
    if (this.size >= 20) {
      let newSize = this.size / sqrt(2);
      let newBlobs = [
        new Blob(this.pos.x, this.pos.y, newSize),
        new Blob(this.pos.x, this.pos.y, newSize),
      ];
      newBlobs.forEach((blob) => {
        blob.vel.add(p5.Vector.random2D().mult(2));
        blob.color = this.color;
      });
      return newBlobs;
    }
    return [];
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  checkEdges(current_height) {
    if (this.pos.x > width - this.size / 2 || this.pos.x < this.size / 2) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, this.size / 2, width - this.size / 2);
    }
    if (this.pos.y > height - this.size / 2  || this.pos.y  < (this.size / 2) + current_height  ) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, this.size / 2 + current_height , height - this.size / 2);
    }
  }


  checkCollision(others) {
    for (let other of others) {
      if (other !== this) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        let minDist = (this.size + other.size) / 2;
        if (d < minDist) {
          let angle = atan2(this.pos.y - other.pos.y, this.pos.x - other.pos.x);

          // Calculate the masses of the two colliding blobs
          let m1 = this.size * this.size;
          let m2 = other.size * other.size;

          // Calculate the initial velocities of the two blobs
          let v1 = this.vel.copy();
          let v2 = other.vel.copy();

          // Calculate the components of the velocities in the direction of collision
          let v1p = v1.dot(p5.Vector.sub(this.pos, other.pos).normalize());
          let v2p = v2.dot(p5.Vector.sub(other.pos, this.pos).normalize());

          // Calculate the new velocities of the two blobs after the collision
          const epsilon = 0.0001; // Small constant to avoid division by zero or very small numbers

let v1pNew = (m1 * v1p + m2 * (2 * v2p - v1p)) / (m1 + m2 + epsilon);
let v2pNew = (m2 * v2p + m1 * (2 * v1p - v2p)) / (m1 + m2 + epsilon);



          // Calculate the new total velocities of the two blobs
          let v1New = p5.Vector.add(v1, p5.Vector.mult(p5.Vector.sub(other.pos, this.pos).normalize(), v1pNew - v1p));
          let v2New = p5.Vector.add(v2, p5.Vector.mult(p5.Vector.sub(this.pos, other.pos).normalize(), v2pNew - v2p));

          // Set the velocities of the two blobs to their new velocities
          
          this.vel = v1New;
          other.vel = v2New;

          // Move the blobs apart along the collision normal
          let overlap = (minDist - d) / 2;
          let moveVec = p5.Vector.sub(this.pos, other.pos).normalize().mult(overlap);
          this.pos.add(moveVec);
          other.pos.sub(moveVec);
        }
      }
    }
  }

  
  

}
