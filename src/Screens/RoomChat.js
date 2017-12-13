//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  SectionList,
  ListItem,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList
} from "react-native";
import { firebaseApp } from "../api/Firebase";
import { responsiveHeight, responsiveWidth, responsiveFontSize } from '../components/Responsive.js';

// create a component
class RoomChat extends Component {
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
        onPress={() => navigation.navigate("NewMessageScreen")}
      >
        <Image
          style={styles.logoOpenDrawer}
        />
      </TouchableOpacity>
    ),
    headerTitleStyle: {
      alignSelf: "center",
      color: "#FFFFFF"
    },
    headerTintColor: "#FFFFFF",
    title: "Phòng chat",
    headerStyle: {
      backgroundColor: "#F74F4F"
    },
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require("../img/RoomChat.png")}
        style={styles.logoRoomChat}
      />
    )
  });

  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref();
    this.state = ({
      numberPeople: []
    })
    
  }

  componentWillMount() {
    this.getNumOfPeople();
  }
  openRoomChat(section) {
    this.itemRef
      .child("Room Chat")
      .child("Eastern International University")
      .child(section.data[0].major)
      .child(section.data[0].child)
      .child("Users")
      .child(global.userId)
      .set({
        ID: global.userId
      });

    this.props.navigation.navigate("RoomMessageScreen", {
      nameRoom: section.title,
      childNameRoom: section.data[0].value,
      childName: section.data[0].child,
      majorRoom: section.data[0].major
    })
  }

  getNumOfPeople(){
    let array = []
    this.itemRef
    .child("Room Chat")
    .child("Eastern International University")
    .on("child_added", snapshot => {
       array.push(snapshot.child("All")
       .child("Users").numChildren())
       this.setState({
         numberPeople: array
       })
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    const sectionData = [
      {
        title: "Khoa Kỹ thuật",
        data: [
          { value: "Toàn khoa", major: "Engineer", child: "All" }
        ],
        key: "1",
        source: require("../img/brain.png")
      },
      {
        title: "Khoa Điều dưỡng",
        data: [{ value: "Toàn khoa", major: "Nursing", child: "All" }],
        key: "2",
        source: require("../img/nurse.png")
      },
      {
        title: "Quản trị",
        data: [{ value: "Toàn khoa", major: "Business", child: "All" }],
        key: "0",
        source: require("../img/presentation.png")
      }
    ];
    return (
      <View style={styles.container}>
        <FlatList
          data={sectionData}
          renderItem={
            ({ item }) => (
              <TouchableOpacity onPress={() => this.openRoomChat(item)}>
                <View style={styles.roomItems}>
                  <Image source={item.source} style={{ width: responsiveWidth(22), height: responsiveWidth(22) }} />
                  <Text style={styles.title}>
                    {item.title}
                  </Text>
                  <Text style={styles.title}>Số người: {this.state.numberPeople[item.key]}</Text>
                </View>
              </TouchableOpacity>
            )}
          numColumns={2}
          style={{ flexDirection: 'row' }}
        />
      </View>
    );
  }
}
const { height, width } = Dimensions.get('window')
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'

  },
  logoOpenDrawer: {
    width: 30,
    height: 30,
    marginLeft: 15
  },
  logoRoomChat: {
    width: 24,
    height: 24
  },
  roomItems: { 
    width: responsiveWidth(49), 
    height: responsiveHeight(28), 
    margin: 2, 
    backgroundColor: "#F1ABA0", 
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center'
  },
  title: {
    color:'#ffffff'
  }

});

//make this component available to the app
export default RoomChat;
