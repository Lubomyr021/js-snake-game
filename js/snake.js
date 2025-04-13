export default class Snake {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.segments = [{ x: 10, y: 10 }]; // початкова позиція змійки
    this.direction = "";
    this.nextDirection = "";
  }

  // Повертає сегменти змійки
  getSegments() {
    return this.segments;
  }

  // Повертає голову змійки
  getHead() {
    return this.segments[0];
  }

  // Встановлює напрямок руху
  setDirection(direction) {
    // Запобігання руху в протилежному напрямку
    if (
      (direction === "up" && this.direction !== "down") ||
      (direction === "down" && this.direction !== "up") ||
      (direction === "left" && this.direction !== "right") ||
      (direction === "right" && this.direction !== "left")
    ) {
      this.nextDirection = direction;
    }
  }

  // Рух змійки
  move() {
    // Оновлення напрямку
    this.direction = this.nextDirection;

    // Якщо немає напрямку, змійка не рухається
    if (!this.direction) return false;

    // Отримуємо голову змійки та створюємо нову
    const head = { ...this.getHead() };

    // Рухаємо голову
    switch (this.direction) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    // Додаємо нову голову
    this.segments.unshift(head);

    return true;
  }

  // Видаляє останній сегмент змійки
  removeTail() {
    this.segments.pop();
  }

  // Перевірка зіткнення зі стінами
  checkWallCollision(canvasWidth, canvasHeight) {
    const head = this.getHead();
    return (
      head.x < 0 ||
      head.x >= canvasWidth / this.gridSize ||
      head.y < 0 ||
      head.y >= canvasHeight / this.gridSize
    );
  }

  // Перевірка зіткнення з собою
  checkSelfCollision() {
    const head = this.getHead();

    // Перевіряємо з другого сегмента, бо перший - це сама голова
    for (let i = 1; i < this.segments.length; i++) {
      if (this.segments[i].x === head.x && this.segments[i].y === head.y) {
        return true;
      }
    }
    return false;
  }

  // Перевірка, чи змійка з'їла їжу
  checkFoodCollision(food) {
    const head = this.getHead();
    return head.x === food.x && head.y === food.y;
  }

  // Очищення змійки (для перезапуску гри)
  reset() {
    this.segments = [{ x: 10, y: 10 }];
    this.direction = "";
    this.nextDirection = "";
  }
}
