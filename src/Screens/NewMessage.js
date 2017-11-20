//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";

const SendButton = props => (
  <TouchableOpacity
    onPress={() =>
      props.navigation.navigate("MessageScreen", {
        listFriendsChat: props.listChat
      })}
  >
    <Image
      source={require("../img/BackButton.png")}
      style={styles.logoOpenDrawer}
    />
  </TouchableOpacity>
);

// create a component
class NewMessage extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Tin nhắn mới",
    tabBarVisible: false,
    headerTitleStyle: {
      textAlign: "center",
      alignSelf: "center",
      color: "#FFFFFF"
    },
    headerRight: (
      <TouchableOpacity
      // onPress={() => navigation.navigate("FriendRequestsScreen")}
      >
        <Image
          source={require("../img/SendMessage.png")}
          style={styles.logoSendMessage}
        />
      </TouchableOpacity>
    ),
    headerTintColor: "#FFFFFF",
    headerStyle: {
      backgroundColor: "#009688"
    }
  });

  constructor(props) {
    super(props);
    this.state = {
      friends: global.listFriends,
      listChat: []
    };
  }

  removeFromListChat(index) {
    this.setState({
      listChat: this.removeElement(this.state.listChat, index)
    });
  }

  removeElement(listChat, index) {
    delete listChat[index];
    return listChat;
  }

  addToListChat(avatar, id, name, index) {
    this.setState({
      listChat: this.addElement(this.state.listChat, avatar, id, name, index)
    });
  }

  addElement(listChat, avatarFriend, id, name, index) {
    listChat.push({
      avatar: avatarFriend,
      id: id,
      name: name,
      index: index
    });
    return listChat;
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ScrollView horizontal={true} style={styles.scrollViewH} >
          {this.state.listChat.map((item, index) => (
            <TouchableOpacity
              onPress={() => this.state.removeFromListChat(index)}
            >
              <View key={item.id} style={styles.itemH}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TextInput
          style={styles.input}
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
        <ScrollView>
          {this.state.friends.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                this.addToListChat(item.avatar, item.id, item.name, index)}
            >
              <View key={item.id} style={styles.item}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <Text style={styles.name}>{item.name}</Text>
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
    flex: 1
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: "1%",
    borderColor: "#2a4944",
    borderWidth: 1,
    backgroundColor: "#d2f7f1"
  },
  itemH: {
    borderColor: "#2a4944",
    borderWidth: 1,
    borderRadius: 30,
    width: 60,
    height: 60,
    margin: 10
  },
  scrollViewH: {
    backgroundColor: "#d2f7f1",
    flexGrow: 1
  },
  avatar: {
    marginLeft: "3%",
    width: 60,
    height: 60,
    borderRadius: 50
  },
  name: {
    margin: "6%"
  },
  logoFriends: {
    width: 24,
    height: 24
  },
  input: {
    height: 45,
    backgroundColor: "#4DB6AC",
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 17
  },
  logoSendMessage: {
    width: 35,
    height: 35,
    marginRight: 15
  }
});

//make this component available to the app
export default NewMessage;
