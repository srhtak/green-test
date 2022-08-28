import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  setOrigin,
  selectOrigin,
  selectInvoice,
  setInvoice,
} from "../slices/navSlice";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import cloneDeep from "lodash.clonedeep";
import haversine from "haversine";
import { useNavigation } from "@react-navigation/native";
export default function Map() {
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const origin = useSelector(selectOrigin);
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [prevLocation, setPrevLocation] = useState(cloneDeep(origin));
  const [distance, setDistance] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const invoice = useSelector(selectInvoice);
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

  const handleRideData = () => {
    const time = timerconvert();
    dispatch(
      setInvoice({ ...invoice, distance: Number(distance.toFixed(2)), time })
    );
    navigation.navigate("Camera");
  };

  const timerconvert = () => {
    const totalTime = minutes * 60 + seconds;
    return totalTime;
  };

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
          <View style={styles.info_left}>
            <Text style={{ fontSize: 35 }}>
              {minutes}:{seconds < 10 ? "0" + seconds : seconds}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 12,
              }}
            >
              Timer
            </Text>
          </View>
          <View style={styles.info_right}>
            <Text style={{ fontSize: 35 }}>{distance.toFixed(2)} km</Text>
            <Text style={{ fontWeight: "bold", fontSize: 12 }}>Distane</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleRideData();
          }}
          style={styles.button}
        >
          <Text styles={styles.button_text}>Finish the Ride</Text>
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "20%",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  wrap_info: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "60%",
    width: "100%",
  },
  info_left: {
    color: "white",
    fontSize: 20,
    display: "flex",
    position: "absolute",
    left: "12%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  info_right: {
    color: "white",
    fontSize: 20,
    display: "flex",
    position: "absolute",
    right: "12%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  button: {
    flex: 1,
    height: "26%",
    width: "80%",
    backgroundColor: "#52b788",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginBottom: "3%",
  },
  button_text: {
    fontSize: 2,
    fontWeight: "800",
    color: "white",
  },
});
