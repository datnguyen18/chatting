//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Platform } from 'react-native';
import { firebaseApp } from "../api/Firebase";
import RNFetchBlob from "react-native-fetch-blob";

const ImagePicker = require("react-native-image-picker");
const polyfill = RNFetchBlob.polyfill;
const fs = RNFetchBlob.fs;
const Blob = RNFetchBlob.polyfill.Blob

window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;
// More info on all the options is below in the README...just some common use cases shown here
const options = {
    title: "Chọn ảnh từ:",
    quality: 0.3,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

// create a component
class SettingConversation extends Component {
    static navigationOptions = ({ navigation }) => ({
        tabBarVisible: false,
        title: "Tùy chọn",
        headerTitleStyle: {
            textAlign: "center",
            color: "#FFFFFF",
            alignSelf: "center",
            marginRight: "16%"
        },
        headerTintColor: "#FFFFFF",
        headerStyle: {
            backgroundColor: "#F74F4F"
        }
    });

    constructor(props) {
        super(props);
        this.itemRef = firebaseApp.database().ref("Users");
        this.state = {
            coverPhoto: this.props.navigation.state.params.coverPhotoFriend,
            avatar: this.props.navigation.state.params.avatarFriend,
            name: this.props.navigation.state.params.nameFriend,
            email: this.props.navigation.state.params.emailFriend,
            id: this.props.navigation.state.params.idFriend,
            phoneNumber: this.props.navigation.state.params.phoneNumberFriend,
            birthDate: this.props.navigation.state.params.birthDateFriend,
            sex: this.props.navigation.state.params.sexFriend,
            path: this.props.navigation.state.params.path,
            imageBackgroundConversation: global.imageBackgroundConversation
        };
    }

    uploadBackgroundUser = (uri, mime = 'image/jpg') => {
        return new Promise((resolve, reject) => {
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            let uploadBlob = null

            const imageRef = firebaseApp.storage()
                .ref('Users')
                .child(user.uid)
                .child("Messages")
                .child(global.path)
                .child("Background")

            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    console.log(data)
                    return Blob.build(data, { type: `${mime};BASE64` })
                })
                .then((blob) => {
                    uploadBlob = blob
                    console.log(blob)
                    return imageRef.put(blob, { contentType: mime })
                })
                .then(() => {
                    uploadBlob.close()
                    return imageRef.getDownloadURL()
                })
                .then((url) => {
                    resolve(url)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    uploadBackgroundFriend = (uri, mime = 'image/jpg') => {
        return new Promise((resolve, reject) => {
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            let uploadBlob = null
            const imageRef = firebaseApp.storage()
                .ref("Users")
                .child(this.state.id)
                .child("Messages")
                .child(global.path)
                .child("Background")

            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    return Blob.build(data, { type: `${mime};BASE64` })
                })
                .then((blob) => {
                    uploadBlob = blob
                    console.log(blob)
                    return imageRef.put(blob, { contentType: mime })
                })
                .then(() => {
                    uploadBlob.close()
                    return imageRef.getDownloadURL()
                })
                .then((url) => {
                    resolve(url)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    changeBackGround() {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton);
            } else {
                this.uploadBackgroundUser(response.uri)
                    .then(url => {
                        console.log(url)
                        this.itemRef
                            .child(this.state.id)
                            .child("Messages")
                            .child(global.path)
                            .child("Background")
                            .set({
                                URL: url
                            });
                    })
                this.uploadBackgroundFriend(response.uri)
                    .then(url => {
                        console.log(url)
                        this.itemRef
                            .child(global.userId)
                            .child("Messages")
                            .child(global.path)
                            .child("Background")
                            .set({
                                URL: url
                            });
                    })
            }
        });
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.containerRow}
                    onPress={() =>
                        navigate("WallFriendsScreen", {
                            idFriend: this.state.id,
                            avatarFriend: this.state.avatar,
                            coverPhotoFriend: this.state.coverPhoto,
                            nameFriend: this.state.name,
                            phoneNumberFriend: this.state.phoneNumber,
                            sexFriend: this.state.sex,
                            birthDateFriend: this.state.birthDate,
                            emailFriend: this.state.email
                        })}>
                    <Image
                        source={{ uri: this.state.avatar }}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.name}>{this.state.name}</Text>
                        <Text>Trang cá nhân</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.bigLine}></View>

                <TouchableOpacity onPress={() => this.changeBackGround()}>
                    <View style={styles.containerRow}>
                        <Text style={styles.text}> Đổi ảnh nền</Text>
                        <ImageBackground
                            source={{ uri: this.state.imageBackgroundConversation }}
                            style={styles.backgroundConversation}></ImageBackground>
                    </View>
                </TouchableOpacity>
                <View
                    style={styles.line}
                />
                <TouchableOpacity>
                    <View style={styles.containerRow}>
                        <Text style={styles.text} > Đổi màu nền </Text>
                        <View style={styles.colorConversation}></View>
                    </View>
                </TouchableOpacity>
                <View
                    style={styles.line}
                />
                <TouchableOpacity>
                    <View style={styles.containerRow}>
                        <Text style={styles.text} > Xóa tin nhắn </Text>
                        <View style={styles.viewOption}></View>
                    </View>
                </TouchableOpacity>
                <View
                    style={styles.line}
                />
            </View >
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    line: {
        borderColor: "#E0E0E0",
        borderWidth: 1
    },
    bigLine: {
        backgroundColor: "#E0E0E0",
        width: "100%",
        height: 10
    },
    containerRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: "1%",
        borderColor: "#2a4944"
    },
    avatar: {
        margin: "3%",
        width: 60,
        height: 60
    },
    name: {
        color: "#000000",
        fontSize: 19,
        fontWeight: "bold",
    },
    text: {
        fontSize: 17,
        color: "#000000",
        marginLeft: "3%",
        flex: 7
    },
    viewOption: {
        height: 55,
    },
    backgroundConversation: {
        flex: 1,
        height: 55,
        marginRight: '3%'
    },
    colorConversation: {
        flex: 1,
        width: 45,
        height: 55,
        marginRight: '3%',
        backgroundColor: '#F74F4F'
    }
});

//make this component available to the app
export default SettingConversation;
