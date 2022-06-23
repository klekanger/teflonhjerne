declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

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
  isMuted: boolean;
  selectedTile: number;
  modalIsOpen: boolean;
}

export interface ModalProps {
  title?: string;
  body?: string;
  buttonText?: string;
  modalBtnCB?: () => void;
}

export interface PlaySound {
  audiofile: HTMLAudioElement | null;
  volume?: number;
}
