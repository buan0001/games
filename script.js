window.addEventListener("load", start);

// ========================= GLOBALS ===============================
const controls = {
  up: false,
  down: false,
  left: false,
  right: false,
};

const boardInfo = { left: 0, right: 320, top: 0, bottom: 320 };

const playerInfo = {
  x: 0,
  y: 0,
  width: 32,
  height: 40,
  speed: 40,
  DOMNode: document.querySelector("#player"),
  animationStuff: {
    characterDirection: 0,
    walkTick: 0,
    walkCycle: 0,
    animationAvailable: true,
  },
};

const enemy = {
  x: 150,
  y: 150,
  width: 32,
  height: 40,
  speed: 25,

  DOMNode: document.querySelector("#enemy"),
  animationStuff: {
    characterDirection: 2,
    walkTick: 0,
    walkCycle: 0,
  },
};

// ========================= END OF GLOBALS ===============================

function start() {
  setEventListeners();
  requestAnimationFrame(tick);
}

function setEventListeners() {
  window.addEventListener("keydown", keyPressed);
  window.addEventListener("keyup", keyPressed);
  playerInfo.DOMNode.addEventListener("animationend", e => {
    if (e.animationName == "damage-animation") {
      playerInfo.DOMNode.classList.remove("damage");
      setTimeout(() => {
        playerInfo.animationStuff.animationAvailable = true;
      }, 50);
    }
  });
}

let prevTime = 0;
function tick(time) {
  requestAnimationFrame(tick);

  const deltaTime = time - prevTime;
  prevTime = time;

  movePlayer(deltaTime);
  displayPlayer();
  moveAndDisplayEnemy(deltaTime);

  if (charactersColliding(playerInfo, enemy)) {
    if (playerInfo.animationStuff.animationAvailable) {
      playerInfo.animationStuff.animationAvailable = false;
      playerInfo.DOMNode.classList.add("damage");
    }
  }
}

function displayPlayer() {
  // Only progress the walking if there's input to move to
  if (controls.up || controls.down || controls.left || controls.right) {
    playerInfo.animationStuff.walkTick++;
    if (playerInfo.animationStuff.walkTick == 10) {
      playerInfo.animationStuff.walkCycle++;
      playerInfo.animationStuff.walkTick = 0;
    }
    playerInfo.DOMNode.style.translate = `${playerInfo.x}px ${playerInfo.y}px`;
  } else {
    playerInfo.animationStuff.walkCycle = 0;
  }
  playerInfo.DOMNode.style.backgroundPosition = `${playerInfo.animationStuff.walkCycle * 100}% ${
    playerInfo.animationStuff.characterDirection * 100
  }%`;
}

function movePlayer(deltaTime) {
  // console.log(controls);

  const movement = playerInfo.speed / deltaTime;
  const tempMove = { x: playerInfo.x, y: playerInfo.y };
  if (controls.down) {
    playerInfo.animationStuff.characterDirection = 0;
    // playerInfo.y = playerInfo.y + movement;
    tempMove.y = playerInfo.y + movement;
  } else if (controls.up) {
    playerInfo.animationStuff.characterDirection = 3;
    // playerInfo.y = playerInfo.y - movement;
    tempMove.y = playerInfo.y - movement;
  }
  if (controls.left) {
    playerInfo.animationStuff.characterDirection = 2;
    // playerInfo.x = playerInfo.x - movement;
    tempMove.x = playerInfo.x - movement;
  }
  if (controls.right) {
    playerInfo.animationStuff.characterDirection = 1;
    // playerInfo.x = playerInfo.x + movement;
    tempMove.x = playerInfo.x + movement;
  }

  if (canMove(playerInfo, tempMove)) {
    playerInfo.y = tempMove.y;
    playerInfo.x = tempMove.x;
  }
}

function moveAndDisplayEnemy(deltaTime) {
  let distance = enemy.speed / deltaTime;
  // Change directions at certain spots
  if (enemy.x > boardInfo.right - 30) {
    enemy.animationStuff.characterDirection = 2;
  } else if (enemy.x < boardInfo.left + 30) {
    enemy.animationStuff.characterDirection = 1;
  }
  // Calm down the walking cycle
  // (6 times every second instead of 60
  // (or more, depending on refresh rate of the users monitor))
  enemy.animationStuff.walkTick++;
  if (enemy.animationStuff.walkTick > 10) {
    enemy.animationStuff.walkCycle++;
    enemy.animationStuff.walkTick = 0;
  }
  distance *= enemy.animationStuff.characterDirection == 2 ? -1 : 1;
  enemy.x += distance;
  // Walking animation
  enemy.DOMNode.style.backgroundPosition = `${enemy.animationStuff.walkCycle * 100}% ${enemy.animationStuff.characterDirection * 100}%`;
  // Actually changing the x and y positions
  enemy.DOMNode.style.translate = `${enemy.x}px ${enemy.y}px`;
}

function canMove(character, newPos) {
  // Checking if the character's new position is colliding with terrain (by exceeding the borders)
  // Possible addition: Make character attributes able to determine what is a legit coordinate
  return (
    boardInfo.top > newPos.y ||
    boardInfo.bottom < playerInfo.height + newPos.y ||
    boardInfo.left > newPos.x ||
    boardInfo.right < playerInfo.width + newPos.x
  );
}

function charactersColliding(player, enemy) {
  const playerRightToTheRightOfEnemyLeft = player.x + player.width >= enemy.x;
  const playerLeftToTheLeftOfEnemyRight = player.x <= enemy.x + enemy.width;
  const playerTopAboveEnemyBot = player.y < enemy.y + enemy.height;
  const playerBotBelowEnemyTop = player.y + player.height > enemy.y;
  return playerRightToTheRightOfEnemyLeft && playerLeftToTheLeftOfEnemyRight && playerTopAboveEnemyBot && playerBotBelowEnemyTop;
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
