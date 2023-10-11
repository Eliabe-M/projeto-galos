const express = require('express');
const { getApps, initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, collection, getDocs } = require("firebase/firestore");
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var firebaseConfig = {
  apiKey: "AIzaSyBp2GEjlg2SbgnmKsuRUIBwokPuDSL8x98",
  authDomain: "autenticacao-ab240.firebaseapp.com",
  projectId: "autenticacao-ab240",
  storageBucket: "autenticacao-ab240.appspot.com",
  messagingSenderId: "849685998780",
  appId: "1:849685998780:web:a2a0e87d7d2c76996674b9"
};

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(firebaseApp);

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/login', async (req, res) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, req.body.email, req.body.password);
        console.log(userCredential); // Adicione esta linha
        res.redirect('/home');
    } catch (error) {
        res.send(error.message);
    }
});

app.post('/register', async (req, res) => {
    const { breed, value, size, weight } = req.body;
    const db = getFirestore();

    try {
        await setDoc(doc(db, 'roosters', breed), {
            breed: breed,
            value: value,
            size: size,
            weight: weight
        });
        res.redirect('/home');
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/home', async (req, res) => {
    const db = getFirestore();
    const roostersSnapshot = await getDocs(collection(db, 'roosters'));
    const roosters = roostersSnapshot.docs.map(doc => doc.data());
    const user = auth.currentUser;
    if (user) {
        res.render('home', { user: user, roosters: roosters });
    } else {
        res.redirect('/');
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));
