document.addEventListener("DOMContentLoaded", () => {
  const vinyl = document.getElementById("vinyl");
  const playButton = document.getElementById("play-button");
  const audio = document.getElementById("love-song");
  const heartLayer = document.getElementById("heart-layer");

  let showerInterval = null;

  function setUI(isPlaying) {
    vinyl.classList.toggle("spinning", isPlaying);
    playButton.textContent = isPlaying ? "Pause" : "Play";
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createHeart() {
    const hearts = ["💗", "💖", "💘", "💝", "💞", "💕"];
    const heart = document.createElement("span");

    heart.className = "falling-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.setProperty("--x", rand(0, window.innerWidth) + "px");
    heart.style.setProperty("--size", rand(24, 50) + "px");
    heart.style.setProperty("--duration", rand(3, 6) + "s");

    heartLayer.appendChild(heart);

    heart.addEventListener("animationend", () => {
      heart.remove();
    });
  }

  function startShower() {
    if (showerInterval) return;

    showerInterval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        createHeart();
      }
    }, 200);
  }

  function stopShower() {
    clearInterval(showerInterval);
    showerInterval = null;
  }

  playButton.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
        setUI(true);
        startShower();
      } else {
        audio.pause();
        setUI(false);
        stopShower();
      }
    } catch (err) {
      console.error("Audio failed:", err);
      alert("Check MP3 filename/path (case-sensitive).");
    }
  });

  audio.addEventListener("ended", () => {
    setUI(false);
    stopShower();
  });

  setUI(false);
});

