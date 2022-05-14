export interface Tile {
  name: string;
  src: string;
  isMatched?: boolean;
}

export interface GameState {
  tiles: Tile[];
  firstTileID: number | null;
  firstTileDOMElement: HTMLElement | null;
  isMatched: boolean;
  isBlocked: boolean;
  tilesFlipped: number;
  tries: number;
  gameOver: boolean;
}

export interface ModalProps {
  title?: string;
  body?: string;
  buttonText?: string;
  modalBtnCB?: () => void;
}
