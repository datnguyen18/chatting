//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  TouchableHighlight,
  Image,
  Alert
} from "react-native";

import { firebaseApp } from "../api/Firebase";
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

const CANCEL_INDEX = 0
const DESTRUCTIVE_INDEX = 4

const options = [
  'Cancel',
  <Text style={{ color: 'red', fontSize: 16 }}>Xoá bạn</Text>,
  'Xem thông tin cá nhân'
]

// const title = <Text style={{ color: '#000', fontSize: 18 }}>Which one do you like?</Text>
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
      friends: [],
      itemIndex: '',
      currentIndex: ''
    };

    this.handlePress = this.handlePress.bind(this)
    this.showActionSheet = this.showActionSheet.bind(this)
  }

  showActionSheet(item, index) {
    this.ActionSheet.show()
    this.setState({
      itemIndex: item,
      currentIndex: index
    });
  }

  handlePress(i) {
    if (i == 2) {
      this.props.navigation.navigate("InformationFriendScreen", {
        coverPhotoFriend: this.state.itemIndex.coverPhoto,
        avatarFriend: this.state.itemIndex.avatar,
        nameFriend: this.state.itemIndex.name,
        emailFriend: this.state.itemIndex.email,
        idFriend: this.state.itemIndex.id,
        phoneNumberFriend: this.state.itemIndex.phoneNumber,
        birthDateFriend: this.state.itemIndex.birthdate,
        sexFriend: this.state.itemIndex.sex
      })
    }

    if (i == 1) {
      Alert.alert(
        'Xoá bạn',
        'Bạn có chắc muốn xoá người bạn này?',
        [
          {text: 'Thoát', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'Xoá', onPress: () => {
            this.setState({
              friends: this.deleteByValue(this.state.friends, this.state.currentIndex)
            });
            this.itemRef
              .child(global.userId)
              .child("Friends")
              .orderByChild("UID").equalTo(this.state.itemIndex.id).on("value", snapshot => {
                snapshot.forEach(data => {
                  this.itemRef.child(global.userId).child("Friends").child(data.key).remove()
                  this.itemRef.child(this.state.itemIndex.id).child("Friends").child(data.key).remove()
                })
              })
          }},
        ],
        { cancelable: false }
      )
      
    }
  }

  deleteByValue(array, index) {
    delete array[index];
    return array;
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
              avatar: snapshot1.val().Avatar,
              email: snapshot1.val().Email,
              phoneNumber: snapshot1.val().PhoneNumber,
              birthdate: snapshot1.val().BirthDate,
              sex: snapshot1.val().Sex,
              coverPhoto: snapshot1.val().CoverPhoto
            });
            this.sortFriends(arrayNameFriends);
            this.loadIdFriends(arrayNameFriends);
          });
      });
  }

  sortFriends(arrayNameFriends) {
    arrayNameFriends.sort((a, b) => {
      if (a.name != null && b.name != null) {
        const nameA = this.bodauTiengViet(a.name.toString());
        const nameB = this.bodauTiengViet(b.name.toString());
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
            <SwipeRow
						leftOpenValue={75}
						rightOpenValue={-75}
					>
          <View style={styles.standaloneRowBack}>
							<Text style={styles.backTextWhite}>Left</Text>
							<Text style={styles.backTextWhite}>Right</Text>
						</View>
          <TouchableHighlight
              onPress={() => {
                this.props.navigation.navigate("MessageScreen", {
                  idFriend: item.id,
                  nameFriend: item.name,
                  avatarFriend: item.avatar,
                  coverPhotoFriend: item.coverPhoto,
                  emailFriend: item.email,
                  phoneNumberFriend: item.phoneNumber,
                  birthDateFriend: item.birthdate,
                  sexFriend: item.sex
                })
              }}
              onLongPress={() => this.showActionSheet(item, index)}
              underlayColor="white"
            >
              <View key={item.id} style={styles.item}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.textName}>
                  <Text style={styles.name}>{item.name}</Text>
                </View>
              </View>
            </TouchableHighlight>
						
					</SwipeRow>
            
          ))}
        </ScrollView>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          // title={title}
          options={options}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this.handlePress}
        />
      </View >
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
    padding: "1%",
    borderColor: "#2a4944",
  },
  avatar: {
    marginLeft: "3%",
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
    flex: 4,
    borderBottomWidth: 1,
    borderColor: "#F74F4F",
    flexDirection: 'row'
  },
  option: {
    width: 20,
    height: 20,
    marginRight: 15
  },
  menu: {
    flex: 0.5
  },
  standaloneRowFront: {
		alignItems: 'center',
		backgroundColor: '#CCC',
		justifyContent: 'center',
		height: 50,
	},
});

//make this component available to the app
export default ListFriends;
