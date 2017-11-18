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
  Image
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
            <View>
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
                style={[
                  styles.button_container,
                  styleColorBackground.button_color
                ]}
                onPress={() => this.confirmLogin()}
              >
                <Text style={styles.button_login}>Đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigate("RegisterScreen");
                }}
              >
                <Text style={styles.button_register}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Toast ref="toast" />
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
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    height: 45,
    backgroundColor: "#4DB6AC",
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 17
  },
  button_container: {
    padding: 10
  },
  button_login: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18
  },
  button_register: {
    marginTop: 6,
    textAlign: "center",
    justifyContent: "center",
    color: "#4DB6AC",
    position: "relative"
  }
});
//make this component available to the app
export default Login;
