import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
  TouchableOpacity,
  Image
} from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { firebaseApp } from "../api/Firebase";

let { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.03;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var styleColorBackground = require("../components/color_background");
export class Nearby extends Component {
  constructor(props) {
    super(props);
    this.itemRef = firebaseApp.database().ref("Users");
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
        listLocation: []
      }
    };
  }

  componentWillMount() {
    this.setState({
      listLocation: this.getAllLocation()
    });
  }

  getAllLocation() {
    const listUser = [];
    this.itemRef.on("child_added", snapshot => {
      if (snapshot.hasChild("Location")) {
        listUser.push({
          latitude: snapshot.child("Location").val().Latitude,
          longitude: snapshot.child("Location").val().Longitude,
          avatar: snapshot.child("Information").val().Avatar,
          name: snapshot.child("Information").val().Name,
          id: snapshot.child("Information").val().ID,
          sex: snapshot.child("Information").val().Sex,
          coverPhoto: snapshot.child("Information").val().CoverPhoto,
          birthDate: snapshot.child("Information").val().BirthDate,
          email: snapshot.child("Information").val().Email,
          phoneNumber: snapshot.child("Information").val().PhoneNumber
        });
      }
    });
    return listUser;
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.itemRef
          .child(user.uid)
          .child("Location")
          .set({
            Latitude: position.coords.latitude,
            Longitude: position.coords.longitude
          });
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });
      },
      error => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition(position => {
      this.setState({
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
      });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  moveToCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }
        });
      },
      error => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          rotateEnabled={false}
          onRegionChange={region => this.setState({ region })}
          onRegionChangeComplete={region => this.setState({ region })}
          /* mapType={"hybrid"} */
          region={this.state.region}
        >
          {this.state.listLocation.map(marker => (
            <MapView.Marker coordinate={marker} title={marker.email}>
              <Image source={{ uri: marker.avatar }} style={styles.marker} />
              <MapView.Callout
                onPress={() =>
                  navigate("WallFriendsScreen", {
                    idFriend: marker.id,
                    nameFriend: marker.name,
                    avatarFriend: marker.avatar,
                    coverPhotoFriend: marker.coverPhoto,
                    phoneNumberFriend: marker.phoneNumber,
                    sexFriend: marker.sex,
                    birthDateFriend: marker.birthDate,
                    emailFriend: marker.email
                  })}
                style={{ width: 360 * ASPECT_RATIO, alignItems: "center" }}
              >
                <View>
                  <Text>Email: {marker.email}</Text>
                  <Text>Tên: {marker.name}</Text>
                  <Text>Giới tính: {marker.sex}</Text>
                  <Button title="Chi tiết" />
                </View>
              </MapView.Callout>
            </MapView.Marker>
          ))}
        </MapView>
        <TouchableOpacity
          onPress={() => navigate("Tabbar")}
          style={styles.actionButton}
        >
          <Image
            source={require("../img/BackButtonMap.png")}
            style={styles.logoBackButton}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.moveToCurrentLocation()}
          style={styles.currentLocation}
        >
          <Image
            source={require("../img/CurrentLocation.png")}
            style={styles.logocurrentLocation}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    height: "100%",
    width: "100%",
    zIndex: -1
  },
  actionButton: {
    position: "absolute",
    width: 30,
    height: 30,
    top: "2.5%",
    left: "5%",
    zIndex: 10
  },
  logoBackButton: {
    width: 30,
    height: 30
  },
  marker: {
    width: 50,
    height: 50
  },
  currentLocation: {
    position: "absolute",
    width: 60,
    height: 60,
    top: "85%",
    left: "80%",
    zIndex: 10
  },
  logocurrentLocation: {
    width: 60,
    height: 60
  },
  titleMarker: {
    width: 160,
    height: 160
  }
});

export default Nearby;
