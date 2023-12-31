// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzeCL5BaEDkSfz9K-dGbSI5o0BNUQfymg",
  authDomain: "hedera-hacks.firebaseapp.com",
  projectId: "hedera-hacks",
  storageBucket: "hedera-hacks.appspot.com",
  messagingSenderId: "625250620068",
  appId: "1:625250620068:web:9f09917f694d5e6ab20c31",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
