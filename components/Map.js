import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import {
  setOrigin,
  selectOrigin,
  selectDestination,
  setDestination,
  selectToken,
  setInvoice,
  selectInvoice,
} from "../slices/navSlice";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import axios from "axios";
import { invoke } from "lodash";
export default function Map() {
  const API_URL = process.env.API_URL;
  const GOOGLE_MAPS_APIKEY = process.env.GOOGLE_MAPS_APIKEY;
  const navigation = useNavigation();
  const Locations = new Array(3).fill(1).map((_, i) => `Bicycle ${i + 1}`);
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const data = useSelector(selectToken);
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [user, setUser] = useState(null);
  const jwt = useSelector(selectToken);
  const invoice = useSelector(selectInvoice);
  const [isBikeClicked, setBikeClicked] = useState(false);
  useEffect(() => {
    mapRef.current.animateToRegion({
      latitude: origin.location.lat,
      longitude: origin.location.lng,
      latitudeDelta: 0.007,
      longitudeDelta: ASPECT_RATIO * 0.007,
    });
  }, [origin]);

  const selectLocation = async (region) => {
    try {
      await mapRef.current.animateToRegion({
        latitude: region.lat,
        longitude: region.lng,
        latitudeDelta: 0.007,
        longitudeDelta: ASPECT_RATIO * 0.007,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = useCallback(async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + jwt.token,
      },
    };

    await axios
      .get(`${API_URL}/UserClient/GetUser`, config)
      .then((res) => {
        if (res.data.resultTypeId === 200) {
          dispatch(
            setInvoice({
              ...invoice,
              userClientId: res.data.value.id,
            })
          );
        }

        setUser(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    fetchUser().catch((error) => {
      console.log(error);
    });
  }, [fetchUser]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      dispatch(
        setOrigin({
          location: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
        })
      );
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        customMapStyle={mapStyle_DARK}
        style={styles.map}
        mapType="standard"
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        onUserLocationChange={(e) => {
          dispatch(
            setOrigin({
              location: {
                lat: e.nativeEvent.coordinate.latitude,
                lng: e.nativeEvent.coordinate.longitude,
              },
            })
          );
        }}
        initialRegion={{
          latitude: origin.location.lat,
          longitude: origin.location.lng,
          latitudeDelta: 0.007,
          longitudeDelta: ASPECT_RATIO * 0.007,
          zoomEnabled: true,
        }}
        ref={mapRef}
      >
        {origin && destination && (
          <MapViewDirections
            origin={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            destination={{
              latitude: destination.lat,
              longitude: destination.lng,
            }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeColor="green"
            strokeWidth={4}
            onReady={(result) => {
              setDistance(result.distance.toFixed(3));
              setDuration(result.duration.toFixed(3));
            }}
          />
        )}

        {Locations.map((location, i) => (
          <Marker
            coordinate={{
              latitude: origin.location.lat + (0.001 * -i) / 2,
              longitude: origin.location.lng + (0.001 * -i) / 2,
              latitudeDelta: 0.007,
              longitudeDelta: ASPECT_RATIO * 0.007,
              draggable: true,
            }}
            onPress={async (e) => {
              dispatch(
                setDestination({
                  lat: e.nativeEvent.coordinate.latitude,
                  lng: e.nativeEvent.coordinate.longitude,
                })
              );
              await selectLocation(destination);
              setBikeClicked(true);
            }}
            key={i}
            description={origin.description}
          >
            <Image source={require("../assets/marker.png")} />
            <Callout>
              <Text>{location}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
      {isBikeClicked && (
        <View style={styles.snap}>
          <View style={styles.left_info}>
            <Image
              style={styles.bicycle}
              source={require("../assets/en.png")}
            />
            <Text style={styles.greenColor}>%68</Text>
          </View>
          <View style={styles.right_info}>
            <Text style={styles.greenColor}>
              {String(duration).slice(0, 1)} dakika
            </Text>
            <Text style={styles.greenColor}>
              {String(distance).slice(2, 5)} metre
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Scanner");
              }}
              style={styles.go}
            >
              <Text style={styles.greenColor}>Sürüşe başla</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  map: {
    flex: 1,
  },
  snap: {
    position: "absolute",
    alignSelf: "center",

    bottom: 30,
    backgroundColor: "#00072D",
    height: 50,
    padding: 10,
    width: "70%",
    height: "15%",
    borderRadius: 7,
    borderWidth: 3,
    borderColor: "#24F384",
    color: "red",
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left_info: {
    display: "flex",
    justifyContent: "space-evenly",
    height: "100%",
    flex: 1,
  },
  right_info: {
    display: "flex",
    flex: 2,
    justifyContent: "space-between",
    alignItems: "stretch",
    height: "100%",
  },
  greenColor: {
    color: "#24F384",
  },
  whiteColor: {
    color: "#fff",
  },
  go: {
    backgroundColor: "#00072D",
    display: "flex",
    paddingVertical: 5,
    width: "100%",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#24F384",
    alignItems: "center",
  },
  bicycle: {
    resizeMode: "cover",
  },
});

const mapStyle_DARK = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8ec3b9",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1a3646",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#64779e",
      },
    ],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#4b6878",
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#334e87",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#283d6a",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6f9ba5",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3C7680",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#304a7d",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#98a5be",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#2c6675",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#255763",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#b0d5ce",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#023e58",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#98a5be",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1d2c4d",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#283d6a",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#3a4762",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#0e1626",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#4e6d70",
      },
    ],
  },
];
