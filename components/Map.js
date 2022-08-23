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
} from "../slices/navSlice";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useNavigation } from "@react-navigation/native";
export default function Map() {
  const navigation = useNavigation();
  const Locations = new Array(6).fill(1).map((_, i) => `Bicycle ${i + 1}`);
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const data = useSelector(selectToken);
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBikeClicked, setBikeClicked] = useState(false);
  useEffect(() => {
    mapRef.current.animateToRegion({
      latitude: origin.location.lat,
      longitude: origin.location.lng,
      latitudeDelta: 0.007,
      longitudeDelta: ASPECT_RATIO * 0.007,
    });
  }, [origin]);

  const selectLocation = (region) => {
    console.log(data.token);
    mapRef.current.animateToRegion({
      latitude: region.lat,
      longitude: region.lng,
      latitudeDelta: 0.007,
      longitudeDelta: ASPECT_RATIO * 0.007,
    });
  };

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
        style={styles.map}
        mapType="mutedStandard"
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
              latitude: origin.location.lat + (0.011 * -i) / 2,
              longitude: origin.location.lng + (0.01 * -i) / 2,
              latitudeDelta: 0.007,
              longitudeDelta: ASPECT_RATIO * 0.007,
              draggable: true,
            }}
            onPress={(e) => {
              dispatch(
                setDestination({
                  lat: e.nativeEvent.coordinate.latitude,
                  lng: e.nativeEvent.coordinate.longitude,
                })
              );
              selectLocation(destination);
              setBikeClicked(true);
            }}
            key={i}
            description={origin.description}
          >
            <Image source={require("../assets/bicycle.png")} />
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
            <Text>%68</Text>
          </View>
          <View style={styles.right_info}>
            <Text>{String(duration).slice(0, 1)} dakika</Text>
            <Text>{String(distance).slice(2, 5)} metre</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Scanner");
              }}
              style={styles.go}
            >
              <Text>Sürüşe başla</Text>
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
    backgroundColor: "#57cc99",
    height: 50,
    padding: 10,
    width: "70%",
    height: "15%",
    borderRadius: 8,
    color: "red",
    shadowColor: "#000",
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
  go: {
    backgroundColor: "#0096c7",
    display: "flex",
    paddingVertical: 5,
    width: "100%",
    borderRadius: 6,
    alignItems: "center",
  },
  bicycle: {
    resizeMode: "cover",
  },
});
