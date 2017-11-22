//import liraries
import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

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
        this.state = {
            coverPhoto: this.props.navigation.state.params.coverPhotoFriend,
            avatar: this.props.navigation.state.params.avatarFriend,
            name: this.props.navigation.state.params.nameFriend,
            email: this.props.navigation.state.params.emailFriend,
            id: this.props.navigation.state.params.idFriend,
            phoneNumber: this.props.navigation.state.params.phoneNumberFriend,
            birthDate: this.props.navigation.state.params.birthDateFriend,
            sex: this.props.navigation.state.params.sexFriend
        };
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.containerAvatarFriend}
                    onPress={() =>
                        navigate("InformationFriendScreen", {
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

                <Text> Thay đổi ảnh nền</Text>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    }, containerAvatarFriend: {
        flexDirection: "row",
        alignItems: "center",
        padding: "1%",
        borderColor: "#2a4944",
    }, avatar: {
        margin: "3%",
        width: 60,
        height: 60
    },
});

//make this component available to the app
export default SettingConversation;
