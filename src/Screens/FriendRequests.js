import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, { DURATION } from "react-native-easy-toast";
import { firebaseApp } from "../api/Firebase";

var styleColorBackground = require("../components/color_background");

export class FriendRequests extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Kết bạn",
    tabBarVisible: false,
    headerTitleStyle: {
      textAlign: "center",
      alignSelf: "center",
      color: "#FFFFFF",
      marginRight: "15%"
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
      friends: [],
      searchInput: ""
    };
  }

  componentWillMount() {
    const arrayNameFriends = [];
    this.itemRef
      .child(global.userId)
      .child("Friend Requests")
      .on("child_added", snapshot => {
        this.itemRef
          .child(snapshot.val().UID)
          .child("Information")
          .on("value", snapshot1 => {
            arrayNameFriends.push({
              name: snapshot1.val().Name,
              id: snapshot.val().UID,
              avatar: snapshot1.val().Avatar,
              key: snapshot.val().Key,
              coverPhoto: snapshot1.val().CoverPhoto
            });
            this.sortDate(arrayNameFriends);
            this.loadIdFriends(arrayNameFriends);
          });
      });
  }

  sortDate(arrayRecentMessage) {
    arrayRecentMessage.sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  loadIdFriends(arrayNameFriends) {
    this.setState({
      friends: arrayNameFriends
    });
  }

  searchUser() {
    this.setState({
      visible: !this.state.visible
    });
    var count = 0;
    var boolean = false;
    this.itemRef.on("child_added", snapshot => {
      snapshot = snapshot.child("Information");
      const snapshotEmail = snapshot.child("Email").val();
      const snapshotPhoneNumber = snapshot.child("PhoneNumber").val();
      var lengthSnapshot;
      if (count == 0) {
        this.itemRef.once("value", snapshot => {
          lengthSnapshot = snapshot.numChildren();
        });
      }
      count++;
      if (
        snapshotEmail == this.state.searchInput ||
        snapshotPhoneNumber == this.state.searchInput
      ) {
        const snapshotName = snapshot.child("Name").val();
        const snapshotAvatar = snapshot.child("Avatar").val();
        const snapshotId = snapshot.child("ID").val();
        const snapshotCoverPhoto = snapshot.child("CoverPhoto").val();
        const snapshotSex = snapshot.child("Sex").val();
        const snapshotBirthDate = snapshot.child("BirthDate").val();

        this.setState({
          visible: false
        });
        boolean = true;
        this.props.navigation.navigate("WallFriendsScreen", {
          idFriend: snapshotId,
          nameFriend: snapshotName,
          avatarFriend: snapshotAvatar,
          coverPhotoFriend: snapshotCoverPhoto,
          phoneNumberFriend: snapshotPhoneNumber,
          sexFriend: snapshotSex,
          birthDateFriend: snapshotBirthDate,
          emailFriend: snapshotEmail
        });
      }
      if (lengthSnapshot == count && boolean == false) {
        this.refs.toast.show("Người dùng không tồn tại!");
        this.setState({
          visible: false
        });
        count = 0;
      }
    });
  }

  confirmFriend(id, key, index) {
    this.setState({
      friends: this.deleteByValue(this.state.friends, index)
    });
    var newPostKey = firebaseApp
      .database()
      .ref()
      .push().key;
    this.itemRef
      .child(global.userId)
      .child("Friends")
      .child(newPostKey)
      .set({ UID: id });
    this.itemRef
      .child(global.userId)
      .child("Friend Requests")
      .child(key)
      .remove();
    this.itemRef
      .child(id)
      .child("Friends")
      .child(newPostKey)
      .set({ UID: global.userId });
  }

  deleteByValue(array, index) {
    delete array[index];
    return array;
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Spinner
            visible={this.state.visible}
            textContent={"Đang xử lý..."}
            textStyle={{ color: "#FFF" }}
          />
          <View style={styles.containerBelow}>
              <TextInput
                style={styles.textState}
                placeholder="Nhập email hoặc số điện thoại"
                placeholderTextColor="#616161"
                returnKeyType="go"
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={() => this.searchUser()}
                onChangeText={searchInput => this.setState({ searchInput })}
              >
              </TextInput>

            <TouchableOpacity
              style={[
                styles.button_container,
                styleColorBackground.button_color
              ]}
              onPress={() => {
                Keyboard.dismiss, this.searchUser();
              }}
            >
              <Text style={styles.button_search}>Tìm kiếm</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.containerBelow}>
            <ScrollView>
              {this.state.friends.map((item, index) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("WallFriendsScreen", {
                      idFriend: item.id,
                      nameFriend: item.name,
                      avatarFriend: item.avatar,
                      coverPhotoFriend: item.coverPhoto
                    })}
                >
                  <View key={item.id} style={styles.item}>
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.avatar}
                    />
                    <Text style={styles.name}>{item.name}</Text>
                    <TouchableOpacity
                      style={[styles.buttonConfirmFriendContainer]}
                      onPress={() =>
                        this.confirmFriend(item.id, item.key, index)}
                    >
                      <Text style={styles.button_search}>Đồng ý</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <Toast ref="toast" />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
    backgroundColor: "transparent"
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: "1%",
    borderColor: "#2a4944",
    borderWidth: 1,
    backgroundColor: "#d2f7f1"
  },
  avatar: {
    marginLeft: "3%",
    width: 60,
    height: 60,
    borderRadius: 50
  },
  textState: {
    backgroundColor: "rgba(255,255,255,250)"
  },
  name: {
    margin: "6%"
  },
  button_container: {
    marginTop: "3%",
    padding: "2.5%"
  },
  button_search: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18
  },
  containerBelow: {
    marginTop: "3%"
  },
  buttonConfirmFriendContainer: {
    backgroundColor: "#4DB6AC",
    padding: "1%",
    paddingLeft: "6%",
    paddingRight: "6%",
    borderRadius: 50,
    marginLeft: "30%"
  }
});
export default FriendRequests;
