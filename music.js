const musicButton = document.querySelector("#music");
const music = new Audio(
  "https://www.image2url.com/r2/default/audio/1789573804974-c60fa905-036a-42f0-8c04-96e6ddbaecee.mp3",
);
music.loop = true;

async function toggleMusic() {
  if (!music.paused) {
    music.pause();
    music.currentTime = 0;
    musicButton.textContent = "Singing till your eardrums burst";
    return;
  }

  await music.play();
  musicButton.textContent = "Stop the music";
}

musicButton.addEventListener("click", toggleMusic);
