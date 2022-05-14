import './style.css';

const board = document.querySelector('#gamegrid'); // This is where we will lay out all the tiles
const triesDisplay = document.querySelector('#tries'); // DOM element for viewing current score/tries

// Handle reset button click
const resetButton = document.querySelector('#reset-button');
resetButton.onclick = () => {
  newGame();
};

// Store all possible tiles in an array of objects
// Each object has an unique name and a href to an image
const TILES = [
  { name: 'stekepanne', src: './images/1.svg' },
  { name: 'hodetelefoner', src: './images/2.svg' },
  { name: 'gulrot', src: './images/3.svg' },
  { name: 'pokal', src: './images/4.svg' },
  { name: 'gitar', src: './images/5.svg' },
  { name: 'snømann', src: './images/6.svg' },
  { name: 'gris', src: './images/7.svg' },
  { name: 'ugle', src: './images/8.svg' },
];

// Create a global object to store state
const gameState = {
  tiles: [],
  firstTileID: null,
  firstTileDOMElement: null,
  isBlocked: false,
  tilesFlipped: 0,
  tries: 0,
  gameOver: false,
};

function shuffleTiles(tiles) {
  // We use concat to get two of each tile, then maps over them to create a new array of tile objects with the added property isMatched
  let tilesToShuffle = tiles.concat(tiles).map((tile) => {
    return { ...tile, isMatched: false };
  });

  // Then we shuffle the array
  tilesToShuffle.sort(() => Math.random() - 0.5);

  return tilesToShuffle;
}

function drawEmptyBoard() {
  // Create a new empty board
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.setAttribute('data-tile', `${i}`);
    tile.addEventListener('click', flipTile);
    board.appendChild(tile);
  }
}

function checkForMatch(firstTile, secondTile) {
  // Check if the two tiles match (return true or false)
  return gameState.tiles[firstTile].name === gameState.tiles[secondTile].name;
}

function flipTile(e) {
  const clickedDOMElement = e.currentTarget;
  const clickedTileID = Number(clickedDOMElement.getAttribute('data-tile'));

  // Nice little shake effect when clicking an "illegal" tile
  const shake = () => {
    clickedDOMElement.classList.add('shake');
    setTimeout(() => {
      clickedDOMElement.classList.remove('shake');
    }, 500);
  };

  if (
    gameState.tiles[clickedTileID].isMatched ||
    clickedDOMElement.childElementCount > 0 //
  ) {
    shake();
    return;
  }

  // Return early if clicked tiles have not flipped back yet
  if (gameState.isBlocked) {
    shake();
    return;
  }

  // Check if first or second tile have been clicked.
  // gameState.firstTileID is null if no tile has been clicked yet
  if (gameState.firstTileID === null) {
    gameState.firstTileID = clickedTileID;
    gameState.firstTileDOMElement = clickedDOMElement;
  } else {
    gameState.tries++;
    triesDisplay.innerText = gameState.tries;
  }

  // Increase tiles flipped counter if less than two tiles have been flipped
  if (gameState.tilesFlipped < 2) {
    gameState.tilesFlipped++;

    clickedDOMElement.innerHTML = `
      <img src=${gameState.tiles[clickedTileID].src} alt=${gameState.tiles[clickedTileID].name} />
    `;
  }

  if (gameState.tilesFlipped === 2) {
    if (checkForMatch(gameState.firstTileID, clickedTileID) === true) {
      gameState.tiles[gameState.firstTileID].isMatched = true;
      gameState.tiles[clickedTileID].isMatched = true;
    } else {
      gameState.isBlocked = true;

      // No match, flip back the two tiles after a short delay
      setTimeout(() => {
        gameState.firstTileDOMElement.innerHTML = '';
        clickedDOMElement.innerHTML = '';
        gameState.isBlocked = false;
      }, 500);
    }

    gameState.tilesFlipped = 0;
    gameState.firstTileID = null;

    checkWin();
  }
}

// Check if player has won (all tiles matched)
function checkWin() {
  if (gameState.tiles.every((tile) => tile.isMatched)) {
    gameState.gameOver = true;
    setTimeout(() => {
      alert(`Du klarte det på ${gameState.tries} forsøk!`);
    }, 500);
  }
}

// Reset the game state, randomize all tiles, create board
function newGame() {
  gameState.tries = 0;
  gameState.gameOver = false;

  // Update gamestate with a new randomized tile set
  gameState.tiles = shuffleTiles(TILES);

  // Clear the board and scores display in the DOM
  board.innerHTML = ''; // Clear board
  triesDisplay.innerText = 0; // Reset tries to zero

  drawEmptyBoard();
}

// ********************************
//            GAME ON!
// ********************************

// This one resets game state, randomizes the tiles
// and creates the board (with click event listeners on each tile)

newGame();
