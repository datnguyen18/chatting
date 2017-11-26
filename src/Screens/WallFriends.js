import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { firebaseApp } from "../api/Firebase";
import Toast, { DURATION } from "react-native-easy-toast";

export default class componentName extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarVisible: false,
    headerRight: (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("InformationFriendScreen", {
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
        <Image
          source={require("../img/MenuInformation.png")}
          style={styles.logoOpenInformationFriend}
        />
      </TouchableOpacity>
    ),
    title: "Trang cá nhân",
    color: "#FFFFFF",
    headerTintColor: "#FFFFFF",
    headerTitleStyle: { textAlign: "center", alignSelf: "center" },
    headerStyle: {
      backgroundColor: "#F74F4F"
    }
  });

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref("Users");
    this.state = {
      id: this.props.navigation.state.params.idFriend,
      avatar: this.props.navigation.state.params.avatarFriend,
      coverPhoto: this.props.navigation.state.params.coverPhotoFriend,
      name: this.props.navigation.state.params.nameFriend,
      visible: false
    };
  }

  sendFriendRequest() {
    var newPostKey = firebaseApp
      .database()
      .ref()
      .push().key;
    this.itemRef
      .child(this.state.id)
      .child("Friend Requests")
      .child(newPostKey)
      .set({ UID: global.userId, Key: newPostKey });
    this.refs.toast.show("Gửi lời mời kết bạn thành công");
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Spinner
          visible={this.state.visible}
          textContent={"Đang xử lý..."}
          textStyle={{ color: "#FFF" }}
        />
        <ImageBackground
          source={{ uri: this.state.coverPhoto }}
          style={styles.coverPhoto}
        >
          <View style={styles.containerTextImage}>
            <Image source={{ uri: this.state.avatar }} style={styles.avatar} />
            <Text style={styles.nameCss}>{this.state.name}</Text>
          </View>
        </ImageBackground>
        <View style={styles.item}>
          <TouchableOpacity
            style={[styles.buttonConfirmFriendContainer]}
            onPress={() =>
              this.props.navigation.navigate("MessageScreen", {
                idFriend: this.state.id,
                avatarFriend: this.state.avatar,
                nameFriend: this.props.navigation.state.params.nameFriend
              })}
          >
            <Text style={styles.button_search}>Nhắn tin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonConfirmFriendContainer]}
            onPress={() => this.sendFriendRequest()}
          >
            <Text style={styles.button_search}>Kết bạn</Text>
          </TouchableOpacity>
        </View>
        <Toast ref="toast" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  button_container: {
    padding: 10
  },
  button_search: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: "3%"
  },
  avatar: {
    margin: "3%",
    marginLeft: "3%",
    width: 60,
    height: 60
  },
  coverPhoto: {
    width: "100%",
    height: 260
  },
  containerTextImage: {
    marginTop: "43%",
    marginLeft: "9%",
    height: 60,
    width: "30%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonConfirmFriendContainer: {
    backgroundColor: "#F74F4F",
    padding: "1%",
    paddingLeft: "6%",
    paddingRight: "6%",
    borderRadius: 50,
    marginLeft: "9%",
    marginRight: "9%",
    paddingHorizontal: 10
  },
  nameCss: {
    marginLeft: "10%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: 'transparent'
  },
  logoOpenInformationFriend: {
    width: 35,
    height: 35,
    marginRight: 15
  }
});
