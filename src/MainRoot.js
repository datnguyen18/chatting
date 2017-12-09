//import liraries
import React from "react";
import {
  ScrollView,
  StackNavigator,
  Platform,
  TabNavigator,
  DrawerNavigator
} from "react-navigation";
import { Dimensions } from "react-native";
import Login from "./Screens/Login";
import Register from "./Screens/Register";
import MainTab from "./MainTab";
import RecentMessages from "./Screens/RecentMessages";
import ListFriends from "./Screens/ListFriends";
import RoomChat from "./Screens/RoomChat";
import Message from "./Screens/Message";
import MainDrawer from "./MainDrawer";
import InformationUser from "./Screens/InformationUser";
import ChangeInformationUser from "./Screens/ChangeInformationUser";
import FriendRequests from "./Screens/FriendRequests";
import WallFriends from "./Screens/WallFriends";
import InformationFriend from "./Screens/InformationFriend";
import RoomMessage from "./Screens/RoomMessage";
import Nearby from "./Screens/Nearby";
import NewMessage from "./Screens/NewMessage";
import SettingConversation from "./Screens/SettingConversation";
import ListUserRoomChat from "./Screens/ListUserRoomChat"

let { width, height } = Dimensions.get("window");

export const LoginAndRegister = StackNavigator({
  LoginScreen: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },

  RegisterScreen: {
    screen: Register
  },

  MainTabScreen: {
    screen: MainTab,
    navigationOptions: {
      headerLeft: null,
      header: null
    }
  }
});

export const RegisterStack = StackNavigator({
  LoginScreen: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },
  RegisterScreen: {
    screen: Register
  }
});

export const RecentMessagesStack = StackNavigator({
  RecentMessagesScreen: {
    screen: RecentMessages
  },
  MessageScreen: {
    screen: Message
  },
  NewMessageScreen: {
    screen: NewMessage
  },
  SettingConversationScreen: {
    screen: SettingConversation
  },
  WallFriendsScreen: {
    screen: WallFriends
  },
  InformationFriendScreen: {
    screen: InformationFriend
  }
});

export const ListFriendsStack = StackNavigator({
  ListFriendsScreen: {
    screen: ListFriends
  },
  MessageScreen: {
    screen: Message
  },
  FriendRequestsScreen: {
    screen: FriendRequests
  },
  WallFriendsScreen: {
    screen: WallFriends
  },
  InformationFriendScreen: {
    screen: InformationFriend
  },
  SettingConversationScreen: {
    screen: SettingConversation
  },
});

export const RoomChatStack = StackNavigator({
  RoomChatScreen: {
    screen: RoomChat
  },
  RoomMessageScreen: {
    screen: RoomMessage
  },
  ListUserRoomChatScreen: {
    screen: ListUserRoomChat
  }
});

export const InformationUserStack = StackNavigator({
  InformationUserScreen: {
    screen: InformationUser
  },
  ChangeInformationUserScreen: {
    screen: ChangeInformationUser
  }
});

export const NearbyStack = StackNavigator({
  NearbyScreen: {
    screen: Nearby,
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  },
  WallFriendsScreen: {
    screen: WallFriends
  }
});

export const Tabbar = TabNavigator(
  {
    RecentMessageTab: {
      screen: RecentMessagesStack
    },
    ListFriendsTab: {
      screen: ListFriendsStack
    },
    RoomChatTab: {
      screen: RoomChatStack
    }
  },
  {
    tabBarPosition: "bottom",
    tabBarOptions: {
      style: {
        backgroundColor: "#90A4AE"
      },
      activeTintColor: "#F44336",
      inactiveTintColor: "#FFFFFF",
      showIcon: true
      // IOS:
      // ,labelStyle:{
      //   padding:10
      // }
    }
  }
);

export const Drawer = DrawerNavigator(
  {
    Tabbar: {
      screen: Tabbar
    },
    InformationUser: {
      screen: InformationUserStack
    },
    LoginScreen: {
      screen: Login
    },
    RegisterStack: {
      screen: RegisterStack
    },
    NearbyScreen: {
      screen: NearbyStack
    },
    MainTabScreen: {
      screen: MainTab
    }
  },
  {
    drawerWidth: width * 0.85,
    drawerPosition: "left",
    contentComponent: props => <MainDrawer {...props} />,
    drawerBackgroundColor: "transparent"
  }
);
