//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ImageBackground
} from "react-native";
import { firebaseApp } from "./api/Firebase";

// create a component
class MainDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverPhoto: '',
      avatar: '',
      name: '',
      email: '',
      id: ''
    };
  }

  componentDidMount() {
    this.setState({
      coverPhoto: global.userCoverPhoto,
      avatar: global.userAvatar,
      name: global.userName,
      email: global.userEmail,
      id: global.userId
    })
  }

  signOut() {
    firebaseApp
      .auth()
      .signOut()
      .then(
      () => {
        user = null;
        global.userId = null;
        this.props.navigation.navigate("LoginScreen");
      },
      function (error) {
        console.error("Sign Out Error", error);
      }
      );
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: this.state.coverPhoto }}
          style={styles.coverPhoto}
        >
          <View style={styles.containerTextImage}>
            <Image source={{ uri: this.state.avatar }} style={styles.avatar} />
            <Text style={styles.text}>{this.state.name}</Text>
            <Text style={[styles.text, { opacity: 0.8 }]}>{this.state.email}</Text>
          </View>
        </ImageBackground>
        <Text style={styles.title}>Tiện ích</Text>
        <View style={styles.containerItem}>
          <TouchableOpacity
            onPress={() => {
              navigate("NearbyScreen");
            }}
          >
            <View style={styles.containerText}>
              <Image
                source={require("./img/DrawerMaps.png")}
                style={styles.logoDrawer}
              />
              <Text style={styles.textHeader}> Tìm người dùng gần đây </Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Cài Đặt</Text>
        <View style={styles.containerItem}>
          <TouchableOpacity
            onPress={() => {
              navigate("InformationUserScreen");
            }}
          >
            <View style={styles.containerText}>
              <Image
                source={require("./img/DrawerInformation.png")}
                style={styles.logoDrawer}
              />
              <Text style={styles.textHeader}> Thông tin người dùng </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.signOut()}>
            <View style={styles.containerText}>
              <Image
                source={require("./img/DrawerSignOut.png")}
                style={styles.logoDrawer}
              />
              <Text style={styles.textHeader}> Đăng xuất </Text>
            </View>
          </TouchableOpacity>
        </View>
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
  title: {
    marginLeft: "3%",
    marginTop: "1%",
    fontSize: 25,
    fontWeight: "bold"
  },
  containerItem: {
    marginLeft: "10%",
    marginTop: "1%",
    fontSize: 21
  },
  avatar: {
    margin: "3%",
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
  text: {
    backgroundColor: 'transparent',
    marginLeft: "3%",
    fontSize: 19,
    fontWeight: "bold",
    color: "#FFFFFF"
  },
  textHeader: {
    marginLeft: "3%",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: "3%",
    backgroundColor: 'transparent',
    marginBottom: 10
  },
  containerTextImage: {
    marginTop: "30%",
  },
  containerText: {
    flexDirection: "row",
    alignItems: "center"
  },
  logoDrawer: {
    width: 20,
    height: 20
  }
});

//make this component available to the app
export default MainDrawer;
