import { gameState } from './gameState';
import './style.css';
import { tiles } from './tiles';

const board = document.querySelector('#gamegrid'); // This is where we will lay out all the tiles
const triesDisplay = document.querySelector('#tries'); // DOM element for viewing current score/tries

let randomizedTiles = [];

// Lay out all tiles on the board
function createBoard() {
  // Loop through randomizedTiles array and create a tile for each object
  randomizedTiles.forEach((tile) => {
    const singleTile = document.createElement('div');
    singleTile.classList.add('tile');
    singleTile.setAttribute('data-tile', tile.name);

    singleTile.innerHTML = `
      <div class="tile" data-tile=${tile.name} tabindex="0" aria-label="Spille-kort">
          <img src=${tile.src} alt=${tile.name}/>
      </div>      
    `;

    singleTile.addEventListener('click', flipTile);
    singleTile.addEventListener('keypress', flipTile);
    board.appendChild(singleTile);
  });
}

// Check if player has won (all tiles matched)
function checkWin() {
  const matchedTiles = document.querySelectorAll('.matched');
  if (matchedTiles.length === 16) {
    gameState.gameOver = true;

    setTimeout(() => {
      alert('Du klarte det!');
    }, 250); // Pause for a bit to ensure that the last flipped tile are shown before the alert
  }
}

// Flip a tile and check if it matches previous tile
function flipTile(e) {
  const clickedTile = e.target;
  clickedTile.classList.add('flipped');
  const flippedTiles = document.querySelectorAll('.flipped');

  if (flippedTiles.length > 2) {
    flippedTiles.forEach((tile) => {
      tile.classList.remove('flipped');
    });
    return;
  }

  if (flippedTiles.length === 2) {
    // Wait a little bit, then remove all flipped tiles
    setTimeout(() => {
      flippedTiles.forEach((tile) => {
        tile.classList.remove('flipped');
      });
    }, 500);

    const firstTile = flippedTiles[0].getAttribute('data-tile');
    const secondTile = flippedTiles[1].getAttribute('data-tile');

    gameState.tries++;
    triesDisplay.innerText = gameState.tries;

    if (firstTile === secondTile) {
      flippedTiles.forEach((tile) => {
        tile.classList.add('matched');
      });
    } else {
      setTimeout(() => {
        flippedTiles.forEach((tile) => {
          tile.classList.remove('flipped');
        });
      }, 500);
    }
  }
  checkWin(); // Check if all tiles are matched
}

// Reset the game state, randomize all tiles, create board
function newGame() {
  gameState.tries = 0;
  gameState.gameOver = false;

  board.innerHTML = ''; // Clear board
  triesDisplay.innerText = 0; // Reset tries to zero

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
