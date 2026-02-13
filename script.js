document.addEventListener("DOMContentLoaded", () => {
  const vinyl = document.getElementById("vinyl");
  const playButton = document.getElementById("play-button");
  const audio = document.getElementById("love-song");
  const heartLayer = document.getElementById("heart-layer");

  // Safety checks
  if (!vinyl || !playButton || !audio || !heartLayer) {
    console.error("Missing elements:", { vinyl, playButton, audio, heartLayer });
    return;
  }

  function setUI(isPlaying) {
    vinyl.classList.toggle("spinning", isPlaying);
    playButton.textContent = isPlaying ? "Pause" : "Play";
    playButton.setAttribute("aria-pressed", String(isPlaying));
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function burstHearts(originX, originY, count = 26) {
    const hearts = ["💗", "💖", "💘", "💝", "💞", "💕"];

    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.className = "heart";
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];

      // Burst directions
      const dx = `${rand(-120, 120).toFixed(0)}px`;
      const dy = `${rand(-170, -60).toFixed(0)}px`; // upward
      const size = `${rand(14, 26).toFixed(0)}px`;
      const rot = `${rand(-40, 40).toFixed(0)}deg`;
      const dur = `${rand(700, 1100).toFixed(0)}ms`;

      el.style.setProperty("--x", `${originX}px`);
      el.style.setProperty("--y", `${originY}px`);
      el.style.setProperty("--dx", dx);
      el.style.setProperty("--dy", dy);
      el.style.setProperty("--size", size);
      el.style.setProperty("--rot", rot);
      el.style.setProperty("--dur", dur);

      heartLayer.appendChild(el);

      el.addEventListener("animationend", () => el.remove());
    }
  }

  // Play/Pause toggle
  playButton.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
        setUI(true);

        // Burst from center of vinyl (relative to heartLayer)
        const vinylRect = vinyl.getBoundingClientRect();
        const layerRect = heartLayer.getBoundingClientRect();
        const originX = vinylRect.left + vinylRect.width / 2 - layerRect.left;
        const originY = vinylRect.top + vinylRect.height / 2 - layerRect.top;

        burstHearts(originX, originY, 28);
      } else {
        audio.pause();
        setUI(false);
      }
    } catch (err) {
      console.error("Audio play failed:", err);

      // Most common: mp3 filename mismatch / 404 on GitHub Pages
      alert(
        "Audio couldn't play. Check that 'sumika-Fiction.mp3' exists in the repo root and the filename matches exactly (case-sensitive)."
      );
    }
  });

  // Keep UI in sync if user pauses via other means or audio ends
  audio.addEventListener("ended", () => setUI(false));
  audio.addEventListener("pause", () => setUI(false));
  audio.addEventListener("play", () => setUI(true));

  // Initial state
  setUI(false);
});
