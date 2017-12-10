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
  ImageBackground,
  Platform
} from "react-native";
import { firebaseApp } from "../api/Firebase";
import RNFetchBlob from "react-native-fetch-blob";
import Toast, { DURATION } from "react-native-easy-toast";

const BackButton = props => (
  <TouchableOpacity onPress={() => props.navigation.navigate("MainTabScreen")}>
    <Image
      source={require("../img/BackButton.png")}
      style={styles.logoBackButton}
    />
  </TouchableOpacity>
);

const ImagePicker = require("react-native-image-picker");
const styleColorBackground = require("../components/color_background");
const polyfill = RNFetchBlob.polyfill;
const fs = RNFetchBlob.fs;
const Blob = RNFetchBlob.polyfill.Blob

window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;
// More info on all the options is below in the README...just some common use cases shown here
const options = {
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
      backgroundColor: "#F74F4F"
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

  uploadCover = (uri, mime = 'image/jpg') => {
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      let uploadBlob = null
      const imageRef = firebaseApp.storage()
        .ref('Users')
        .child(this.state.id)
        .child("CoverPhoto")
        .child("CoverPhoto")
      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          // console.log(data)
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          console.log(blob)
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  uploadAvatar = (uri, mime = 'image/jpg') => {
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      let uploadBlob = null
      const imageRef = firebaseApp.storage()
        .ref('Users')
        .child(this.state.id)
        .child("Avatar")
        .child("Avatar")
      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          console.log(blob)
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          reject(error)
        })
    })
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
        this.uploadCover(response.uri)
          .then(url => {
            this.itemRef
              .child(user.uid)
              .child("Information")
              .set({
                Avatar: this.state.avatar,
                CoverPhoto: url,
                Email: this.state.email,
                Name: this.state.name,
                ID: this.state.id,
                PhoneNumber: this.state.phoneNumber,
                BirthDate: this.state.birthDate,
                Sex: this.state.sex,
                Password: this.state.password
              })
            this.setState({
              coverPhoto: url
            });
            global.userCoverPhoto = this.state.coverPhoto;
          })
          .then(error => console.log(error))
      }
    });
  }



  changeAvatar() {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        this.uploadAvatar(response.uri)
          .then(url => {
            this.itemRef
              .child(user.uid)
              .child("Information")
              .set({
                Avatar: url,
                CoverPhoto: this.state.coverPhoto,
                Email: this.state.email,
                Name: this.state.name,
                ID: this.state.id,
                PhoneNumber: this.state.phoneNumber,
                BirthDate: this.state.birthDate,
                Sex: this.state.sex,
                Password: this.state.password
              })
            this.setState({
              avatar: url
            });
            global.userAvatar = this.state.avatar;

          })
          .then(error => console.log(error))
      }
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
                <Image
                  source={{ uri: this.state.avatar }}
                  style={styles.avatar}
                >
                </Image>
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
              style={styles.line}
          />
          <View style={styles.containerText}>
            <Text style={styles.textHeader}> Email: </Text>
            <Text style={styles.textState}>{this.state.email}</Text>
          </View>
          <View
              style={styles.line}
          />
          <View style={styles.containerText}>
            <Text style={styles.textHeader}> Số điện thoại: </Text>
            <Text style={styles.textState}>{this.state.phoneNumber}</Text>
          </View>
          <View
              style={styles.line}
          />
          <View style={styles.containerText}>
            <Text style={styles.textHeader}> Ngày sinh: </Text>
            <Text style={styles.textState}>{this.state.birthDate}</Text>
          </View>
          <View
            style={styles.line}
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
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  line: {
    borderColor: "#E0E0E0",
    borderWidth: 1
  },
  logoBackButton: {
    width: 17,
    height: 17,
    marginLeft: 15
  },
  avatar: {
    width: 60,
    height: 60,
    ...Platform.select({
      ios: {
        borderRadius: 30.5
      },
      android: {
        borderRadius: 55
      }
    })
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
    width: 5,
    height: 5,
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
    color: "#FFFFFF",
    backgroundColor: 'transparent',
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
    padding: "3%",
    borderRadius: 15,
  },
  button: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18
  }
});

//make this component available to the app
export default InformationUser;
