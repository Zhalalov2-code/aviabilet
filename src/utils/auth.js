import axios from 'axios';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

const provider = new GoogleAuthProvider();
const API_URL = 'https://6873df93c75558e27355818e.mockapi.io/users';

export async function registerUser(email, password, additional = {}) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  const mockData = {
    uid: user.uid,
    email: user.email,
    name: additional.name || '',
    lastname: additional.lastname || '',
    avatar: additional.avatar || '',
    telephone: additional.telephone || ''
  };

  await axios.post(API_URL, mockData);
  return user;
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const { user } = result;

  const res = await axios.get(`${API_URL}?email=${user.email}`);
  let userData = res.data[0];

  if (!userData) {
    const newUser = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || '',
      avatar: user.photoURL || '',
      telephone: ''
    };
    const created = await axios.post(API_URL, newUser);
    userData = created.data;
  }

  localStorage.setItem('currentUser', JSON.stringify(userData));
  return userData;
}

export async function loginUser(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  const res = await axios.get(`${API_URL}?email=${user.email}`);
  const userData = res.data[0];
  localStorage.setItem('currentUser', JSON.stringify(userData));
  return userData;
}

export async function logoutUser() {
  await signOut(auth);
  localStorage.removeItem('currentUser');
}
