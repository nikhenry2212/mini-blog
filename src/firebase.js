import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

let firebaseConfig = {
  apiKey: "AIzaSyCvin2NXoCyPWn8urRPXnIQl7Nm010wSnE",
  authDomain: "reactapp-af6de.firebaseapp.com",
  databaseURL: "https://reactapp-af6de-default-rtdb.firebaseio.com",
  projectId: "reactapp-af6de",
  storageBucket: "reactapp-af6de.appspot.com",
  messagingSenderId: "14381436241",
  appId: "1:14381436241:web:d686a81526ba6aa4985770",
  measurementId: "G-YJDZ5DGRQ3"
};


class Firebase {
  constructor() {
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig)
    }
    //Referenciando a database para acessar em outros locais
    this.app = app.database();
    
  }
  login(email, password) {
    return app.auth().signInWithEmailAndPassword(email, password)
  }

  async register(nome, email, password) {
    await app.auth().createUserWithEmailAndPassword(email, password)
    const uid = app.auth().currentUser.uid;

    return app.database().ref('usuarios').child(uid).set({
      nome: nome
    })
  }
  logout(){
    return app.auth().signOut()
  }
  isInitialized() {
    return new Promise(resolve => {
      app.auth().onAuthStateChanged(resolve)
    })
  }

  getCurrent() {
    return app.auth().currentUser && app.auth().currentUser.email
  }

  async getUserName(callback) {
    if(!app.auth().currentUser){
      return null;
    }
    const uid = app.auth().currentUser.uid;
    await app.database().ref('usuarios').child(uid)
    .once('value').then(callback);
  
  }

}
export default new Firebase();