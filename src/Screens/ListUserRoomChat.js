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
class ListUserRoomChat extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Thành viên",
        headerTitleStyle: {
            textAlign: "center",
            color: "#FFFFFF",
            alignSelf: "center",
            marginRight: "16%"
        },
        headerTintColor: "#FFFFFF",
        headerStyle: {
            backgroundColor: "#F74F4F"
        },
        tabBarVisible: false
    });

    constructor(props) {
        super(props);
        this.itemRef = firebaseApp.database().ref();
        this.state = {
            friends: [],
            childNameRoom: this.props.navigation.state.params.childNameRoom,
            childName: this.props.navigation.state.params.childName,
            majorRoom: this.props.navigation.state.params.majorRoom,
        };
    }

    componentWillMount() {
        const arrayNameFriends = [];
        this.itemRef
            .child("Room Chat")
            .child("Eastern International University")
            .child(this.state.majorRoom)
            .child(this.state.childName)
            .child("Users")
            .on("child_added", snapshot => {
                this.itemRef.child("Users")
                    .child(snapshot.val().ID)
                    .child("Information")
                    .on("value", snapshot1 => {
                        arrayNameFriends.push({
                            name: snapshot1.val().Name,
                            id: snapshot.val().ID,
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

    deleteByValue(array, index) {
        delete array[index];
        return array;
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.state.friends.map((item, index) => (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate("WallFriendsScreen", {
                                    idFriend: item.id,
                                    nameFriend: item.name,
                                    avatarFriend: item.avatar,
                                    coverPhotoFriend: item.coverPhoto,
                                    phoneNumberFriend: item.phoneNumber,
                                    sexFriend: item.sex,
                                    birthDateFriend: item.birthdate,
                                    emailFriend: item.email
                                })
                            }}
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
        padding: "1%",
        borderColor: "#2a4944",
    },
    avatar: {
        marginLeft: "3%",
        width: 60,
        height: 60,
        ...Platform.select({
            ios: {
                borderRadius: 30
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
    }
});

//make this component available to the app
export default ListUserRoomChat;
