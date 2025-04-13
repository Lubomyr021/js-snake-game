export default class Leaderboard {
  constructor(firestore) {
    this.db = firestore;
  }

  // Збереження результату в Firestore
  saveScore(username, deviceId, score, time) {
    console.log("Спроба зберегти результат:", {
      username,
      deviceId,
      score,
      time,
    });

    if (!username) {
      console.error("Помилка: ім'я користувача відсутнє");
      return Promise.reject("Ім'я користувача відсутнє");
    }

    try {
      // Спочатку перевіряємо, чи є вже запис для цього пристрою
      return this.db
        .collection("leaderboard")
        .where("deviceId", "==", deviceId)
        .get()
        .then((querySnapshot) => {
          // Якщо знайдено попередній запис
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const previousData = doc.data();

            // Перевіряємо, чи новий результат кращий
            if (
              score > previousData.score ||
              (score === previousData.score && time < previousData.time)
            ) {
              // Оновлюємо існуючий запис
              return this.db
                .collection("leaderboard")
                .doc(doc.id)
                .update({
                  username: username,
                  score: score,
                  time: time,
                  date: new Date().toISOString(),
                })
                .then(() => {
                  console.log("Результат успішно оновлено в Firestore");
                  return true;
                });
            } else {
              console.log(
                "Поточний результат не перевищує попередній, збереження не потрібне"
              );
              return false;
            }
          } else {
            // Якщо запису для цього пристрою не знайдено, створюємо новий
            return this.db
              .collection("leaderboard")
              .add({
                deviceId: deviceId,
                username: username,
                score: score,
                time: time,
                date: new Date().toISOString(),
              })
              .then(() => {
                console.log("Новий результат успішно збережено в Firestore");
                return true;
              });
          }
        });
    } catch (error) {
      console.error("Помилка при збереженні в Firestore:", error);
      return Promise.reject(error);
    }
  }

  // Завантаження рекордів користувача з Firestore
  loadUserRecords(deviceId) {
    try {
      return this.db
        .collection("leaderboard")
        .where("deviceId", "==", deviceId)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0].data();
            return {
              score: doc.score,
              time: doc.time,
            };
          }
          return null;
        });
    } catch (error) {
      console.error("Помилка при отриманні даних з Firestore:", error);
      return Promise.reject(error);
    }
  }

  // Отримання всієї таблиці лідерів
  getLeaderboard() {
    try {
      return this.db
        .collection("leaderboard")
        .orderBy("score", "desc")
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            return [];
          }

          const leaderboard = [];
          querySnapshot.forEach((doc) => {
            leaderboard.push(doc.data());
          });

          return leaderboard;
        });
    } catch (error) {
      console.error("Помилка при отриманні таблиці лідерів:", error);
      return Promise.reject(error);
    }
  }
}
