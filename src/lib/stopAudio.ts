// Stop the current sound which is playing

export function stopAudio(sound: HTMLAudioElement) {
  sound.pause();
  sound.currentTime = 0;
}
