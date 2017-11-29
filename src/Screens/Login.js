//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  StatusBar,
  AppRegistry,
  Image,
  Platform,
  ImageBackground
} from "react-native";
import { firebaseApp } from "../api/Firebase";
import Spinner from "react-native-loading-spinner-overlay";
import Toast, { DURATION } from "react-native-easy-toast";

var styleColorBackground = require("../components/color_background");
// create a component
class Login extends Component {
  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref("Users");
    this.state = {
      // email: Platform.OS === 'ios' ? "admin@echat.com" : "ntd180295@echat.com",
      // password: Platform.OS === 'ios' ? "admin123" : "123456",
      email: "admin@echat.com",
      password: "admin123",
      visible: false
    };
  }

  confirmLogin() {
    this.setState({
      visible: !this.state.visible
    });
    firebaseApp
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        user = firebaseApp.auth().currentUser;
        global.userId = user.uid;
        this.itemRef
          .child(user.uid)
          .child("Information")
          .on("value", snapshot => {
            global.userName = snapshot.val().Name;
            global.userEmail = snapshot.val().Email;
            global.userAvatar = snapshot.val().Avatar;
            global.userCoverPhoto = snapshot.val().CoverPhoto;
            global.userPhoneNumber = snapshot.val().PhoneNumber;
            global.userBirthDate = snapshot.val().BirthDate;
            global.userSex = snapshot.val().Sex;
            global.userPassword = snapshot.val().Password;
            this.props.navigation.navigate("MainTabScreen");
          });
        this.setState({
          visible: false
        });
      })
      .catch(error => {
        this.setState({
          visible: false
        });
        this.refs.toast.show("Đăng nhập thất bại!");
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <ImageBackground source={require('../img/backgroundLogin.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
              <View style={styles.containerLogo}>
                <Image
                  source={require("../img/login_logo/logo.png")}
                  style={styles.logo_container}
                />
              </View>
              <Spinner
                visible={this.state.visible}
                textContent={"Đang xử lý..."}
                textStyle={{ color: "#FFF" }}
              />
              <View style={styles.bottomPart}>
                <StatusBar barStyle="light-content" />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  underlineColorAndroid="transparent"
                  placeholderTextColor="rgba(255,255,255,255)"
                  returnKeyType="next"
                  onSubmitEditing={() => this.passwordInput.focus()}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={email => this.setState({ email })}
                  value={this.state.email}
                />
                <TextInput
                  style={styles.input}
                  placeholder="***********"
                  underlineColorAndroid="transparent"
                  placeholderTextColor="rgba(255,255,255,255)"
                  returnKeyType="go"
                  ref={input => (this.passwordInput = input)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                  onSubmitEditing={() => this.confirmLogin()}
                />
                <TouchableOpacity
                  onPress={() => this.confirmLogin()}
                >
                  <View style={styles.buttonLogin}>
                    <Text style={styles.button_login}>Đăng nhập</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigate("RegisterScreen");
                  }}
                >
                  <Text style={styles.button_register}>Đăng ký</Text>
                </TouchableOpacity>
              </View>

              <Toast ref="toast" />
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerLogo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  logo_container: {
    width: 210,
    height: 185
  },
  bottomPart: {
    flex: 1,
    marginLeft: 33,
    marginRight: 33
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.77)'
  },
  button_container: {
    padding: 10
  },
  button_login: {
    fontSize: 18,
    color: "#FFFFFF"

  },
  button_register: {
    marginTop: 15,
    textAlign: "center",
    justifyContent: "center",
    backgroundColor: 'transparent',
    color: "rgba(255, 255, 255, 0.77)",
    position: "relative"
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: null,
    height: null
  },
  buttonLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(247, 79, 79, 70)',
    height: 45,
    borderRadius: 15
  }

});
//make this component available to the app
export default Login;
