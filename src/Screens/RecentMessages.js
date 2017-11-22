//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackAndroid,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform
} from "react-native";
import { firebaseApp } from "../api/Firebase";

// create a component
class RecentMessages extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
        <Image
          source={require("../img/NavigatorIcon.png")}
          style={styles.logoOpenDrawer}
        />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate("NewMessageScreen")}
      >
        <Image
          source={require("../img/NewMessage.png")}
          style={styles.logoOpenNewMessage}
        />
      </TouchableOpacity>
    ),
    title: "Tin nhắn",
    headerTintColor: "#FFFFFF",
    headerTitleStyle: {
      textAlign: "center",
      alignSelf: "center",
      color: "#FFFFFF"
    },
    headerStyle: {
      backgroundColor: "#F74F4F"
    },
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require("../img/Message.png")}
        style={[styles.logoMessage]}
      ></Image>
    )
  });

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref("Users");
    this.state = {
      recentMessages: []
    };
  }

  componentDidMount() {
    BackAndroid.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  componentWillMount() {
    this.itemRef.child(global.userId).on("value", snapshot => {
      if (snapshot.hasChild("RecentMessages")) {
        const arrayRecentMessage = [];
        snapshot = snapshot.child("RecentMessages");
        const snapshotKey = Object.keys(snapshot.val());
        for (var key in snapshotKey) {
          const element = snapshot.child(snapshotKey[key]);
          this.itemRef
            .child(element.val().Sender)
            .child("Information")
            .on("value", snapshot1 => {
              arrayRecentMessage.push({
                name: snapshot1.val().Name,
                avatar: snapshot1.val().Avatar,
                id: element.val().Sender,
                message: element.val().Message,
                date: element.val().Time
              });
              this.sortDate(arrayRecentMessage);
              this.loadRecentMessages(arrayRecentMessage);
            });
        }
      }
    });
  }

  sortDate(arrayRecentMessage) {
    arrayRecentMessage.sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  loadRecentMessages(arrayNameFriends) {
    this.setState({
      recentMessages: arrayNameFriends
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.state.recentMessages.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("MessageScreen", {
                  idFriend: item.id,
                  nameFriend: item.name,
                  avatarFriend: item.avatar
                })}
            >
              <View key={item.id} style={styles.item}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.text}>
                  <Text>{item.name}</Text>
                  <Text>{item.message}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ffffff'
  },
  item: {
    marginLeft:"2.5%",
    marginRight:"2.5%",
    marginTop:8,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2a4944",
    borderWidth: 1,
    backgroundColor: "transparent",
    borderRadius:5,
    borderColor:"#979797",
    borderWidth: 0.3
    
  },
  text: {
    margin: "5%"
  },
  avatar: {
    marginLeft: "3%",
    width: 60,
    height: 60,
    
    ...Platform.select({
      ios: {
        borderRadius: 30
      },
      android: {
        borderRadius: 50
      }
    })
  },
  logoOpenDrawer: {
    width: 30,
    height: 30,
    marginLeft: 15
  },
  logoOpenNewMessage: {
    width: 35,
    height: 35,
    marginRight: 15
  },
  logoMessage:{
    width: 24,
    height: 24,
  }
});

//make this component available to the app
export default RecentMessages;
