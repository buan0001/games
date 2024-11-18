const tileNodes = [];
export function createTiles(height, width, tileSize = 32) {
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
  console.log(tileNodes);
}

export function displayTiles(model, width) {
  for (let i = 0; i < tileNodes.length; i++) {
    const row = Math.floor(i / width);
    const col = i % width;
    const tile = tileNodes[i];

    console.log(row, col);
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
