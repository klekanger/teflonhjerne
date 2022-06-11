import { PlaySound } from '../../types';
import { gameState } from './gameState';

// play a sound

// export function playSound({ sound, volume = 1 }: PlaySound) {
export function playSound(sound: PlaySound) {
  if (gameState.muted) {
    return;
  }
  const soundToPlay = new Audio(sound.audiofile);
  soundToPlay.volume = sound.volume;
  soundToPlay.play();
}
