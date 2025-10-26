document.addEventListener("DOMContentLoaded", () => {
  console.log("Juego iniciado");

  const dino = document.getElementById("dino");
  const scoreDisplay = document.getElementById("score");
  const cactus = document.getElementById("cactus");
  const difficultyButtons = document.querySelectorAll(".difficulty-btn");

  // Modal About
  const aboutBtn = document.getElementById('about-btn');
  const modal = document.getElementById('about-modal');
  const closeBtn = document.querySelector('.modal .close');

  // Posiciones iniciales
  cactus.style.left = "600px";
  cactus.style.bottom = "0px";
  dino.style.left = "50px";
  dino.style.bottom = "0px";

  let score = 0;
  let dinoBottom = 0;
  let isJumping = false;
  let speed = 4;           // velocidad según dificultad
  let gameOverFlag = false;
  let animationId;

  const dinoLeft = 50;
  const dinoWidth = 50;
  const dinoHeight = 50;
  const cactusWidth = 20;
  const cactusHeight = 40;

  // Función salto
  function jump() {
    if (isJumping || gameOverFlag) return;
    isJumping = true;
    let velocity = 15;

    const interval = setInterval(() => {
      dinoBottom += velocity;
      velocity -= 1;
      if (dinoBottom <= 0) {
        dinoBottom = 0;
        isJumping = false;
        clearInterval(interval);
      }
      dino.style.bottom = dinoBottom + "px";
    }, 20);
  }

  // Función reiniciar juego
  function resetGame() {
    cancelAnimationFrame(animationId);
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    dinoBottom = 0;
    cactus.style.left = "600px";
    dino.style.bottom = "0px";
    dino.src = "images/dino-stationary.png";
    gameOverFlag = false;

    // Mostrar botones de dificultad nuevamente
    document.querySelector(".difficulty-container").style.display = "block";
  }

  // Función actualización
  function update() {
    if (!gameOverFlag) {
      let cactusLeft = parseFloat(cactus.style.left);
      cactusLeft -= speed;

      if (cactusLeft < -cactusWidth) {
        cactusLeft = 600;
        score++;
        scoreDisplay.textContent = "Score: " + score;
      }

      cactus.style.left = cactusLeft + "px";

      // Colisión
      if (
        cactusLeft < dinoLeft + dinoWidth &&
        cactusLeft + cactusWidth > dinoLeft &&
        dinoBottom < cactusHeight
      ) {
        console.log("¡COLISIÓN!");
        dino.src = "images/dino-lose.png";
        gameOverFlag = true;

        Swal.fire({
          title: "GAME OVER",
          icon: "error",
          background: "#0d1117",
          color: "#e6edf3",
          confirmButtonText: "🔁 Retry",
          confirmButtonColor: "#000",
          iconColor: "#60a5fa",
          customClass: {
            title: 'titulo-gameover',
            popup: 'popup-gameover',
            confirmButton: 'boton-reintentar'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            resetGame();
          }
        });

      } else {
        dino.src = "images/dino-stationary.png";
      }
    }

    animationId = requestAnimationFrame(update);
  }

  // Listener salto
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") jump();
  });

  // Selección de dificultad
  difficultyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      speed = parseFloat(btn.dataset.speed);
      document.querySelector(".difficulty-container").style.display = "none";
      update(); // iniciar juego limpio con la dificultad elegida
    });
  });

  // 🔹 Modal About
  aboutBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

});
