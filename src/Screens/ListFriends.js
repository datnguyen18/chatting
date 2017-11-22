//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image
} from "react-native";
import { firebaseApp } from "../api/Firebase";

// create a component
class ListFriends extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
        <Image
          source={require("../img/NavigatorIcon.png")}
          style={styles.logoOpenDrawer}
        />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate("FriendRequestsScreen")}
      >
        <Image
          source={require("../img/AddFriends.png")}
          style={styles.logoOpenFriendRequests}
        />
      </TouchableOpacity>
    ),
    title: "Bạn bè",
    headerTitleStyle: {
      textAlign: "center",
      color: "#FFFFFF",
      alignSelf: "center"
    },
    headerTintColor: "#FFFFFF",
    headerStyle: {
      backgroundColor: "#F74F4F"
    },
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require("../img/Friends.png")}
        style={[styles.logoFriends]}
      />
    )
  });

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref("Users");
    this.state = {
      friends: []
    };
  }

  componentWillMount() {
    const arrayNameFriends = [];
    this.itemRef
      .child(global.userId)
      .child("Friends")
      .on("child_added", snapshot => {
        this.itemRef
          .child(snapshot.val().UID)
          .child("Information")
          .on("value", snapshot1 => {
            arrayNameFriends.push({
              name: snapshot1.val().Name,
              id: snapshot.val().UID,
              avatar: snapshot1.val().Avatar
            });
            this.sortFriends(arrayNameFriends);
            this.loadIdFriends(arrayNameFriends);
          });
      });
  }

  sortFriends(arrayNameFriends) {
    arrayNameFriends.sort((a, b) => {
      if (a.name != null && b.name != null) {
        var nameA = this.bodauTiengViet(a.name.toString());
        var nameB = this.bodauTiengViet(b.name.toString());
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }
    });
  }

  loadIdFriends(arrayNameFriends) {
    this.setState({
      friends: arrayNameFriends
    });
    global.listFriends = this.state.friends
  }

  bodauTiengViet(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.state.friends.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("MessageScreen", {
                  idFriend: item.id,
                  nameFriend: item.name,
                  avatarFriend: item.avatar
                })}
            >
              <View key={item.id} style={styles.item}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.textName}>
                  <Text style={styles.name}>{item.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: "2%",
    borderColor: "#2a4944",
  },
  avatar: {
    flex: 1,
    marginLeft: "3%",
    width: 60,
    height: 60,
    ...Platform.select({
      ios: {
        borderRadius: 28
      },
      android: {
        borderRadius: 50
      }
    })
  },
  name: {
    margin: "6%",
    fontSize: 18,
    color: (Platform.android) ? "#000000" : "#000000"
  },
  logoOpenDrawer: {
    width: 30,
    height: 30,
    marginLeft: 15
  },
  logoOpenFriendRequests: {
    width: 35,
    height: 35,
    marginRight: 15
  },
  logoFriends: {
    width: 20,
    height: 20
  },
  textName: {
    flex: 5,
    borderBottomWidth: 1,
    borderColor: "#F74F4F"
  }
});

//make this component available to the app
export default ListFriends;
