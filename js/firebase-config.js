// Ініціалізація Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAqX_36E5039_sUUAp47usvkdP7bP2HO-g",
  authDomain: "snake-game-e8293.firebaseapp.com",
  projectId: "snake-game-e8293",
  storageBucket: "snake-game-e8293.appspot.com",
  messagingSenderId: "615211149979",
  appId: "1:615211149979:web:48721da767c2ee9111f43e",
  measurementId: "G-JSND4KK0KY",
};

// Ініціалізуємо Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default db;
