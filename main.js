import './style.css';

const board = document.querySelector('#gamegrid'); // This is where we will lay out all the tiles
const triesDisplay = document.querySelector('#tries'); // DOM element for viewing current score/tries

// Create a global object to store state
// Could be useful for storing more stuff in one place if we later
// wants to expand the game with more functionality
const gameState = {
  tries: 0,
  gameOver: false,
};

// Store all possible tiles in an array of objects
// Each object has an unique name and a href to an image
const tiles = [
  { name: 'stekepanne', src: './images/1.svg' },
  { name: 'hodetelefoner', src: './images/2.svg' },
  { name: 'gulrot', src: './images/3.svg' },
  { name: 'pokal', src: './images/4.svg' },
  { name: 'gitar', src: './images/5.svg' },
  { name: 'snømann', src: './images/6.svg' },
  { name: 'gris', src: './images/7.svg' },
  { name: 'ugle', src: './images/8.svg' },
];

let randomizedTiles = [];

// Lay out all tiles on the board
function createBoard() {
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

// Check if player has won (all tiles matched)
function checkWin() {
  const matchedTiles = document.querySelectorAll('.matched');
  if (matchedTiles.length === 16) {
    gameState.gameOver = true;
    alert('Du klarte det!');
  }
}

// Flip a tile and check if it matches previous tile
function flipTile(e) {
  const clickedTile = e.target;
  clickedTile.classList.add('flipped');
  const flippedTiles = document.querySelectorAll('.flipped');

  if (flippedTiles.length === 2) {
    // Remove flipped class before we forget this...
    setTimeout(() => {
      flippedTiles.forEach((tile) => {
        tile.classList.remove('flipped');
      });
    }, 1500);

    const firstTile = flippedTiles[0].getAttribute('data-tile');
    const secondTile = flippedTiles[1].getAttribute('data-tile');

    gameState.tries++;
    triesDisplay.innerText = gameState.tries;

    if (firstTile === secondTile && firstTile !== null && secondTile !== null) {
      flippedTiles.forEach((tile) => {
        tile.classList.add('matched');
      });
    } else {
      setTimeout(() => {
        flippedTiles.forEach((tile) => {
          tile.classList.remove('flipped');
        });
      }, 1500);
    }
  }
  checkWin(); // Check if all tiles are matched
}

// Reset the game state, randomize all tiles, create board
function newGame() {
  gameState.tries = 0;
  gameState.gameOver = false;

  board.innerHTML = ''; // Clear board

  // Randomize all tiles. I'm using concat to make two copies of each tile (no need to duplicate tiles in the tiles array)
  randomizedTiles = tiles.concat(tiles).sort((a, b) => 0.5 - Math.random());
  createBoard();
}

// ********************************
//            GAME ON!
// ********************************

// Handle reset button click
const resetButton = document.querySelector('#reset-button');
resetButton.onclick = () => {
  newGame();
};

// This one resets game state, randomizes the tiles
// and creates the board (with click event listeners on each tile)
newGame();
