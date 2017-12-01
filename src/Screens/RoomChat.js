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
  StyleSheet
} from "react-native";
import { firebaseApp } from "../api/Firebase";
import { responsiveHeight, responsiveWidth,responsiveFontSize } from '../components/Responsive.js';

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
    headerTitleStyle: {
      alignSelf: "center",
      color: "#FFFFFF",
      marginRight: "16%"
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

  render() {
    const { navigate } = this.props.navigation;
    var sectionData = [
      {
        title: "Kỹ thuật",
        data: [
          { value: "Toàn khoa", major: "Engineer", child: "All" }
        ],
        key: "1",
        source: require("../img/engineer.png")
      },
      {
        title: "Điều dưỡng",
        data: [{ value: "Toàn khoa", major: "Nursing", child: "All" }],
        key: "2",
        source: require("../img/nursing.png")
      },
      {
        title: "Quản trị",
        data: [{ value: "Toàn khoa", major: "Business", child: "All" }],
        key: "3",
        source: require("../img/business.png")
      }
    ];
    return (
      <View style={styles.container}>
        <SectionList
          sections={sectionData}
          renderItem={({ item, section }) => (
            // <TouchableOpacity
            //   onPress={() =>
            //     this.props.navigation.navigate("RoomMessageScreen", {
            //       nameRoom: section.title,
            //       // childNameRoom: item.value,
            //       childName: item.child,
            //       majorRoom: item.major
            //     })}
            // >
            // <Text style={styles.itemValueSection}>{item.value}</Text>
            <Text />
            // {/* </TouchableOpacity> */}
          )}
          renderSectionHeader={({ section }) => (
            <TouchableOpacity
              onPress={() => this.openRoomChat(section)}
            >
              {/* <Text style={styles.itemHeaderSection}>{section.title}</Text> */}
              <Image source={section.source} style={{width: responsiveWidth(100),height: responsiveHeight(25)}}/>

            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}
const {height, width} = Dimensions.get('window')
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoOpenDrawer: {
    width: 30,
    height: 30,
    marginLeft: 15
  },
  logoRoomChat: {
    width: 24,
    height: 24
  }
});

//make this component available to the app
export default RoomChat;
