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
import { setOrigin, selectOrigin, selectToken } from "../slices/navSlice";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import haversine from "haversine";
export default function Map() {
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const origin = useSelector(selectOrigin);
  const data = useSelector(selectToken);
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const [destination, setDestination] = useState({
    ...origin.location,
  });

  useEffect(() => {
    mapRef.current.animateToRegion({
      latitude: origin.location.lat,
      longitude: origin.location.lng,
      latitudeDelta: 0.007,
      longitudeDelta: ASPECT_RATIO * 0.007,
    });
  }, [origin]);

  const getLocationAsync = async () => {
    // watchPositionAsync Return Lat & Long on Position Change
    const location = await Location.watchPositionAsync(
      {
        accuracy: 6,
        distanceInterval: 15,
        timeInterval: 10000,
      },
      (newLocation) => {
        let { coords } = newLocation;
        setDestination({
          location: {
            lat: coords.latitude,
            lng: coords.longitude,
          },
        });
        let region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045,
        };
        //this.setState({ region: region });
      },
      (error) => console.log(error)
    );
    return location;
  };

  useEffect(() => {
    getLocationAsync();
  });

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
      <TouchableOpacity>
        <Text>Start</Text>
      </TouchableOpacity>
      <MapView
        style={styles.map}
        mapType="mutedStandard"
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation
        loadingEnabled={true}
        initialRegion={{
          latitude: origin.location.lat,
          longitude: origin.location.lng,
          latitudeDelta: 0.007,
          longitudeDelta: ASPECT_RATIO * 0.007,
          zoomEnabled: true,
        }}
        ref={mapRef}
      >
        <MapViewDirections
          origin={{
            latitude: 37.33067347778918,
            longitude: -122.03006671862121,
          }}
          destination={{
            latitude: destination.lat,
            longitude: destination.lng,
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeColor="green"
          strokeWidth={4}
          onReady={(result) => {
            console.log(result.distance);
          }}
        />
      </MapView>
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
});
