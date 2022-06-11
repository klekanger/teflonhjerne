import { registerSW } from 'virtual:pwa-register';
import { Tile } from '../types';
import { GAMESOUNDS } from './lib/gamesounds';
import { gameState } from './lib/gameState';
import { playSound } from './lib/playSound';
import { TILES } from './lib/tiles';
import modal from './modal';
import './style.css';

// Register serviceworker using vitePWA plugin to make app installable
if ('serviceWorker' in navigator) {
  registerSW();
}

// Wait until the page has loaded before running the rest of the code
window.onload = () => {
  const board = <HTMLDivElement>document.querySelector('#gamegrid'); // This is where we will lay out all the tiles
  const triesDisplay = <HTMLDivElement>document.querySelector('#tries'); // DOM element for viewing current score/tries

  const audioToggle = <HTMLImageElement>document.querySelector('#audio-toggle');
  const resetButton = <HTMLButtonElement>(
    document.querySelector('#reset-button')
  );

  // Add onClick listeners to buttons
  function addButtonListeners() {
    resetButton.onclick = () => {
      newGame();
    };

    audioToggle.onclick = () => {
      gameState.muted = !gameState.muted;
      audioToggle.src = gameState.muted
        ? './icons/volume-mute-fill.svg'
        : './icons/volume-up-fill.svg';
    };
  }

  // Listeners for cursor keys
  function addKeyListeners() {
    document.addEventListener('keydown', (e) => {
      if (gameState.modalIsOpen) {
        return; // Prevents cursor keys from working while modal is open
      }

      if (e.key === 'ArrowRight') {
        gameState.selectedTile < 15 ? gameState.selectedTile++ : null;
      } else if (e.key === 'ArrowLeft') {
        gameState.selectedTile > 0 ? gameState.selectedTile-- : null;
      } else if (e.key === 'ArrowUp') {
        gameState.selectedTile > 3 ? (gameState.selectedTile -= 4) : null;
      } else if (e.key === 'ArrowDown') {
        gameState.selectedTile < 12 ? (gameState.selectedTile += 4) : null;
      }

      const selectedTile = document.querySelector(
        `[data-tile="${gameState.selectedTile}"]`
      ) as HTMLElement;
      if (selectedTile) {
        selectedTile.focus();
      }

      if (e.key === ' ' || e.key === 'Enter') {
        flipTile(selectedTile);
      }
    });
  }

  function shuffleTiles(tiles: Tile[]) {
    if (tiles.length < 8) {
      throw new Error('Not enough tiles to shuffle');
    }

    // Make a set of 8 random tiles from the larger array of tiles. Set makes sure we don't get duplicates
    const randomSetOfTiles = new Set<Tile>();
    while (randomSetOfTiles.size < 8) {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      randomSetOfTiles.add(tiles[randomIndex]);
    }

    // Convert the set to an array
    const randomTiles = Array.from(randomSetOfTiles);

    // We use concat to get two of each tile, then maps over them to create a new array of tile objects with the added property isMatched
    let tilesToShuffle = randomTiles.concat(randomTiles).map((tile) => {
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
      tile.setAttribute('tabindex', '0');
      tile.addEventListener('click', flipTile);
      board.appendChild(tile);
    }
  }

  function checkForMatch(firstTile: number, secondTile: number): boolean {
    // Check if the two tiles match (return true or false)
    return gameState.tiles[firstTile].name === gameState.tiles[secondTile].name;
  }

  // Check if player has won (all tiles matched)
  function checkWin() {
    if (gameState.tiles.every((tile) => tile.isMatched)) {
      gameState.gameStatus = 'won';
      playSound({ audiofile: GAMESOUNDS.win, volume: 0.8 });

      setTimeout(() => {
        // Show modal. Pass in a callback function for resetting the game
        modal({
          title: 'Du klarte det!',
          body: `Du brukte ${gameState.tries} forsøk. Vi er alle stolte av deg! Men prøv gjerne på nytt. Kanskje du kan klare det på færre forsøk?`,
          buttonText: 'Prøv igjen',
          modalBtnCB: newGame,
        });
      }, 250); // Pause for a bit after last tile is clicked before showing modal
    }
  }

  function flipTile(e) {
    const clickedDOMElement = e.currentTarget || e;

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
      triesDisplay.innerText = gameState.tries.toString();
    }

    // Increase tiles flipped counter if less than two tiles have been flipped
    if (gameState.tilesFlipped < 2) {
      gameState.tilesFlipped++;
      playSound({
        audiofile: GAMESOUNDS.flip,
        volume: 0.3,
      });

      clickedDOMElement.innerHTML = `
      <img src=${gameState.tiles[clickedTileID].src} alt=${gameState.tiles[clickedTileID].name} />
    `;
    }

    if (gameState.tilesFlipped === 2) {
      if (checkForMatch(gameState.firstTileID, clickedTileID) === true) {
        gameState.tiles[gameState.firstTileID].isMatched = true;
        gameState.tiles[clickedTileID].isMatched = true;
        playSound({ audiofile: GAMESOUNDS.match, volume: 0.8 });
      } else {
        gameState.isBlocked = true;

        // No match, flip back the two tiles after a short delay
        setTimeout(() => {
          if (gameState.firstTileDOMElement) {
            gameState.firstTileDOMElement.innerHTML = '';
          }
          clickedDOMElement.innerHTML = '';
          gameState.isBlocked = false;
        }, 500);
      }

      gameState.tilesFlipped = 0;
      gameState.firstTileID = null;

      checkWin();
    }
  }

  // Reset the game state, randomize all tiles, create board
  function newGame() {
    gameState.tries = 0;
    gameState.gameStatus = 'playing';
    gameState.modalIsOpen = false;

    // Update gamestate with a new randomized tile set
    gameState.tiles = shuffleTiles(TILES);

    // Clear the board and scores display in the DOM
    board.innerHTML = ''; // Clear board
    triesDisplay.innerText = '0'; // Reset tries to zero

    drawEmptyBoard();
  }

  gameState.gameStatus = 'idle';
  addButtonListeners();
  addKeyListeners();

  // Show modal with instructions on game start - then start the game
  modal({
    title: 'Teflonhjerne',
    body: 'Prøv å matche to og to figurer. Hvor mange forsøk trenger du for å klare hele brettet?',
    buttonText: 'Start spillet',
    modalBtnCB: newGame,
  });
};
