import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {

    apiKey: "AIzaSyDvGdkmQIAhRJGbumxHhFQipct-vKx_GoA",
    authDomain: "tarefas-c55c2.firebaseapp.com",
    projectId: "tarefas-c55c2",
    storageBucket: "tarefas-c55c2.appspot.com",
    messagingSenderId: "171587364250",
    appId: "1:171587364250:web:4da34f9db2c98de62a8623"
  
  };
  

  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  };

  export default firebase;