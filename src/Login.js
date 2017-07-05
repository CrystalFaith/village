import React, { Component } from 'react';
import firebase from 'firebase';
import helpers from "./utils/helpers";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD-np5USZAOXmA51TB8EmNcPPYCnffOmjI",
  authDomain: "villageapp-6bbe4.firebaseapp.com",
  databaseURL: "https://villageapp-6bbe4.firebaseio.com",
  projectId: "villageapp-6bbe4",
  storageBucket: "villageapp-6bbe4.appspot.com",
  messagingSenderId: "955973472886"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
// messaging.requestPermission()
// .then(function() {
//   console.log("Have permission");
//   return messaging.getToken();
// })
// .then(function(token) {
//   console.log("We have a token: " + token);
//   helpers.sendToken(token).then(function() {
//     console.log("We are back from the helpers call.");
//   })
// })
// .catch(function(err) {
//   console.log('Error occurred in push', err);
// })

messaging.onMessage(function(payload) {
  console.log("On Message: ", payload);
});

class Login extends Component {

  componentWillMount(){
    firebase.auth().onAuthStateChanged(function(auth) {

        const user = firebase.auth().currentUser;

        //User authenticated and active session begins.
        if (auth != null) {
          console.log('User authenticated: ' + user.displayName);
          console.log(user);
          var googleBtn = document.getElementById('googleBtn');
          googleBtn.classList.add('hide');
          let lout = document.getElementById("logoutButton");
          lout.classList.remove("hide")
          let err = "Welcome, " + user.displayName;
          let successful = "You are successfully logged in with Google."
          this.setState({
            err: err,
            successful: successful,
          });
        //User isn't authenticated.
        } else {
          console.log('User not authenticated.');
        }


      }.bind(this));
  };

  logout(event){
    firebase.auth().signOut();
    let lout = document.getElementById("logoutButton");
    lout.classList.add("hide")
    var googleBtn = document.getElementById('googleBtn');
    googleBtn.classList.remove('hide');
    let err = "Thanks!";
    let successful = "You have successfully logged out."
    this.setState({
      err: err,
      successful: successful,
    });
  }

  google(){
    console.log("this is google method")

    let provider = new firebase.auth.GoogleAuthProvider();
    let promise = firebase.auth().signInWithPopup(provider);
    messaging.requestPermission()
    .then(function() {
      console.log("Have permission");
      return messaging.getToken();
    })
    .then(function(token) {
      console.log("We have a token: " + token);
      let FBtoken = token
      promise
      .then( result => {
        let user = result.user;
        console.log(result);

        firebase.database().ref("users/"+user.uid).set({
          email: user.email,
          name: user.displayName,
          token: FBtoken
        });
        let err = "Welcome, " + user.displayName
        this.setState({err: err});

      helpers.sendToken(token).then(function() {
        console.log("We are back from the helpers call.");
      })
    })
    .catch(function(err) {
      console.log('Error occurred in push', err);
    })


    });

    promise
    .catch(e => {
      let err = e.message;
      console.log(err);
    });
  }

  sendPush(){
    const user = firebase.auth().currentUser;
    firebase.database().ref("users/"+user.uid).on("value", function(snapshot){
      const token = snapshot.val().token
      helpers.pushToken(token)
    })
  }

  subToTest(){
    const user = firebase.auth().currentUser;
    firebase.database().ref("users/"+user.uid).on("value", function(snapshot){
      const token = snapshot.val().token
      firebase.database().ref("testvillage/").push(token);
    })
  }

  constructor(props){
    super(props);

    this.state = {
      err: '',
      successful: ' ',
    };

    this.logout = this.logout.bind(this);
    this.google = this.google.bind(this);
    this.sendPush = this.sendPush.bind(this);
    this.subToTest = this.subToTest.bind(this);
  };


  render(){
    return(
      <div>

        <p>{this.state.err}</p>
        <p>{this.state.successful}</p>
        <button onClick={this.logout} id="logoutButton" className="hide">Log Out</button>
        <br />
        <button onClick={this.google} id="googleBtn">Login With Google</button>
        <br />
        <button onClick={this.sendPush}>Push Notification</button>
        <br />
        <button onClick={this.subToTest}>Sub To Test Village</button>
      </div>
    );
  }
}

export default Login;
