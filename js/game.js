import Snake from "./snake.js";
import Food from "./food.js";

export default class Game {
  constructor(canvas, scoreElement, timeElement, bestElement, startMessage) {
    // Елементи DOM
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.scoreElement = scoreElement;
    this.timeElement = timeElement;
    this.bestElement = bestElement;
    this.startMessage = startMessage;

    // Параметри гри
    this.gridSize = 20;
    this.speed = 150;
    this.score = 0;
    this.time = 0;
    this.gameStarted = false;
    this.gameOver = false;

    // Ігрові об'єкти
    this.snake = new Snake(this.gridSize);
    this.food = new Food(this.gridSize);

    // Ігрові інтервали
    this.gameInterval = null;
    this.timeInterval = null;
  }

  // Ініціалізація гри
  init() {
    this.snake.reset();
    this.food.generate(
      this.canvas.width,
      this.canvas.height,
      this.snake.getSegments()
    );

    this.score = 0;
    this.time = 0;
    this.gameOver = false;

    this.updateScore();
    this.updateTime();

    clearInterval(this.gameInterval);
    clearInterval(this.timeInterval);

    this.gameStarted = false;
    this.startMessage.style.display = "block";

    // Малюємо початковий стан
    this.draw();
  }

  // Початок гри
  start() {
    if (this.gameStarted || this.gameOver) return;

    this.gameStarted = true;
    this.startMessage.style.display = "none";

    // Запускаємо інтервали
    this.gameInterval = setInterval(() => this.update(), this.speed);
    this.timeInterval = setInterval(() => {
      this.time++;
      this.updateTime();
    }, 1000);
  }

  // Оновлення стану гри (один ігровий крок)
  update() {
    if (this.gameOver) return;

    // Переміщення змійки
    const moved = this.snake.move();

    // Якщо змійка не рухається (немає напрямку), пропускаємо оновлення
    if (!moved) return;

    // Перевірка зіткнення зі стінами
    if (this.snake.checkWallCollision(this.canvas.width, this.canvas.height)) {
      this.end();
      return;
    }

    // Перевірка зіткнення з собою
    if (this.snake.checkSelfCollision()) {
      this.end();
      return;
    }

    // Перевірка, чи з'їла змійка їжу
    if (this.snake.checkFoodCollision(this.food.getPosition())) {
      this.score += 10;
      this.updateScore();
      this.food.generate(
        this.canvas.width,
        this.canvas.height,
        this.snake.getSegments()
      );

      // Збільшуємо швидкість кожні 50 очок
      if (this.score % 50 === 0 && this.speed > 50) {
        this.speed -= 5;
        clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => this.update(), this.speed);
      }
    } else {
      // Якщо не з'їла, видаляємо останній сегмент
      this.snake.removeTail();
    }

    // Малюємо оновлений стан гри
    this.draw();
  }

  // Малювання гри
  draw() {
    // Очищення поля
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Малювання їжі
    const foodPos = this.food.getPosition();
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      foodPos.x * this.gridSize,
      foodPos.y * this.gridSize,
      this.gridSize,
      this.gridSize
    );

    // Малювання змійки
    this.ctx.fillStyle = "green";
    for (let segment of this.snake.getSegments()) {
      this.ctx.fillRect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.gridSize,
        this.gridSize
      );
    }

    // Малювання сітки
    this.ctx.strokeStyle = "#ddd";
    for (let i = 0; i < this.canvas.width / this.gridSize; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.gridSize, 0);
      this.ctx.lineTo(i * this.gridSize, this.canvas.height);
      this.ctx.stroke();
    }

    for (let i = 0; i < this.canvas.height / this.gridSize; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.gridSize);
      this.ctx.lineTo(this.canvas.width, i * this.gridSize);
      this.ctx.stroke();
    }
  }

  // Оновлення відображення рахунку
  updateScore() {
    this.scoreElement.textContent = `Очки: ${this.score}`;
  }

  // Оновлення відображення часу
  updateTime() {
    let displayTime = "";

    if (this.time < 60) {
      // Якщо менше хвилини, показуємо тільки секунди
      displayTime = `${this.time} сек.`;
    } else {
      // Якщо більше хвилини, показуємо хвилини і секунди
      const minutes = Math.floor(this.time / 60);
      const seconds = this.time % 60;

      // Формуємо рядок з урахуванням множини
      if (minutes === 1) {
        displayTime = `1 хвилина ${seconds} сек.`;
      } else if (minutes >= 2 && minutes <= 4) {
        displayTime = `${minutes} хвилини ${seconds} сек.`;
      } else {
        displayTime = `${minutes} хвилин ${seconds} сек.`;
      }
    }

    // Оновлюємо елемент на сторінці
    this.timeElement.textContent = `Час: ${displayTime}`;
  }

  // Оновлення відображення кращого результату
  updateBestDisplay(bestScore) {
    this.bestElement.textContent = `Найкращий: ${bestScore}`;
  }

  // Форматування часу для відображення
  formatTime(time) {
    let displayTime = "";
    if (time < 60) {
      displayTime = `${time} сек.`;
    } else {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;

      if (minutes === 1) {
        displayTime = `1 хвилина ${seconds} сек.`;
      } else if (minutes >= 2 && minutes <= 4) {
        displayTime = `${minutes} хвилини ${seconds} сек.`;
      } else {
        displayTime = `${minutes} хвилин ${seconds} сек.`;
      }
    }
    return displayTime;
  }

  // Кінець гри
  end() {
    this.gameOver = true;
    clearInterval(this.gameInterval);
    clearInterval(this.timeInterval);

    console.log("Гра закінчена. Поточний результат:", this.score);

    // Надсилаємо подію закінчення гри з результатами
    const gameEndEvent = new CustomEvent("gameEnd", {
      detail: {
        score: this.score,
        time: this.time,
      },
    });
    document.dispatchEvent(gameEndEvent);
  }

  // Зміна напрямку змійки
  changeDirection(direction) {
    this.snake.setDirection(direction);
  }

  // Отримати поточний стан гри
  getGameState() {
    return {
      score: this.score,
      time: this.time,
      gameStarted: this.gameStarted,
      gameOver: this.gameOver,
    };
  }
}
