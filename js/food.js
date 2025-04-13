export default class Food {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.position = { x: 0, y: 0 };
  }

  // Генерація нової їжі
  generate(canvasWidth, canvasHeight, snakeSegments) {
    const maxX = canvasWidth / this.gridSize - 1;
    const maxY = canvasHeight / this.gridSize - 1;

    let newFood;
    let foodOnSnake;

    do {
      foodOnSnake = false;
      newFood = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY),
      };

      // Перевірка, чи не згенерувалася їжа на змійці
      for (let segment of snakeSegments) {
        if (segment.x === newFood.x && segment.y === newFood.y) {
          foodOnSnake = true;
          break;
        }
      }
    } while (foodOnSnake);

    this.position = newFood;
  }

  // Отримати позицію їжі
  getPosition() {
    return this.position;
  }
}
