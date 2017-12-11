//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  BackHandler
} from "react-native";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import { firebaseApp } from "../api/Firebase";

// create a component
class RoomMessage extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarVisible: false,
    title:
      // `${navigation.state.params.childNameRoom}` +
      // " " +
      `${navigation.state.params.nameRoom}`,
    headerTitleStyle: {
      textAlign: "center",
      color: "#FFFFFF",
      alignSelf: "center"
    },
    headerTintColor: "#FFFFFF",
    headerStyle: {
      backgroundColor: "#F74F4F"
    },
    headerRight: (
      <TouchableOpacity 
        onPress={() => navigation.navigate("ListUserRoomChatScreen", {
          childNameRoom: `${navigation.state.params.childNameRoom}`,
          childName: `${navigation.state.params.childName}`,
          majorRoom: `${navigation.state.params.majorRoom}`,
        })}
      >
        <ImageBackground
          source={require("../img/Options.png")}
          style={styles.logoOpenListUser}
        />
      </TouchableOpacity>
    ),
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
    const newPostKey = firebaseApp
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

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#F74F4F",
          }
        }}
      />
    );
  }

  renderSend(props) {
    return (
      <Send
        {...props}
      >
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <ImageBackground source={require('../img/SendMessage.png')} resizeMode={'center'} style={{ width: 40, height: 40 }} />
        </View>
      </Send>
    );
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
        placeholder="Nhập tin nhắn..."
        renderMessageImage={this.renderCustomView}
        renderBubble={this.renderBubble}
        renderSend={this.renderSend}
      />
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoOpenListUser: {
    width: 35,
    height: 35,
    marginRight: 15
  }
});

//make this component available to the app
export default RoomMessage;
