import { registerSW } from 'virtual:pwa-register';
import { Tile } from '../types';
import { GAMESOUNDS } from './lib/gamesounds';
import { gameState } from './lib/gameState';
import { playSound } from './lib/playSound';
import { shake } from './lib/shake';
import { TILES } from './lib/tiles';
import modal from './modal';
import { animateTiles } from './lib/animate-tiles';
import gsap from 'gsap';
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

  // ************************************************************************
  // Add onClick listeners to buttons
  // ************************************************************************
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

  // ************************************************************************
  // Set up listeners for keyboard navigation
  // ************************************************************************
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

  // ************************************************************************
  // Shuffle tiles and preload images
  // ************************************************************************
  function shuffleTiles(tiles: Tile[]) {
    if (tiles.length < 8) {
      throw new Error('Not enough tiles to shuffle');
    }

    const preloadImage = (tile: Tile) => {
      const image = new Image();
      image.src = tile.src;
      return image;
    };

    // Make a set of 8 random tiles from the larger array of tiles. Set makes sure we don't get duplicates
    const randomSetOfTiles = new Set<Tile>();
    while (randomSetOfTiles.size < 8) {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      randomSetOfTiles.add(tiles[randomIndex]);
    }

    // Convert the set to an array and duplicate the tiles
    const tilesArray = Array.from(randomSetOfTiles);
    const duplicatedTilesArray = [...tilesArray, ...tilesArray];

    // Shuffle the array
    duplicatedTilesArray.sort(() => Math.random() - 0.5);

    // Preload images for better performance
    const tilesWithPreloadedImages = duplicatedTilesArray.map((tile) => {
      const image = preloadImage(tile);
      return { ...tile, image };
    });

    return tilesWithPreloadedImages;
  }

  // ************************************************************************
  // Create a new empty board
  // ************************************************************************
  function drawEmptyBoard() {
    for (let i = 0; i < 16; i++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.setAttribute('data-tile', `${i}`);
      tile.setAttribute('tabindex', '0');
      tile.addEventListener('click', flipTile);

      // Add classes used for animation of tiles when a new board is drawn
      if (i < 4) {
        tile.classList.add('odd');
      } else if (i < 8) {
        tile.classList.add('even');
      } else if (i < 12) {
        tile.classList.add('odd');
      } else {
        tile.classList.add('even');
      }

      board.appendChild(tile);
    }
  }

  // ************************************************************************
  // Check if the two tiles match
  // ************************************************************************
  function checkForMatch(firstTile: number, secondTile: number): boolean {
    return gameState.tiles[firstTile].name === gameState.tiles[secondTile].name;
  }

  // ************************************************************************
  // Check if player has won (all tiles matched)
  // ************************************************************************
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

  // ************************************************************************
  // MAIN game logic in this function:
  // 1) Flip a tile
  // 2) If two tiles are flipped, check if they match
  // 3) If they don't match, flip them back
  // 4) If they match, mark them as matched and check if the player has won
  // ************************************************************************
  function flipTile(e: Event | HTMLElement) {
    // Have to account for that the argument can be an mouse click event or a keyboard press
    // to avoid any TypeScript errors
    let clickedDOMElement: HTMLElement;
    if (e instanceof Event) {
      clickedDOMElement = <HTMLElement>e.currentTarget;
    } else {
      clickedDOMElement = e;
    }

    const clickedTileID = Number(clickedDOMElement.getAttribute('data-tile'));

    // If the tile is already flipped, don't flip it again
    if (
      gameState.tiles[clickedTileID].isMatched ||
      clickedDOMElement.childElementCount > 0
    ) {
      playSound({ audiofile: GAMESOUNDS.uhOh, volume: 0.8 });
      shake(clickedDOMElement);
      return;
    }

    // Return early if clicked tiles have not flipped back yet
    if (gameState.isBlocked) {
      playSound({ audiofile: GAMESOUNDS.uhOh, volume: 0.8 });
      shake(clickedDOMElement);
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

      const tileImage = <HTMLImageElement>gameState.tiles[clickedTileID].image;
      clickedDOMElement.appendChild(tileImage);
      gsap.from(tileImage, {
        duration: 0.3,
        opacity: 0,
        scale: 2,
        rotation: -360,
        ease: 'back',
      });
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

  // ************************************************************************
  // Reset the game state, randomize all tiles, create board
  // ************************************************************************
  function newGame() {
    gameState.tries = 0;
    gameState.gameStatus = 'playing';
    gameState.modalIsOpen = false;

    // Update gamestate with a new randomized tile set

    gameState.tiles = shuffleTiles(TILES);

    // Clear the board and scores display in the DOM
    board.innerHTML = ''; // Clear board
    triesDisplay.innerText = '0'; // Reset tries to zero

    playSound({ audiofile: GAMESOUNDS.newGame, volume: 0.8 });
    drawEmptyBoard();
    animateTiles();
  }

  // ************************************************************************
  //
  //                             START THE GAME
  //
  // ************************************************************************
  gameState.gameStatus = 'idle';
  addButtonListeners();
  addKeyListeners();

  // Show modal with instructions on game start - then start a new game
  modal({
    title: 'Teflonhjerne',
    body: 'Prøv å matche to og to figurer. Hvor mange forsøk trenger du for å klare hele brettet?',
    buttonText: 'Start spillet',
    modalBtnCB: newGame,
  });
};
