//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { firebaseApp } from "../api/Firebase";

// create a component
class RoomMessage extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarVisible: false,
    title:
      `${navigation.state.params.childNameRoom}` +
      " " +
      `${navigation.state.params.nameRoom}`,
    headerTitleStyle: {
      textAlign: "center",
      color: "#FFFFFF",
      alignSelf: "center",
      marginRight: "16%"
    },
    headerTintColor: "#FFFFFF",
    headerStyle: {
      backgroundColor: "#F74F4F"
    }
  });

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref();
    this.state = {
      messages: [],
      major: this.props.navigation.state.params.majorRoom,
      child: this.props.navigation.state.params.childName
    };
  }

  componentWillMount() {
    this.itemRef
      .child("Room Chat")
      .child("Eastern International University")
      .child(this.state.major)
      .child(this.state.child)
      .child("Messages")
      .on("child_added", snapshot => {
        console.log(snapshot.val());
        var newPostKey = firebaseApp
          .database()
          .ref()
          .push().key;
        var i = 0;
        if (snapshot.val().Sender == global.userId) {
          i = 1;
        } else {
          i = 2;
        }
        this.itemRef
          .child("Users")
          .child(snapshot.val().Sender)
          .child("Information")
          .on("value", snapshot1 => {
            const messageArray = {
              _id: newPostKey,
              text: snapshot.val().Message,
              user: {
                _id: i,
                avatar: snapshot1.val().Avatar
              }
            };
            this.setState(previousState => ({
              messages: GiftedChat.append(previousState.messages, messageArray)
            }));
          });
      });
  }

  onSend(messages = []) {
    var newPostKey = firebaseApp
      .database()
      .ref()
      .push().key;

    this.itemRef
      .child("Room Chat")
      .child("Eastern International University")
      .child(this.state.major)
      .child(this.state.child)
      .child("Messages")
      .child(newPostKey)
      .set({
        Message: messages[0].text,
        Sender: global.userId,
        Time: new Date().toUTCString()
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1
        }}
      />
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

//make this component available to the app
export default RoomMessage;
