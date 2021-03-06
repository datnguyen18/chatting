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
let path;
let pathSender;
class GroupChat extends Component {
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
      backgroundColor: "#F74F4F"
    }
  });

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref("Users");
    this.state = {
      messages: [],
      listFriendsChat: this.props.navigation.state.params.listFriendsChat
    };
    const arraySortId = [];
    arraySortId[0] = global.userId;
    for (i = 1; i <= this.state.listFriendsChat.length; i++) {
      arraySortId[i] = this.state.listFriendsChat[i - 1];
    }
    arraySortId.sort();
    for (i = 0; i < arraySortId[i].length; i++) {
      path = arraySortId[i];
      if (arraySortId[i] != global.userId) {
        pathSender += arraySortId[i];
      }
      if (i < arraySortId[i].length - 1) {
        path += " and ";
        pathSender += " ";
      }
    }
  }

  componentWillMount() {
    this.itemRef
      .child(global.userId)
      .child("Messages")
      .child(path)
      .on("child_added", snapshot => {
        const newPostKey = firebaseApp
          .database()
          .ref()
          .push().key;
        let i = 0;
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
    const newPostKey = firebaseApp
      .database()
      .ref()
      .push().key;

    this.itemRef
      .child(global.userId)
      .child("Messages")
      .child(path)
      .child(newPostKey)
      .set({
        Message: messages[0].text,
        Sender: global.userId,
        Time: new Date().toUTCString()
      });

    for (i = 0; i < this.state.listFriendsChat.length; i++) {
      this.itemRef
        .child(this.state.listFriendsChat[i])
        .child("Messages")
        .child(path)
        .child(newPostKey)
        .set({
          Message: messages[0].text,
          Sender: global.userId,
          Time: new Date().toUTCString()
        });
    }

    this.itemRef
      .child(global.userId)
      .child("RecentMessages")
      .child(path)
      .set({
        Message: messages[0].text,
        Sender: pathSender,
        Time: new Date().toUTCString()
      });

    for (i = 0; i < this.state.listFriendsChat.length; i++) {
      this.itemRef
        .child(this.state.listFriendsChat[i])
        .child("RecentMessages")
        .child(path)
        .set({
          Message: messages[0].text,
          Sender: pathSender,
          Time: new Date().toUTCString()
        });
    }
    // this.setState((previousState) => ({
    //     messages: GiftedChat.append(previousState.messages, messages),
    // }));
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
export default GroupChat;
