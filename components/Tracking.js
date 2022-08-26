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
import MapView, {
  Callout,
  Circle,
  Polyline,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { setOrigin, selectOrigin, selectToken } from "../slices/navSlice";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import cloneDeep from "lodash.clonedeep";
import haversine from "haversine";
export default function Map() {
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const origin = useSelector(selectOrigin);
  const data = useSelector(selectToken);
  const mapRef = useRef(null);
  const [prevLocation, setPrevLocation] = useState(cloneDeep(origin));
  const [nextLocation, setNextLocation] = useState(cloneDeep(origin));
  const [distance, setDistance] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const markerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    mapRef.current.animateToRegion({
      latitude: origin.location.lat,
      longitude: origin.location.lng,
      latitudeDelta: 0.007,
      longitudeDelta: ASPECT_RATIO * 0.007,
    });
    const totalDistance = haversine(
      {
        latitude: prevLocation.location.lat,
        longitude: prevLocation.location.lng,
      },
      { latitude: origin.location.lat, longitude: origin.location.lng },
      { unit: "km" }
    );
    setDistance(totalDistance);
  }, [origin]);

  const selectLocation = (region) => {
    mapRef.current.animateToRegion({
      latitude: region.lat,
      longitude: region.lng,
      latitudeDelta: 0.007,
      longitudeDelta: ASPECT_RATIO * 0.007,
    });
  };
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds >= 0) {
        setSeconds(seconds + 1);
        if (seconds === 59) {
          setMinutes(minutes + 1);
          setSeconds(0);
        }
      }
    }, 800);

    return () => {
      clearInterval(myInterval);
    };
  });

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
      setPrevLocation(cloneDeep(origin));

      let asyncLocations = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 2000,
        },
        (location) => {
          dispatch(
            setOrigin({
              location: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              },
            })
          );
        }
      );
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType="mutedStandard"
        showsMyLocationButton={true}
        showsUserLocation={true}
        followsUserLocation
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
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
        >
          <Image source={require("../assets/rider.png")} />
        </Marker>
        <MapViewDirections
          origin={{
            latitude: prevLocation.location.lat,
            longitude: prevLocation.location.lng,
          }}
          destination={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeColor="green"
          strokeWidth={3}
        />
      </MapView>
      <View style={styles.card}>
        <View style={styles.wrap_info}>
          <Text style={styles.info}>
            Timer: {minutes}:{seconds < 10 ? "0" + seconds : seconds}
          </Text>
          <Text style={styles.info}>Distane:{distance.toFixed(2)} km</Text>
        </View>
        <TouchableOpacity style={styles.stop}>
          <Text styles={{ fontWeight: "bold" }}>Finish the Ride</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    backgroundColor: "#006d77",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "16%",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  wrap_info: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "60%",
    width: "100%",
  },
  info: {
    color: "white",
    fontSize: 20,
    justifyContent: "flex-start",
  },
  stop: {
    backgroundColor: "red",
    flex: 1,
    height: "30%",
    width: "80%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5%",
    borderRadius: 6,
  },
});
