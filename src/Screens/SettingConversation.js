//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, Platform } from 'react-native';
import { firebaseApp } from "../api/Firebase";
import RNFetchBlob from "react-native-fetch-blob";

var ImagePicker = require("react-native-image-picker");
const polyfill = RNFetchBlob.polyfill;
const fs = RNFetchBlob.fs;
const Blob = RNFetchBlob.polyfill.Blob

window.XMLHttpRequest = polyfill.XMLHttpRequest;
window.Blob = polyfill.Blob;
// More info on all the options is below in the README...just some common use cases shown here
var options = {
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

                // let source = { uri: response.uri };
                // let path = response.path;
                // Blob.build(RNFetchBlob.wrap(path), { type: "image/jpeg" })
                //     .then(blob =>
                //         firebaseApp
                //             .storage()
                //             .ref("Users")
                //             .child(user.uid)
                //             .child("Messages")
                //             .child(global.path)
                //             .child("Background")
                //             .put(blob, { contentType: "image/png" })
                //     )
                //     .then(snapshot => {
                        // this.itemRef
                        //     .child(this.state.id)
                        //     .child("Messages")
                        //     .child(global.path)
                        //     .child("Background")
                        //     .set({
                        //         URL: snapshot.downloadURL
                        //     });
                //         this.refs.toast.show("Thay đổi ảnh bìa thành công!");
                //     });

                // Blob.build(RNFetchBlob.wrap(path), { type: "image/jpeg" })
                //     .then(blob =>
                    //     firebaseApp
                    //         .storage()
                    //         .ref("Users")
                    //         .child(this.state.id)
                    //         .child("Messages")
                    //         .child(global.path)
                    //         .child("Background")
                    //         .put(blob, { contentType: "image/png" })
                    // )
                //     .then(snapshot => {
                        // this.itemRef
                        //     .child(global.userId)
                        //     .child("Messages")
                        //     .child(global.path)
                        //     .child("Background")
                        //     .set({
                        //         URL: snapshot.downloadURL
                        //     });
                //         this.refs.toast.show("Thay đổi ảnh bìa thành công!");
                //     });
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
                        <Text>{this.state.name}</Text>
                        <Text>Trang cá nhân</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.changeBackGround()
                }>
                    <View style={styles.containerRow}>
                        <Text style={{ marginLeft: "3%" }}> Thay đổi ảnh nền</Text>
                        <ImageBackground
                            source={{ uri: this.state.imageBackgroundConversation }}
                            style={styles.backgroundConversation}></ImageBackground>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.containerRow}>
                        <Text style={{ marginLeft: "3%" }}> Thay đổi ảnh nền</Text>
                        <View style={styles.viewColor}></View>
                    </View>
                </TouchableOpacity>
            </View >
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: "1%",
        borderColor: "#2a4944",
    },
    avatar: {
        margin: "3%",
        width: 60,
        height: 60
    },
    backgroundConversation: {
        marginLeft: "50%",
        width: 45,
        height: 80
    },
    // viewColor: {
    //     width: 45,
    //     height: 45,
    //     background: this.state.viewColor
    // }
});

//make this component available to the app
export default SettingConversation;
