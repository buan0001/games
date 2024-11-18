window.addEventListener("load", start);

// ========================= GLOBALS ===============================
const controls = {
  up: false,
  down: false,
  left: false,
  right: false,
};

const player = {
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
  // width: 64,
  // height: 80,
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

const tiles = [
  [6, 1, 8, 6, 0, 3, 3, 3, 3, 8],
  [0, 1, 1, 1, 1, 3, 7, 7, 3, 6],
  [8, 0, 6, 0, 1, 3, 3, 4, 3, 0],
  [2, 2, 2, 0, 1, 1, 1, 1, 1, 1],
  [0, 6, 2, 8, 1, 0, 6, 0, 9, 1],
  [2, 2, 2, 2, 5, 2, 2, 2, 1, 1],
  [5, 5, 5, 5, 5, 2, 8, 0, 1, 8],
  [2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
  [6, 2, 2, 6, 0, 8, 0, 2, 0, 1],
  [0, 2, 0, 0, 6, 0, 6, 2, 0, 1],
];

const GRID_HEIGHT = tiles.length;
const GRID_WIDTH = tiles[0].length;
const TILE_SIZE = 64;

const boardInfo = { left: 0, right: GRID_WIDTH * TILE_SIZE, top: 0, bottom: GRID_HEIGHT * TILE_SIZE };

// ========================= END OF GLOBALS ===============================

function start() {
  setEventListeners();
  createTiles(GRID_HEIGHT, GRID_WIDTH, TILE_SIZE);
  displayTiles(tiles, GRID_WIDTH);
  setSizes();

  requestAnimationFrame(tick);
}

function setSizes() {
  enemy.DOMNode.style.width = enemy.width + "px";
  enemy.DOMNode.style.height = enemy.height + "px";

  player.DOMNode.style.width = player.width + "px";
  player.DOMNode.style.backgroundColor = "transparent";
  player.DOMNode.style.height = player.height + "px";
  const visualBoard = document.querySelector("#background").getBoundingClientRect();

  console.log(GRID_HEIGHT, GRID_WIDTH);
  
  boardInfo.left = visualBoard.left;
  boardInfo.right = visualBoard.right;
  boardInfo.top = visualBoard.top;
  boardInfo.bottom = visualBoard.bottom;
}

function setEventListeners() {
  window.addEventListener("keydown", keyPressed);
  window.addEventListener("keyup", keyPressed);
  player.DOMNode.addEventListener("animationend", e => {
    if (e.animationName == "damage-animation") {
      player.DOMNode.classList.remove("damage");
      setTimeout(() => {
        player.animationStuff.animationAvailable = true;
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

  if (charactersColliding(player, enemy)) {
    if (player.animationStuff.animationAvailable) {
      player.animationStuff.animationAvailable = false;
      player.DOMNode.classList.add("damage");
    }
  }
}

// ===================== CONTROLLER =======================


// ===================== END OF CONTROLLER =======================

// ===================== MODEL =======================

// ===================== END OF MODEL =======================

// ===================== VIEW =======================

// ===================== END OF VIEW =======================
function displayPlayer() {
  // Only progress the walking if there's input to move to
  if (controls.up || controls.down || controls.left || controls.right) {
    player.animationStuff.walkTick++;
    if (player.animationStuff.walkTick == 10) {
      player.animationStuff.walkCycle++;
      player.animationStuff.walkTick = 0;
    }
    player.DOMNode.style.translate = `${player.x}px ${player.y}px`;
  } else {
    player.animationStuff.walkCycle = 0;
  }
  player.DOMNode.style.backgroundPosition = `${player.animationStuff.walkCycle * 100}% ${player.animationStuff.characterDirection * 100}%`;
}

function movePlayer(deltaTime) {
  // console.log(controls);

  const movement = player.speed / deltaTime;
  const tempMove = { x: player.x, y: player.y };
  if (controls.down) {
    player.animationStuff.characterDirection = 0;
    // playerInfo.y = playerInfo.y + movement;
    tempMove.y = player.y + movement;
  } else if (controls.up) {
    player.animationStuff.characterDirection = 3;
    // playerInfo.y = playerInfo.y - movement;
    tempMove.y = player.y - movement;
  }
  if (controls.left) {
    player.animationStuff.characterDirection = 2;
    // playerInfo.x = playerInfo.x - movement;
    tempMove.x = player.x - movement;
  }
  if (controls.right) {
    player.animationStuff.characterDirection = 1;
    // playerInfo.x = playerInfo.x + movement;
    tempMove.x = player.x + movement;
  }

  if (canMove(player, tempMove)) {
    player.y = tempMove.y;
    player.x = tempMove.x;
  } else {
    console.log("cant move");
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
  return !(
    boardInfo.top > newPos.y ||
    boardInfo.bottom < player.height + newPos.y ||
    boardInfo.left > newPos.x ||
    boardInfo.right < player.width + newPos.x
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

function getTileAtCoord(coordinate) {
  if (isValidCoord(coordinate)) {
    return tiles[coordinate.row][coordinate.col];
  }
}

function getTileAtPos(position) {
  return getTileAtCoord(coordFromPos(position));
}

function coordFromPos(position) {
  return { row: Math.floor(position.y / TILE_SIZE), col: Math.floor(position.x / TILE_SIZE) };
}
function posFromCoord(coordinate) {
  return { x: coordinate.col * TILE_SIZE, y: coordinate.row * TILE_SIZE };
}

function isValidCoord(coordinate) {
  return coordinate.row >= 0 && coordinate.row < GRID_HEIGHT && coordinate.col >= 0 && coordinate.col < GRID_WIDTH;
}

// Not needed for now since validation happens through coord
function isValidPos(position) {}

const tileNodes = [];
function createTiles(height, width, tileSize = 32) {
  const field = document.querySelector("#gamefield");
  // field.
  const parent = document.querySelector("#background");
  parent.style.setProperty(`--GRID-WIDTH`, width);
  for (let i = 0; i < height * width; i++) {
    const node = document.createElement("div");
    node.classList.add("tile");
    // node.style.backgroundImage = "url(./assets/simple-assets/images/tiles/cliff.png)";
    node.style.setProperty(`--TILE-SIZE`, tileSize);
    parent.appendChild(node);
    tileNodes.push(node);
  }
}

function displayTiles(model, width) {
  for (let i = 0; i < tileNodes.length; i++) {
    const row = Math.floor(i / width);
    const col = i % width;
    const tile = tileNodes[i];
    const tileValue = model[row][col];

    switch (tileValue) {
      case 0:
        tile.classList.add("grass");
        break;
      case 1:
        tile.classList.add("path");
        break;
      case 2:
        tile.classList.add("water");
        break;
      case 3:
        tile.classList.add("wall");
        break;
      case 4:
        tile.classList.add("door");
        break;
      case 5:
        tile.classList.add("planks");
        break;
      case 6:
        tile.classList.add("flowers");
        break;
      case 7:
        tile.classList.add("wood");
        break;
      case 8:
        tile.classList.add("tree");
        break;
      case 9:
        tile.classList.add("well");
        break;
    }
  }
}
