window.addEventListener("load", start);

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

const boardInfo = { left: 0, right: 320, top: 0, bottom: 320 };

const playerInfo = {
  x: 0,
  y: 0,
  width: 32,
  height: 40,
  speed: 20,
  DOMNode: document.querySelector("#player"),
};

const ghostEnemy = {
  x: 150,
  y: 150,
  width: 48,
  height: 48,
  speed: 5,
  direction: -1,
  DOMNode: document.querySelector("#enemy"),
};

const playerNode = document.querySelector("#player");
const gameGrid = document.querySelector("#gameField");

function start() {
  console.log("js running");
  window.addEventListener("keydown", keyPressed);
  window.addEventListener("keyup", keyPressed);
  requestAnimationFrame(tick);
  // const circle1 = { x: 50, y: 100, r: 30 };
  // const circle2 = { x: 80, y: 120, r: 20 };
  // const startNodeSize = playerNode.getBoundingClientRect();
  // console.log(startNodeSize);

  // (playerInfo.x = startNodeSize.x),
  //   (playerInfo.y = startNodeSize.y),
  //   (playerInfo.leftRightDiff = startNodeSize.right - startNodeSize.left),
  //   (playerInfo.topBottomDiff = startNodeSize.bottom - startNodeSize.top),
  //   canMove(playerInfo, { x: 200, y: 100 });
}

let prevTime = 0;
function tick(time) {
  requestAnimationFrame(tick);

  const deltaTime = time - prevTime;
  prevTime = time;

  movePlayer(deltaTime);
  moveEnemy(deltaTime);
  displayPlayer();
  checkIfCharactersCollide(playerInfo, ghostEnemy);
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
    tempMove.y = playerInfo.y - movement;
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
    playerInfo.y = tempMove.y;
    playerInfo.x = tempMove.x;
  }
}

function moveEnemy(deltaTime) {
  const distance = ghostEnemy.speed / deltaTime;
  if (ghostEnemy.x > 200) {
    ghostEnemy.direction = -1;
    ghostEnemy.DOMNode.style.backgroundPosition = `0%`;
  } else if (ghostEnemy.x < 100) {
    ghostEnemy.direction = 1;
    ghostEnemy.DOMNode.style.backgroundPosition = `100%`;
  }
  ghostEnemy.x += distance * ghostEnemy.direction;
  // console.log(ghostEnemy.y);
  
  ghostEnemy.DOMNode.style.translate = `${ghostEnemy.x}px ${ghostEnemy.y}px`;
}

function canMove(character, newPos) {
  // Simple collision detection for two rectangles
  if (boardInfo.top > newPos.y || boardInfo.bottom < playerInfo.height + newPos.y || boardInfo.left > newPos.x || boardInfo.right < playerInfo.width + newPos.x) {
    return false;
  }
  return true;
}

function checkIfCharactersCollide(player, enemy) {
  //   const playerInfo = {
  //   x: 0,
  //   y: 0,
  //   width: 32,
  //   height: 40,
  //   speed: 20,
  //   DOMNode: document.querySelector("#player"),
  // };

  // const ghostEnemy = {
  //   x: 150,
  //   y: 150,
  //   width: 48,
  //   height: 48,
  //   speed: 5,
  //   direction: -1,
  //   DOMNode: document.querySelector("#enemy"),
  // };
  // console.log(player, enemy);
  const playerRightToTheRightOfEnemyLeft = player.x + player.width >= enemy.x;
  const playerLeftToTheLeftOfEnemyRight = player.x <= enemy.x + enemy.width;
  const playerTopAboveEnemyBot = player.y < enemy.y + enemy.height;
  const playerBotBelowEnemyTop = player.y + player.height > enemy.y;
  // console.log(playerTopAboveEnemyBot, playerBotBelowEnemyTop);
  // Start: 69, 0, 150
  console.log(player.DOMNode.getBoundingClientRect().y, player.y, ghostEnemy.y, ghostEnemy.DOMNode.getBoundingClientRect().y);

  // console.log("player to left",playerRightToTheRightOfEnemyLeft, playerLeftToTheLeftOfEnemyRight, playerTopAboveEnemyBot, playerBotBelowEnemyTop);

  if (playerRightToTheRightOfEnemyLeft && playerLeftToTheLeftOfEnemyRight && playerTopAboveEnemyBot && playerBotBelowEnemyTop) {
    // if (player.x + player.width >= enemy.x && player.x <= enemy.x + enemy.width && player.y + player.height >= enemy.y && player.y <= enemy.y + enemy.height) {
    // console.log("Colliding!");
    player.DOMNode.classList.add("damage");
    return true;
  }
  // console.log("not colliding");
player.DOMNode.classList.remove("damage");
  return false;
}

const validInput = ["w", "a", "s", "d"];
function keyPressed(event) {
  const input = event.key.toLowerCase();
  let boolValue = event.type == "keydown" ? true : false;

  if (input == "w") {
    controls.up = boolValue;
  } else if (input == "s") {
    controls.down = boolValue;
  } else if (input == "a") {
    controls.left = boolValue;
  } else if (input == "d") {
    controls.right = boolValue;
  }
}
