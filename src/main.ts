// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: avoid getting cannot find module error
import { registerSW } from 'virtual:pwa-register';
import { Tile } from '../types';
import { animateTiles } from './lib/animate-tiles';
import {
  SOUND_FLIP,
  SOUND_MATCH,
  SOUND_NEWGAME,
  SOUND_UHOH,
  SOUND_WIN,
} from './lib/gamesounds';
import { gameState } from './lib/gameState';
import { shake } from './lib/shake';
import { stopAudio } from './lib/stopAudio';
import { TILES } from './lib/tiles';
import modal from './modal';
import './style.css';

// Register serviceworker using vitePWA plugin to make app installable
if ('serviceWorker' in navigator) {
  registerSW();
}

SOUND_FLIP.volume = 0.1;
SOUND_MATCH.volume = 0.3;
SOUND_NEWGAME.volume = 0.8;
SOUND_UHOH.volume = 0.1;
SOUND_WIN.volume = 0.8;

// Wait until the page has loaded before running the rest of the code
window.onload = () => {
  const mainContainer = document.querySelector('.main-container');
  mainContainer?.removeAttribute('hidden'); // hide HTML until page is loaded

  const board = document.querySelector('#gamegrid'); // This is where we will lay out all the tiles
  const triesDisplay = document.querySelector('#tries'); // DOM element for viewing current score/tries
  const audioToggle: HTMLImageElement | null =
    document.querySelector('#audio-toggle');
  const resetButton = document.querySelector('#reset-button');

  // ************************************************************************
  // Add onClick listeners to buttons
  // ************************************************************************
  function addButtonListeners() {
    if (resetButton instanceof HTMLElement) {
      resetButton.onclick = () => {
        newGame();
      };
    }

    if (audioToggle instanceof HTMLElement) {
      audioToggle.onclick = () => {
        gameState.isMuted = !gameState.isMuted;
        audioToggle.src = gameState.isMuted
          ? './icons/volume-mute-fill.svg'
          : './icons/volume-up-fill.svg';
        SOUND_FLIP.muted = gameState.isMuted;
        SOUND_MATCH.muted = gameState.isMuted;
        SOUND_NEWGAME.muted = gameState.isMuted;
        SOUND_UHOH.muted = gameState.isMuted;
        SOUND_WIN.muted = gameState.isMuted;
        audioToggle.ariaLabel = `Lyd er ${gameState.isMuted ? ' av' : ' på'}`;
      };
    }
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
      image.alt = tile.name;
      return image;
    };

    // Make a set of 8 random tiles from the larger array of tiles. Set makes sure we don't get duplicates
    const randomSetOfTiles = new Set<Tile>();
    while (randomSetOfTiles.size < 8) {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      randomSetOfTiles.add(tiles[randomIndex]);
    }

    // Convert the set to an array and duplicate the tiles
    const duplicatedTilesArray = [...randomSetOfTiles, ...randomSetOfTiles];

    // Shuffle the array
    duplicatedTilesArray.sort(() => Math.random() - 0.5);

    // Preload images for better performance
    const tilesWithPreloadedImages = duplicatedTilesArray.map((tile: Tile) => {
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
      tile.ariaLabel = 'Brikke';
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

      if (board instanceof HTMLElement) {
        board.appendChild(tile);
      }
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
      void SOUND_WIN.play();

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
  function flipTile(e: Event) {
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
      void SOUND_UHOH.play();
      shake(clickedDOMElement);
      return;
    }

    // Return early if clicked tiles have not flipped back yet
    if (gameState.isBlocked) {
      void SOUND_UHOH.play();
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
      if (triesDisplay instanceof HTMLElement) {
        triesDisplay.innerText = gameState.tries.toString();
      }
    }

    const tileImage = gameState.tiles[clickedTileID].image;

    // Increase tiles flipped counter if less than two tiles have been flipped
    if (gameState.tilesFlipped < 2) {
      gameState.tilesFlipped++;
      stopAudio(SOUND_FLIP); // Necessary to get the audio playing a second time if two tiles are clicked quickly after one another
      void SOUND_FLIP.play();

      if (tileImage instanceof HTMLImageElement) {
        clickedDOMElement.appendChild(tileImage);
      }
    }

    if (gameState.tilesFlipped === 2) {
      if (checkForMatch(gameState.firstTileID, clickedTileID) === true) {
        gameState.tiles[gameState.firstTileID].isMatched = true;
        gameState.tiles[clickedTileID].isMatched = true;

        void SOUND_MATCH.play();
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
    gameState.modalIsOpen = false;

    // Update gamestate with a new randomized tile set

    gameState.tiles = shuffleTiles(TILES);

    // Clear the board and scores display in the DOM
    if (board instanceof HTMLElement) {
      board.innerHTML = ''; // Clear board
    }
    if (triesDisplay instanceof HTMLElement) {
      triesDisplay.innerText = '0'; // Reset tries to zero
    }

    stopAudio(SOUND_NEWGAME); // Necessary to get the audio playing a second time if clicking reset button twice quickly after one another
    void SOUND_NEWGAME.play();
    drawEmptyBoard();
    animateTiles();
  }

  // ************************************************************************
  //
  //                             START THE GAME
  //
  // ************************************************************************

  addButtonListeners();

  // Show modal with instructions on game start - then start a new game
  modal({
    title: 'Teflon&shy;hjerne',
    body: 'Prøv å matche to og to figurer. Hvor mange forsøk trenger du for å klare hele brettet?',
    buttonText: 'Start spillet',
    modalBtnCB: newGame,
  });
};
