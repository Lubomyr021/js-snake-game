export default class User {
  constructor() {
    this.username = "";
    this.deviceId = this.generateDeviceId();
    this.bestScore = 0;
    this.bestTime = 0;
  }

  // Генерація унікального ID пристрою
  generateDeviceId() {
    // Генеруємо випадковий ID, якщо його ще немає
    let deviceId = localStorage.getItem("snakeDeviceId");
    if (!deviceId) {
      deviceId =
        "device_" +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem("snakeDeviceId", deviceId);
    }
    return deviceId;
  }

  // Перевірка наявності користувача
  checkUser() {
    const savedUsername = localStorage.getItem("snakeUsername");
    if (savedUsername) {
      this.username = savedUsername;
      this.loadBestScore();
      return true;
    }
    return false;
  }

  // Встановлення імені користувача
  setUsername(name) {
    if (name.trim() !== "") {
      this.username = name.trim();
      localStorage.setItem("snakeUsername", this.username);
      this.loadBestScore();
      return true;
    }
    return false;
  }

  // Завантаження найкращого результату з localStorage
  loadBestScore() {
    const savedBest = localStorage.getItem(`snakeBest_${this.username}`);
    if (savedBest) {
      const best = JSON.parse(savedBest);
      this.bestScore = best.score || 0;
      this.bestTime = best.time || 0;
    }

    // Повертаємо поточний найкращий результат
    return {
      score: this.bestScore,
      time: this.bestTime,
    };
  }

  // Оновлення найкращого результату
  updateBestScore(score, time) {
    if (
      score > this.bestScore ||
      (score === this.bestScore && time < this.bestTime)
    ) {
      this.bestScore = score;
      this.bestTime = time;

      // Зберігаємо локально
      const best = { score, time };
      localStorage.setItem(`snakeBest_${this.username}`, JSON.stringify(best));
      return true;
    }
    return false;
  }

  // Отримати інфо користувача
  getUserInfo() {
    return {
      username: this.username,
      deviceId: this.deviceId,
      bestScore: this.bestScore,
      bestTime: this.bestTime,
    };
  }
}
