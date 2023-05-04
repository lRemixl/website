const blobs = [];
var canvas;

var mouseHeld = false;
let character;
window.current_height = 270;
const bullets = [];
const enemyBullets = [];
const spaceInvaders = [];
const gameState = {
  BLOBS: 0,
  SPACE_INVADERS: 1,
};
let currentState = gameState.BLOBS;
let playerLives = 3;
let level = 1;
let enemySpeed = 1;
let enemyDirection = 1;
let enemyMoveDown = false;

class SpaceInvader {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = 30;
    this.color = color(0, 255, 0);
    this.canShoot = true;

  }

  display() {
    fill(this.color);
    rect(this.pos.x, this.pos.y, this.size, this.size);
  }
  shoot() {
    if (this.canShoot) {
      const bulletSpeed = 5;
      enemyBullets.push(new Bullet(this.pos.x + this.size / 2, this.pos.y + this.size, createVector(0, bulletSpeed)));
      this.canShoot = false;
      setTimeout(() => {
        this.canShoot = true;
      }, random(1000, 5000));
    }
 }
}
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
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 11; j++) {
      spaceInvaders.push(new SpaceInvader(j * 50 + 50, i * 50 + 50));
    }
  }
}
document.addEventListener('keydown', (event) => {
  
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
  }
  
});
function draw() {
  background(0);
  if (currentState === gameState.SPACE_INVADERS && spaceInvaders.length === 0) {
    level += 1;
  spawnSpaceInvaders(level, 11);
    }
  if (currentState === gameState.BLOBS && blobs.length === 0) {
    currentState = gameState.SPACE_INVADERS;
  }
  for (let blob of blobs) {
    blob.update();
    blob.display();
    blob.checkEdges(window.current_height);
    blob.checkCollision(blobs);
  }
  if(currentState === gameState.BLOBS){
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
  }
  else if (currentState === gameState.SPACE_INVADERS){
    for (const invader of spaceInvaders) {
      invader.display();
    }
    let moveDown = false;
    for (const invader of spaceInvaders) {
      invader.pos.x += enemySpeed * enemyDirection;
      if (invader.pos.x <= 0 || invader.pos.x + invader.size >= width) {
        moveDown = true;
      }
    }
    if (moveDown) {
      enemyDirection *= -1;
      for (const invader of spaceInvaders) {
        invader.shoot();
        invader.pos.y += invader.size / 2;
        if (invader.pos.y + invader.size >= character.pos.y) {
          // Game over if the enemies reach the player
          currentState = gameState.GAME_OVER;
        }
      }
    }
  
  }
  // Finally, replace the existing GAME_OVER state with the following
const GAME_OVER = 2;
if (currentState === gameState.GAME_OVER) {
textSize(32);
fill(255);
textAlign(CENTER, CENTER);
text("Game Over", width / 2, height / 2);
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
    if (currentState === gameState.SPACE_INVADERS) {
      for (let j = spaceInvaders.length - 1; j >= 0; j--) {
        if (bulletHitsSpaceInvader(bullets[i], spaceInvaders[j])) {
          spaceInvaders.splice(j, 1);
          bullets.splice(i, 1);
          break;
        }
      }
    }
  }
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    enemyBullets[i].update();
    enemyBullets[i].display();

    // Check for collisions between the character and the enemy bullets
    if (characterCollidesWithBullet(character, enemyBullets[i])) {
      playerLives -= 1;
      if (playerLives <= 0) {
        // Game over if the player is hit 3 times
        currentState = gameState.GAME_OVER;
      }
      enemyBullets.splice(i, 1);
    } else if (enemyBullets[i].offScreen()) {
      enemyBullets.splice(i, 1);
    }
  }
}
function characterCollidesWithBullet(character, bullet) {
  return (
    character.pos.x + character.size > bullet.pos.x - bullet.size / 2 &&
    character.pos.x < bullet.pos.x + bullet.size / 2 &&
    character.pos.y + character.size > bullet.pos.y - bullet.size / 2 &&
    character.pos.y < bullet.pos.y + bullet.size / 2
    );
    }
    // Add a new function to handle the start of a new level
function startNewLevel() {
  level += 1;
  enemySpeed = 1 + level * 0.5;
  enemyDirection = 1;
  spaceInvaders.length = 0;
  for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 11; j++) {
  spaceInvaders.push(new SpaceInvader(j * 50 + 50, i * 50 + 50));
  }
  }
  }
  function spawnSpaceInvaders(rows, cols) {
     let  spaceInvaders = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        spaceInvaders.push(new SpaceInvader(j * 50 + 50, i * 50 + 50));
      }
    }
  }
  


  function bulletHitsBlob(bullet, blob) {
    for (let i = spaceInvaders.length - 1; i >= 0; i--) {
    if (
    bullet.pos.x + bullet.size / 2 > spaceInvaders[i].pos.x &&
    bullet.pos.x - bullet.size / 2 < spaceInvaders[i].pos.x + spaceInvaders[i].size &&
    bullet.pos.y + bullet.size / 2 > spaceInvaders[i].pos.y &&
    bullet.pos.y - bullet.size / 2 < spaceInvaders[i].pos.y + spaceInvaders[i].size
    ) {
    spaceInvaders.splice(i, 1);
    return true;
    }
    }
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
function bulletHitsSpaceInvader(bullet, spaceInvader) {
  if (bullet && spaceInvader) {
    let d = dist(bullet.pos.x, bullet.pos.y, spaceInvader.pos.x, spaceInvader.pos.y);
    if (d < bullet.size / 2 + spaceInvader.size / 2) {
      return true;
    }
  }
  return false;
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
          const maxVelocity = 10;
      if (this.vel.mag() > maxVelocity) {
        this.vel.setMag(maxVelocity);
      }
      if (other.vel.mag() > maxVelocity) {
        other.vel.setMag(maxVelocity);
      }
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
