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
  TouchableOpacity,
  Platform
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
    arrayRecentMessage.sort(function (a, b) {
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
    let count = 1;
    let boolean = false;
    let lengthSnapshot = 0;
    let linsteningUser = this.itemRef.on("child_added", snapshot => {
      snapshot = snapshot.child("Information");
      const snapshotEmail = snapshot.child("Email").val();
      const snapshotPhoneNumber = snapshot.child("PhoneNumber").val();
      if (count == 1) {
        this.itemRef.once("value", snapshot => {
          lengthSnapshot = snapshot.numChildren();
        });
      }
      console.log(count);
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
        count = 1;
        this.itemRef.off("child_added", linsteningUser);
      }
      count++;
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
              style={styles.btn_search}
              onPress={() => {
                Keyboard.dismiss, this.searchUser();
              }}
            >
              <Text style={styles.button_search}>Tìm kiếm</Text>
            </TouchableOpacity>
            <Text style={styles.requests}>Lời mời kết bạn</Text>
          </View>
          <View style={[styles.containerBelow, { marginTop: "0%" }]}>
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
                  <View key={item.id} style={[styles.item, { justifyContent: 'space-between' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        source={{ uri: item.avatar }}
                        style={styles.avatar}
                      />
                      <Text style={styles.name}>{item.name}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        this.confirmFriend(item.id, item.key, index)}
                    >
                      <Image source={require('../img/iconcheck.png')} style={styles.icon} />
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
    padding: "3%",
    backgroundColor: "#FFF"
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: "1%",
    borderColor: "#939393",
    borderBottomWidth: 0.5,
    backgroundColor: "#fff"
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
        borderRadius: 50,
      }
    })
  },
  textState: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 17,
    color: 'rgba(0, 0, 0, 0.77)',
    borderWidth: 1,
    borderColor: "#939393",

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
    justifyContent: 'center',
    fontWeight: "700",
    fontSize: 18,
    color: "#fff"
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
  },
  btn_search: {
    backgroundColor: "#F74F4F",
    height: 50,
    justifyContent: 'center',
    borderRadius: 15
  },
  requests: {
    marginTop: "2%",
    textAlign: 'left',
    backgroundColor: "#E0E0E0",
    paddingLeft: 2,
    color: "#939393",
    fontSize: 14
  },
  icon: {
    width: 25,
    height: 25,
    alignItems: 'flex-end'
  }
});
export default FriendRequests;
