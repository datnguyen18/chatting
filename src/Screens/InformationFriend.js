//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackAndroid,
  TextInput,
  KeyboardAvoidingView,
  BackHandler
} from "react-native";
import { firebaseApp } from "../api/Firebase";
import RNFetchBlob from "react-native-fetch-blob";
import Toast, { DURATION } from "react-native-easy-toast";

var styleColorBackground = require("../components/color_background");

// create a component
class InformationFriend extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Thông tin",
    tabBarVisible: false,
    headerTitleStyle: {
      textAlign: "center",
      color: "#FFFFFF",
      alignSelf: "center",
      marginRight: "19%"
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
      coverPhoto: this.props.navigation.state.params.coverPhotoFriend,
      avatar: this.props.navigation.state.params.avatarFriend,
      name: this.props.navigation.state.params.nameFriend,
      email: this.props.navigation.state.params.emailFriend,
      id: this.props.navigation.state.params.idFriend,
      phoneNumber: this.props.navigation.state.params.phoneNumberFriend,
      birthDate:  this.props.navigation.state.params.birthDateFriend,
      sex: this.props.navigation.state.params.sexFriend,
    };
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.changeCoverPhoto()}>
          <Image
            source={{ uri: this.state.coverPhoto }}
            style={styles.coverPhoto}
          >
            <View style={styles.containerTextImage}>
              <TouchableOpacity onPress={() => this.changeAvatar()}>
                <Image
                  source={{ uri: this.state.avatar }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>
          </Image>
        </TouchableOpacity>
        <View style={styles.containerBelow}>
          <View style={styles.containerText}>
            <Text style={styles.textHeader}> Tên: </Text>
            <Text style={styles.textState}>{this.state.name}</Text>
          </View>
          <View
            style={{ borderBottomColor: "#757575", borderBottomWidth: 1 }}
          />
          <View style={styles.containerText}>
            <Text style={styles.textHeader}> Email: </Text>
            <Text style={styles.textState}>{this.state.email}</Text>
          </View>
          <View
            style={{ borderBottomColor: "#757575", borderBottomWidth: 1 }}
          />
          <View style={styles.containerText}>
            <Text style={styles.textHeader}> Số điện thoại: </Text>
            <Text style={styles.textState}>{this.state.phoneNumber}</Text>
          </View>
          <View
            style={{ borderBottomColor: "#757575", borderBottomWidth: 1 }}
          />
          <View style={styles.containerText}>
            <Text style={styles.textHeader}> Ngày sinh: </Text>
            <Text style={styles.textState}>{this.state.birthDate}</Text>
          </View>
          <View
            style={{ borderBottomColor: "#757575", borderBottomWidth: 1 }}
          />
          <View style={styles.containerText}>
            <Text style={styles.textHeader}> Giới tính: </Text>
            <Text style={styles.textState}>{this.state.sex}</Text>
          </View>
        </View>
        <Toast ref="toast" />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoOpenDrawer: {
    width: 17,
    height: 17,
    marginLeft: 15
  },
  avatar: {
    margin: "3%",
    width: 60,
    height: 60
  },
  coverPhoto: {
    width: "100%",
    height: 260
  },
  containerTextImage: {
    marginTop: "43%",
    marginLeft: "3%",
    width: 60,
    height: 60
  },
  textEditCoverPhoto: {
    position: "absolute",
    right: 0,
    bottom: 0,
    marginRight: "9%",
    marginBottom: "3%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  containerBelow: {
    marginTop: "1.6%",
    margin: "3%"
  },
  containerText: {
    flexDirection: "row"
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 21
  },
  textState: {
    fontSize: 21
  },
  touchable: {
    marginTop: "6%",
    padding: "3%"
  },
  button: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18
  }
});

//make this component available to the app
export default InformationFriend;
