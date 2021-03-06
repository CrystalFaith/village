import React, { Component } from 'react';
import firebase from 'firebase';
import helpers from "./utils/helpers";

class Login extends Component {



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
      firebase.database().ref("testvillage/").push({
       token: token
      });
    })
  }

  pullData(){
    firebase.database().ref("testvillage/").once("value", function(snapshot){
      let tokenArray = [];
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val().token;
        helpers.pushToken(item);
        console.log(item);
        tokenArray.push(item);

    })
      console.log(tokenArray)

    })
  }

  setSearch(search){
    this.setState({ search: search })
  }

  searchFirebase(search){
    var self = this;
    const user = firebase.auth().currentUser;
    firebase.database().ref("users/"+user.uid).on("value", function(snapshot){
      const token = snapshot.val().token
      console.log(token);


      let searchTerm = search.trim();
      return firebase.database().ref('/users/' + searchTerm + "/village").once('value', function(snapshot) {
      console.log(snapshot.val())
        if(snapshot.val() != null){
          let villageName = "You found " + snapshot.val().title;
          self.setState({
            villageName: villageName,
            userToken: token,
            userSearch: searchTerm,
           });
        }else{
          self.setState({ villageName: "Sorry, no Villages found"})
        }
      });
    })
  }

  addToken(){
    console.log(this.state.userToken)
    console.log(this.state.userSearch)
    let searchTerm = this.state.userSearch;
    let token = this.state.userToken;
    firebase.database().ref('/users/' + searchTerm + "/village/tokens").push(token);
  }



  constructor(props){
    super(props);

    this.state = {
      err: '',
      successful: ' ',
      search: ' ',
      villageName: ' ',
      userToken: ' ',
      userSearch: ' ',
    };

    this.sendPush       = this.sendPush.bind(this);
    this.subToTest      = this.subToTest.bind(this);
    this.pullData       = this.pullData.bind(this);
    this.setSearch      = this.setSearch.bind(this);
    this.searchFirebase = this.searchFirebase.bind(this);
    this.addToken       = this.addToken.bind(this);
    // this.pushToMyVillage= this.pushToMyVillage.bind(this);
  };


  render(){

    return(
      <div id="loginDiv">




        <br />
        <br />
        <button onClick={this.subToTest} className="waves-effect waves-light btn #e53935 red darken-1">Sub To Test Village</button>
        {/* <button onClick={this.sendPush}>Push Notification</button>
        <br />
        <br />
        <button onClick={this.pullData}>Send Push to TestVillage</button>
        <br />
        <br />
        <p>{this.state.villageName}</p>
        <Search setSearch={this.setSearch} searchFirebase={this.searchFirebase}/>
        <br />
        <br /> */}

      </div>
    );
  }
}

export default Login;
