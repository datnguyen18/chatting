//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { firebaseApp } from "../api/Firebase";

// create a component
var path;
class Message extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    const params = state.params || {};
    return {
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
      },
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingConversationScreen", {
            idFriend: `${navigation.state.params.idFriend}`,
            avatarFriend: `${navigation.state.params.avatarFriend}`,
            coverPhotoFriend: `${navigation.state.params.coverPhotoFriend}`,
            nameFriend: `${navigation.state.params.nameFriend}`,
            phoneNumberFriend: `${navigation.state.params.phoneNumberFriend}`,
            sexFriend: `${navigation.state.params.sexFriend}`,
            birthDateFriend: `${navigation.state.params.birthDateFriend}`,
            emailFriend: `${navigation.state.params.emailFriend}`
          })}
        >
          <ImageBackground
            source={require("../img/Options.png")}
            style={styles.logoOpenOptions}
          />
        </TouchableOpacity>
      )
    }
  };

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref("Users");
    this.state = {
      messages: [],
      uId: this.props.navigation.state.params.idFriend,
      avatar: this.props.navigation.state.params.avatarFriend,
      background: '#E0E0E0',
      viewColor: '#E0E0E0'
    };
    const arraySortId = [];
    arraySortId[0] = global.userId;
    arraySortId[1] = this.state.uId;
    arraySortId.sort();
    path = arraySortId[0] + " and " + arraySortId[1];
    global.path = path;
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleButtonNext: this.state.background,
    });
  }

  componentWillMount() {
    this.props.navigation.setParams({
      handleButtonNext: this.state.background,
    });
    this.itemRef
      .child(global.userId)
      .child("Messages")
      .child(path)
      .on("value", snapshot => {
        if (snapshot.hasChild("Background")) {
          this.setState({ background: snapshot.child("Background").val().URL });
          global.imageBackgroundConversation = snapshot.child("Background").val().URL;
        } else {
          global.imageBackgroundConversation = "https://firebasestorage.googleapis.com/v0/b/eiu-chatting-c99ce.appspot.com/o/Users%2FDefaultBackgroundRoomChat%2FDefault.png?alt=media&token=2139129c-6579-411b-b1b9-9e8da7bebc67";
        }
        if (snapshot.hasChild("Color")) {
          this.setState({ viewColor: snapshot.child("Color").val().URL });
          global.colorConversation = snapshot.child("Color").val().URL;
        } else {
          global.colorConversation = '#E0E0E0';
        }
      });
    this.itemRef
      .child(global.userId)
      .child("Messages")
      .child(path)
      .child("Message")
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
      .child(user.uid)
      .child("Messages")
      .child(path).child("Message")
      .child(newPostKey)
      .set({
        Message: messages[0].text,
        Sender: global.userId,
        Time: new Date().toUTCString()
      });

    this.itemRef
      .child(this.state.uId)
      .child("Messages")
      .child(path).child("Message")
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

  renderMessageImage(props) {
    return (
      <View style={{ backgroundColor: "#F74F4F" }}></View>
    );
  }

  // renderFooter(props) {
  //   // if (this.state.typingText) {
  //   return (
  //     <View style={styles.footerContainer}>
  //       <Text style={styles.footerText}>
  //       </Text>
  //     </View>
  //   );
  //   // }
  //   return null;
  // }

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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={{ uri: this.state.background }}
          style={{ flex: 1 }}
        >
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1
            }}
            // renderFooter={this.renderFooter}
            renderMessageImage={this.renderCustomView}
            renderBubble={this.renderBubble}
          />
        </ImageBackground>
      </TouchableWithoutFeedback >
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoOpenOptions: {
    width: 35,
    height: 35,
    marginRight: 15
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

//make this component available to the app
export default Message;
