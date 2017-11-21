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
  BackHandler,
  ImageBackground
} from "react-native";
import { firebaseApp } from "../api/Firebase";
import RNFetchBlob from "react-native-fetch-blob";
import Toast, { DURATION } from "react-native-easy-toast";

const BackButton = props => (
  <TouchableOpacity onPress={() => props.navigation.navigate("Tabbar")}>
    <Image
      source={require("../img/BackButton.png")}
      style={styles.logoOpenDrawer}
    />
  </TouchableOpacity>
);

var ImagePicker = require("react-native-image-picker");
var styleColorBackground = require("../components/color_background");
const polyfill = RNFetchBlob.polyfill;

window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;
// More info on all the options is below in the README...just some common use cases shown here
var options = {
  title: "Chọn ảnh từ:",
  quality: 0.6,
  storageOptions: {
  skipBackup: true,
  path: 'images'
  }
};
// create a component
class InformationUser extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Thông tin",
    headerLeft: <BackButton navigation={navigation} />,
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
      coverPhoto: global.userCoverPhoto,
      avatar: global.userAvatar,
      name: global.userName,
      email: global.userEmail,
      id: global.userId,
      phoneNumber: global.userPhoneNumber,
      birthDate: global.userBirthDate,
      sex: global.userSex,
      password: global.userPassword
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.navigate("InformationUser");
    return true;
  }

  changeCoverPhoto() {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        let source = { uri: response.uri };
        let path = response.path;
        Blob.build(RNFetchBlob.wrap(path), { type: "image/jpeg" })
          .then(blob =>
            firebaseApp
              .storage()
              .ref("Users")
              .child(this.state.id)
              .child("CoverPhoto")
              .child("CoverPhoto")
              .put(blob, { contentType: "image/png" })
          )
          .then(snapshot => {
            this.itemRef
              .child(user.uid)
              .child("Information")
              .set({
                Avatar: this.state.avatar,
                CoverPhoto: snapshot.downloadURL,
                Email: this.state.email,
                Name: this.state.name,
                PhoneNumber: this.state.phoneNumber,
                BirthDate: this.state.birthDate,
                Sex: this.state.sex,
                Password: this.state.password
              });
            this.refs.toast.show("Thay đổi ảnh bìa thành công!");
          });
      }
    });
  }

  changeAvatar() {
    ImagePicker.showImagePicker(options, response => {
      let source = { uri: response.uri };
      let path = response.path;
      console.log(source + "" + path)
      Blob.build(RNFetchBlob.wrap(path), { type: "image/jpeg" })
        .then(blob =>
          firebaseApp
            .storage()
            .ref("Users")
            .child(this.state.id)
            .child("Avatar")
            .child("Avatar")
            .put(blob, { contentType: "image/png" })
        )
        .then(snapshot => {
          this.itemRef
            .child(user.uid)
            .child("Information")
            .set({
              Avatar: snapshot.downloadURL,
              CoverPhoto: this.state.coverPhoto,
              Email: this.state.email,
              Name: this.state.name,
              PhoneNumber: this.state.phoneNumber,
              BirthDate: this.state.birthDate,
              Sex: this.state.sex,
              Password: this.state.password
            });
          this.refs.toast.show("Thay đổi ảnh đại diện thành công!");
        });
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.changeCoverPhoto()}>
          <ImageBackground
            source={{ uri: this.state.coverPhoto }}
            style={styles.coverPhoto}
          >
            <Text style={styles.textEditCoverPhoto}>Cập nhật ảnh bìa</Text>
            <Image
              source={require("../img/Edit.png")}
              style={styles.editImage}
            />
            <View style={styles.containerTextImage}>
              <TouchableOpacity onPress={() => this.changeAvatar()}>
                <ImageBackground
                  source={{ uri: this.state.avatar }}
                  style={styles.avatar}
                >
                  <Image
                    source={require("../img/Edit.png")}
                    style={styles.editImage}
                  />
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </ImageBackground>
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
          <TouchableOpacity
            style={[styles.touchable, styleColorBackground.button_color]}
            onPress={() => {
              navigate("ChangeInformationUserScreen");
            }}
          >
            <Text style={styles.button}>Đổi thông tin</Text>
          </TouchableOpacity>
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
  editImage: {
    width: 15,
    height: 15,
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: "3%"
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
export default InformationUser;
