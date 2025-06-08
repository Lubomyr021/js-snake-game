![image](https://github.com/user-attachments/assets/f68dd564-13b7-4949-98fe-6527e3827522)


 Snake Game

Classic arcade game * * Snake * *, implemented in pure JavaScript using HTML5 Canvas.

 Features

- Movement of the snake through the keyboard or buttons on the screen
- Leaderboard with Firebase Firestore
- Save the best result locally (LocalStorage)
- Modal windows for entering name, viewing record and end of game
- Smooth increase in the speed of the game with every 50 points

---

 Структура проєкту

```
├— index.html                # The main HTML page of the game
├— style/
│   └— styles.css           # Styles
├— js/
│   ├— main.js              # Basic logic of game launch
│   ├— game.js              # Game class (logic, update, rendering)
│   ├— snake.js             # Snake class
│   ├— food.js              # Food class
│   ├— user.js              # User class (save results)
│   ├— leaderboard.js       # Leader Table Class 
│   └— firebase-config.js   # Firebase Configuration

```
