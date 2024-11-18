import { createTiles, displayTiles } from "./view.js";

window.addEventListener("load", start);

function start() {
  createTiles(GRID_HEIGHT, GRID_WIDTH, TILE_SIZE);

  displayTiles(tiles, GRID_WIDTH);
}

const tiles = [
  [6, 1, 8, 6, 0, 3, 3, 3, 3, 8],
  [0, 1, 1, 1, 1, 3, 7, 7, 3, 6],
  [8, 0, 6, 0, 1, 3, 3, 4, 3, 0],
  [2, 2, 2, 0, 1, 1, 1, 1, 1, 1],
  [0, 6, 2, 8, 1, 0, 6, 0, 9, 1],
  [2, 2, 2, 2, 5, 2, 2, 2, 1, 1],
  [5, 5, 5, 5, 5, 2, 8, 0, 1, 8],
  [2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [6, 2, 2, 6, 0, 8, 0, 2, 1, 6],
];

const GRID_HEIGHT = tiles.length;
const GRID_WIDTH = tiles[0].length;
const TILE_SIZE = 64;

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
