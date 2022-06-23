import { GameState } from '../../types';

// Create a global object to store state
// Could be useful for storing more stuff in one place if we later
// wants to expand the game with more functionality
export const gameState: GameState = {
  tiles: [],
  firstTileID: null,
  firstTileDOMElement: null,
  isBlocked: false,
  tilesFlipped: 0,
  tries: 0,
  isMuted: false,
  modalIsOpen: false,
};
