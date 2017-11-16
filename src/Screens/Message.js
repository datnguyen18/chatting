//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { firebaseApp } from "../api/Firebase";

// create a component
var path;
class Message extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarVisible: false,
    title: `${navigation.state.params.nameFriend}`,
    headerTitleStyle: {
      textAlign: "center",
      color: "#FFFFFF",
      alignSelf: "center"
    },
    headerTintColor: "#FFFFFF",
    headerStyle: {
      backgroundColor: "#009688"
    }
  });

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref("Users");
    this.state = {
      messages: [],
      uId: this.props.navigation.state.params.idFriend,
      avatar: this.props.navigation.state.params.avatarFriend
    };
    const arraySortId = [];
    arraySortId[0] = global.userId;
    arraySortId[1] = this.state.uId;
    arraySortId.sort();
    path = arraySortId[0] + " and " + arraySortId[1];
  }

  componentWillMount() {
    this.itemRef
      .child(global.userId)
      .child("Messages")
      .child(path)
      .on("child_added", snapshot => {
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
        const messageArray = {
          _id: newPostKey,
          text: snapshot.val().Message,
          user: {
            _id: i,
            avatar: this.state.avatar
          }
        };
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messageArray)
        }));
      });
  }

  onSend(messages = []) {
    var newPostKey = firebaseApp
      .database()
      .ref()
      .push().key;
    this.itemRef
      .child(user.uid)
      .child("Messages")
      .child(path)
      .child(newPostKey)
      .set({
        Message: messages[0].text,
        Sender: global.userId,
        Time: new Date().toUTCString()
      });
    this.itemRef
      .child(this.state.uId)
      .child("Messages")
      .child(path)
      .child(newPostKey)
      .set({
        Message: messages[0].text,
        Sender: global.userId,
        Time: new Date().toUTCString()
      });

    this.itemRef
      .child(user.uid)
      .child("RecentMessages")
      .child(path)
      .set({
        Message: messages[0].text,
        Sender: this.state.uId,
        Time: new Date().toUTCString()
      });
    this.itemRef
      .child(this.state.uId)
      .child("RecentMessages")
      .child(path)
      .set({
        Message: messages[0].text,
        Sender: user.uid,
        Time: new Date().toUTCString()
      });
    // this.setState((previousState) => ({
    //     messages: GiftedChat.append(previousState.messages, messages),
    // }));
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1
          }}
        />
      </TouchableWithoutFeedback>
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
export default Message;
