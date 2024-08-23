let audio;

export const playNotificationSound = (soundUrl) => {
  if (audio) {
    audio.pause(); // Stop any currently playing audio
    audio.currentTime = 0; // Reset the audio to the start
  }
  audio = new Audio(soundUrl);
  audio.play();
};