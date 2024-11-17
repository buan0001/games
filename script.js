window.addEventListener("load", start);

const playerInfo = { x: 0, y: 0, speed: 20 };
const controls = {
  up: false,
  down: false,
  left: false,
  right: false,
};
const animationStuff = {
  characterDirection: 0,
  walkCycle: 0,
  walkDir: 0,
};
const playerNode = document.querySelector("#player");
const gameGrid = document.querySelector("#gameField");

function start() {
  console.log("js running");
  window.addEventListener("keydown", keyPressed);
  window.addEventListener("keyup", keyUnpressed);
//   requestAnimationFrame(tick);
const circle1 = {x: 50, y: 100, r: 30}
const circle2 = {x: 80, y: 120, r: 20}
isColliding(circle1, circle2)
}

let prevTime = 0;
function tick(time) {
  requestAnimationFrame(tick);

  const deltaTime = time - prevTime;
  prevTime = time;

  movePlayer(deltaTime);
  displayPlayer();
}

function displayPlayer() {
  // console.log(playerInfo);

  if (controls.up || controls.down || controls.left || controls.right) {
    animationStuff.walkCycle++;
    if (animationStuff.walkCycle == 10) {
      animationStuff.walkDir++;
      animationStuff.walkCycle = 0;
    }
    playerNode.style.translate = `${playerInfo.x}px ${playerInfo.y}px`;
  } else {
    animationStuff.walkDir = 0;
  }
  playerNode.style.backgroundPosition = `${animationStuff.walkDir * 100}% ${animationStuff.characterDirection * 100}%`;
}

function movePlayer(deltaTime) {
  // console.log(controls);

  const movement = playerInfo.speed / deltaTime;
  const tempMove = { x: playerInfo.x, y: playerInfo.y };
  if (controls.down) {
    animationStuff.characterDirection = 0;
    // playerInfo.y = playerInfo.y + movement;
    tempMove.y = playerInfo.y + movement;
  } else if (controls.up) {
    animationStuff.characterDirection = 3;
    // playerInfo.y = playerInfo.y - movement;
    tempMove.y = playerInfo.y -  movement;
  }
  if (controls.left) {
    animationStuff.characterDirection = 2;
    // playerInfo.x = playerInfo.x - movement;
    tempMove.x = playerInfo.x - movement;
  }
  if (controls.right) {
    animationStuff.characterDirection = 1;
    // playerInfo.x = playerInfo.x + movement;
    tempMove.x = playerInfo.x + movement;
  }


  if (canMove(playerInfo, tempMove)) {
      playerInfo.y = tempMove.y
      playerInfo.x = tempMove.x;
  }
}

function canMove(character, newPos) {
  const gridSize = gameGrid.getBoundingClientRect();
  const playerSize = playerNode.getBoundingClientRect();
  // console.log(gameGrid.getBoundingClientRect());

  

  if (gridSize.top > playerSize.top) {
    console.log("hi");
  }
  return true;

  // if (newPos.x >)
}

function isColliding(circleA, circleB) {
    // Circles know: radius, x and y
    // calculate distance between circle centers
    const distance = Math.hypot(circleA.x, circleB.x, circleA.y, circleB.y); // TODO: Make calculation (use Pythagoras)
    console.log(distance);
    
    // const distance = 1; // TODO: Make calculation (use Pythagoras)
    // calculate the combined size of both circles (the two radiusses...)
    const combinedSize = 1; // TODO: Make calculation!
    // if distance is less than combined size - we have a collision!
    return distance < combinedSize;
  }

function keyPressed(event) {
  // console.log(event.key);
  const input = event.key.toLowerCase();

  if (input == "w") {
    controls.up = true;
  } else if (input == "s") {
    controls.down = true;
  } else if (input == "a") {
    controls.left = true;
  } else if (input == "d") {
    controls.right = true;
  }
}

function keyUnpressed(event) {
  console.log(event.key);
  const input = event.key.toLowerCase();

  if (input == "w") {
    controls.up = false;
  } else if (input == "s") {
    controls.down = false;
  } else if (input == "a") {
    controls.left = false;
  } else if (input == "d") {
    controls.right = false;
  }
}
