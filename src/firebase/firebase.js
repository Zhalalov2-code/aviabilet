// src/firebase/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCIM4udx_O9G0Kj0mNLFEQaO8KGAJyDny4",
  authDomain: "aviasels-ec6b8.firebaseapp.com",
  projectId: "aviasels-ec6b8",
  storageBucket: "aviasels-ec6b8.appspot.com",
  messagingSenderId: "105408488957",
  appId: "1:105408488957:web:9e5f6e61ad9a8422a6a594"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
