export default function createBoard() {
  // Loop through randomizedTiles array and create a tile for each object
  randomizedTiles.forEach((tile) => {
    const singleTile = document.createElement('div');
    singleTile.classList.add('tile');
    singleTile.setAttribute('data-tile', tile.name);

    singleTile.innerHTML = `
      <div class="tile" data-tile=${tile.name}>
          <img src=${tile.src} alt=${tile.name} />
      </div>      
    `;

    singleTile.addEventListener('click', flipTile);
    board.appendChild(singleTile);
  });
}
