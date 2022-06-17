export interface Tile {
  name: string;
  src: string;
  image: HTMLImageElement | null;
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
  gameStatus: 'idle' | 'playing' | 'won';
  muted: boolean;
  selectedTile: number;
  modalIsOpen: boolean;
}

export interface ModalProps {
  title?: string;
  body?: string;
  buttonText?: string;
  modalBtnCB?: () => void;
}
