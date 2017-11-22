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
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  BackHandler
} from "react-native";
import { firebaseApp } from "../api/Firebase";
import DatePicker from "react-native-datepicker";
import Spinner from "react-native-loading-spinner-overlay";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
import Toast, { DURATION } from "react-native-easy-toast";

var radio_props = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" }
];
const BackButton = props => (
  <TouchableOpacity
    onPress={() => props.navigation.navigate("InformationUser")}
  >
    <Image
      source={require("../img/BackButton.png")}
      style={styles.logoBackButton}
    />
  </TouchableOpacity>
);
var styleColorBackground = require("../components/color_background");
const sexInt = 0;
// create a component
class InformationUser extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Thay đổi thông tin",
    headerLeft: <BackButton navigation={navigation} />,
    headerTitleStyle: {
      textAlign: "center",
      alignSelf: "center",
      color: "#FFFFFF",
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
      oldPassword: global.userPassword,
      oldPasswordInput: "",
      newPassword: "",
      reNewPassword: "",
      visible: false
    };
    if (this.state.sex == "Nam") {
      sexInt = 0;
    } else {
      sexInt = 1;
    }
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

  changeInformation() {
    this.setState({
      visible: !this.state.visible
    });
    this.itemRef
      .child(this.state.id)
      .child("Information")
      .set({
        Avatar: this.state.avatar,
        CoverPhoto: this.state.coverPhoto,
        Email: this.state.email,
        Name: this.state.name,
        PhoneNumber: this.state.phoneNumber,
        BirthDate: this.state.birthDate,
        Sex: this.state.sex,
        Password: this.state.oldPassword
      });
    this.setState({
      visible: false
    });
    this.refs.toast.show("Thay đổi thành công");
  }

  changePassword() {
    this.setState({
      visible: !this.state.visible
    });
    if (this.state.oldPasswordInput != this.state.oldPassword) {
      console.log("Sai mật khẩu cũ!");
    } else if (this.state.newPassword != this.state.reNewPassword) {
      console.log("Mật khẩu mới không khớp!");
    } else {
      this.itemRef
        .child(this.state.userId)
        .child("Information")
        .set({
          Avatar: this.state.avatar,
          CoverPhoto: this.state.coverPhoto,
          Email: this.state.email,
          Name: this.state.name,
          PhoneNumber: this.state.phoneNumber,
          BirthDate: this.state.birthDate,
          Sex: this.state.sex,
          Password: this.state.newPassword
        });
      this.setState({
        visible: false
      });
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView style={styles.container}>
          <Spinner
            visible={this.state.visible}
            textContent={"Đang xử lý..."}
            textStyle={{ color: "#FFF" }}
          />
          <View style={styles.containerBelow}>
            <View style={styles.containerText}>
              <Text style={styles.textHeader}> Tên: </Text>
              <TextInput
                style={styles.textState}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={name => this.setState({ name })}
                value={this.state.name}
              >
                
              </TextInput>
              <Image
                source={require("../img/Edit.png")}
                style={styles.editText}
              />
            </View>
            <View
              style={{ borderBottomColor: "#757575", borderBottomWidth: 1 }}
            />
            <View style={styles.containerText}>
              <Text style={styles.textHeader}> Email: </Text>
              <TextInput
                style={styles.textState}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              >
                
              </TextInput>
              <Image
                source={require("../img/Edit.png")}
                style={styles.editText}
              />
            </View>
            <View
              style={{ borderBottomColor: "#757575", borderBottomWidth: 1 }}
            />
            <View style={styles.containerText}>
              <Text style={styles.textHeader}> Số điện thoại: </Text>
              <TextInput
                style={styles.textState}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                onChangeText={phoneNumber => this.setState({ phoneNumber })}
                value={this.state.phoneNumber}
              >
                
              </TextInput>
              <Image
                source={require("../img/Edit.png")}
                style={styles.editText}
              />
            </View>
            <View
              style={{ borderBottomColor: "#757575", borderBottomWidth: 1 }}
            />
            <View style={styles.containerText}>
              <DatePicker
                style={styles.date}
                date={this.state.birthDate}
                mode="date"
                placeholder="Ngày sinh"
                format="DD-MM-YYYY"
                minDate="01-01-1000"
                maxDate="01-01-2017"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={date => {
                  this.setState({ birthDate: date });
                }}
              />
            </View>
          </View>
          <View
            style={{
              marginLeft: "27%",
              marginRight: "27%",
              marginBottom: "3%",
              marginTop: "3%"
            }}
          >
            <RadioForm
              radio_props={radio_props}
              initial={sexInt}
              formHorizontal={true}
              buttonColor={"#00796B"}
              labelStyle={{ marginLeft: "9%" }}
              onPress={value => {
                this.setState({ sex: value });
              }}
            />
          </View>
          <TouchableOpacity
            style={[styles.touchable, styleColorBackground.button_color]}
            onPress={() => this.changeInformation()}
          >
            <Text style={styles.button}>Đổi thông tin</Text>
          </TouchableOpacity>
          <View style={styles.containerPassword}>
            <View style={styles.containerText}>
              <Text style={styles.textHeader}> Mật khẩu cũ: </Text>
              <TextInput
                style={styles.textState}
                placeholder="**********"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              >
                
              </TextInput>
              <Image
                source={require("../img/Edit.png")}
                style={styles.editText}
              />
            </View>
            <View
              style={{ borderBottomColor: "#757575", borderBottomWidth: 1 }}
            />
            <View style={styles.containerText}>
              <Text style={styles.textHeader}> Mật khẩu mới: </Text>
              <TextInput
                style={styles.textState}
                placeholder="**********"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              >
               
              </TextInput>
              <Image
                source={require("../img/Edit.png")}
                style={styles.editText}
              />
            </View>
            <View
              style={{ borderBottomColor: "#757575", borderBottomWidth: 1 }}
            />
            <View style={styles.containerText}>
              <Text style={styles.textHeader}> Nhập lại mật khẩu mới: </Text>
              <TextInput
                style={styles.textState}
                placeholder="**********"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                onSubmitEditing={() => this.changePassword()}
              >
                
              </TextInput>
              <Image
                source={require("../img/Edit.png")}
                style={styles.editText}
              />
            </View>
            <TouchableOpacity
              style={[styles.touchable, styleColorBackground.button_color]}
              onPress={() => this.changePassword()}
            >
              <Text style={styles.button}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          </View>
          <Toast ref="toast" />
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoBackButton: {
    width: 17,
    height: 17,
    marginLeft: 15
  },
  containerBelow: {
    marginTop: "1.6%",
    marginLeft: "3%",
    marginRight: "3%"
  },
  containerText: {
    flexDirection: "row"
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 21,
    marginTop: "2.5%"
  },
  textState: {
    fontSize: 21,
    width: "70%"
  },
  editText: {
    width: 1,
    height: 1,
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: "3%"
  },
  touchable: {
    padding: "3%",
    marginLeft: "5%",
    marginRight: "5%"
  },
  button: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18
  },
  date: {
    marginTop: "6%",
    marginLeft: "11%",
    marginRight: "10%",
    width: "70%"
  },
  containerPassword: {
    marginTop: "7%",
    marginLeft: "3%",
    marginRight: "3%"
  }
});

//make this component available to the app
export default InformationUser;
