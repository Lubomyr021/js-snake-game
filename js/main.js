import db from "./firebase-config.js";
import User from "./user.js";
import Game from "./game.js";
import Leaderboard from "./leaderboard.js";

// Отримуємо елементи сторінки
const canvas = document.getElementById("game-canvas");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const bestElement = document.getElementById("best");
const startMessage = document.getElementById("start-message");

// Модальні вікна
const nameModal = document.getElementById("name-modal");
const recordModal = document.getElementById("record-modal");
const gameOverModal = document.getElementById("game-over-modal");
const leaderboardModal = document.getElementById("leaderboard-modal");

// Кнопки модальних вікон
const saveNameBtn = document.getElementById("save-name-btn");
const closeRecordBtn = document.getElementById("close-record-btn");
const restartGameBtn = document.getElementById("restart-game-btn");
const closeLeaderboardBtn = document.getElementById("close-leaderboard-btn");

// Кнопки керування
const restartBtn = document.getElementById("restart-btn");
const recordBtn = document.getElementById("record-btn");
const leaderboardBtn = document.getElementById("leaderboard-btn");
const upBtn = document.getElementById("up-btn");
const downBtn = document.getElementById("down-btn");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");

// Ініціалізація основних класів
const user = new User();
const leaderboard = new Leaderboard(db);
const game = new Game(
  canvas,
  scoreElement,
  timeElement,
  bestElement,
  startMessage
);

// Перевірка користувача
function initApp() {
  if (!user.checkUser()) {
    nameModal.style.display = "block";
  } else {
    const best = user.loadBestScore();
    game.updateBestDisplay(best.score);

    // Завантажуємо рекорди з Firebase
    leaderboard
      .loadUserRecords(user.getUserInfo().deviceId)
      .then((cloudBest) => {
        if (
          cloudBest &&
          (cloudBest.score > best.score ||
            (cloudBest.score === best.score && cloudBest.time < best.time))
        ) {
          user.updateBestScore(cloudBest.score, cloudBest.time);
          game.updateBestDisplay(cloudBest.score);
        }
      })
      .catch((error) => {
        console.error("Помилка при завантаженні рекордів:", error);
      });
  }

  game.init();
}

// Завантаження таблиці лідерів
function loadLeaderboard() {
  const leaderboardBody = document.getElementById("leaderboard-body");
  leaderboardBody.innerHTML = '<tr><td colspan="4">Завантаження...</td></tr>';

  leaderboard
    .getLeaderboard()
    .then((data) => {
      if (data.length === 0) {
        leaderboardBody.innerHTML =
          '<tr><td colspan="4">Поки немає записів</td></tr>';
        return;
      }

      // Оновлюємо таблицю
      leaderboardBody.innerHTML = "";

      let place = 1;
      for (const entry of data) {
        const username = entry.username || "Анонім";
        const score = entry.score || 0;
        const time = entry.time || 0;

        // Форматуємо час
        let timeDisplay = "";
        if (time < 60) {
          timeDisplay = `${time} сек.`;
        } else {
          const minutes = Math.floor(time / 60);
          const seconds = time % 60;
          timeDisplay = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        }

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${place}</td>
          <td>${username}</td>
          <td>${score}</td>
          <td>${timeDisplay}</td>
        `;

        // Виділяємо результат поточного користувача
        const deviceId = user.getUserInfo().deviceId;
        if (entry.deviceId === deviceId) {
          row.style.backgroundColor = "#e6ffe6";
          row.style.fontWeight = "bold";
        }

        leaderboardBody.appendChild(row);
        place++;
      }
    })
    .catch((error) => {
      console.error("Помилка при отриманні таблиці лідерів:", error);
      leaderboardBody.innerHTML = `<tr><td colspan="4">Помилка при завантаженні: ${error.message}</td></tr>`;
    });
}

// Обробка закінчення гри
document.addEventListener("gameEnd", function (e) {
  const { score, time } = e.detail;
  const userInfo = user.getUserInfo();

  // Зберігаємо результат у Firestore
  leaderboard.saveScore(userInfo.username, userInfo.deviceId, score, time);

  // Перевіряємо, чи це найкращий результат
  if (user.updateBestScore(score, time)) {
    game.updateBestDisplay(score);
  }

  // Форматуємо час для відображення
  const displayTime = game.formatTime(time);

  // Показуємо вікно завершення гри
  document.getElementById("final-score").textContent = `Ваші очки: ${score}`;
  document.getElementById("final-time").textContent = `Ваш час: ${displayTime}`;
  gameOverModal.style.display = "block";
});

// Обробники подій кнопок модальних вікон
saveNameBtn.addEventListener("click", () => {
  const input = document.getElementById("username-input");
  if (user.setUsername(input.value)) {
    nameModal.style.display = "none";
    game.updateBestDisplay(user.getUserInfo().bestScore);
  }
});

closeRecordBtn.addEventListener("click", () => {
  recordModal.style.display = "none";
});

restartGameBtn.addEventListener("click", () => {
  gameOverModal.style.display = "none";
  game.init();
});

closeLeaderboardBtn.addEventListener("click", () => {
  leaderboardModal.style.display = "none";
});

// Обробники кнопок управління
restartBtn.addEventListener("click", () => {
  game.init();
});

recordBtn.addEventListener("click", () => {
  const userInfo = user.getUserInfo();
  const bestTimeDisplay = game.formatTime(userInfo.bestTime);

  document.getElementById(
    "record-info"
  ).textContent = `Очки: ${userInfo.bestScore}, Час: ${bestTimeDisplay}`;
  recordModal.style.display = "block";
});

leaderboardBtn.addEventListener("click", () => {
  loadLeaderboard();
  leaderboardModal.style.display = "block";
});

// Обробники клавіш
window.addEventListener("keydown", (e) => {
  const gameState = game.getGameState();

  if (
    !gameState.gameStarted &&
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
  ) {
    game.start();
  }

  switch (e.key) {
    case "ArrowUp":
      game.changeDirection("up");
      break;
    case "ArrowDown":
      game.changeDirection("down");
      break;
    case "ArrowLeft":
      game.changeDirection("left");
      break;
    case "ArrowRight":
      game.changeDirection("right");
      break;
  }
});

// Обробники кнопок керування на екрані
upBtn.addEventListener("click", () => {
  if (!game.getGameState().gameStarted) game.start();
  game.changeDirection("up");
});

downBtn.addEventListener("click", () => {
  if (!game.getGameState().gameStarted) game.start();
  game.changeDirection("down");
});

leftBtn.addEventListener("click", () => {
  if (!game.getGameState().gameStarted) game.start();
  game.changeDirection("left");
});

rightBtn.addEventListener("click", () => {
  if (!game.getGameState().gameStarted) game.start();
  game.changeDirection("right");
});

// Закриття модальних вікон при кліку за їх межами
window.addEventListener("click", (e) => {
  if (e.target === recordModal) {
    recordModal.style.display = "none";
  }
  if (e.target === leaderboardModal) {
    leaderboardModal.style.display = "none";
  }
});

// Ініціалізація гри при завантаженні сторінки
window.onload = initApp;
