import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  setOrigin,
  selectOrigin,
  selectInvoice,
  setInvoice,
  selectToken,
} from "../slices/navSlice";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import cloneDeep from "lodash.clonedeep";
import haversine from "haversine";
import { API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
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
  const [rearLight, setRearLight] = useState(false);
  const [frontLight, setFrontLight] = useState(false);
  const [isRearLoading, setRearLoading] = useState(false);
  const [isFrontLoading, setFrontLoading] = useState(false);
  const jwt = useSelector(selectToken);
  const invoice = useSelector(selectInvoice);
  const markerRef = useRef(null);
  const dispatch = useDispatch();

  const toggleRearLight = async () => {
    await axios
      .get(
        `${API_URL}/Bike/TurnLights?BikeId=F1HNRF&lightNumber=0&turnType=false`,
        config
      )
      .then((res) => {
        if (res.data.resultTypeId === 200) {
          console.log(res.data);
          setRearLight(!rearLight);
        }
      })
      .catch((error) => {
        console.log(error);
        setRearLight(false);
      });
  };

  const frontApiCall = async () => {
    setFrontLoading(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + jwt.token,
      },
    };
    if (!frontLight) {
      console.log("turn on");
      await axios
        .get(
          `${API_URL}/Bike/TurnLights?BikeId=F1HNRF&lightNumber=0&turnType=true`,
          config
        )
        .then((res) => {
          setFrontLoading(false);
          setFrontLight(true);
        })
        .catch((error) => {
          console.log(error);
          console.log("true error");
          setFrontLoading(false);
        });
    } else {
      console.log("turn off");
      await axios
        .get(
          `${API_URL}/Bike/TurnLights?BikeId=F1HNRF&lightNumber=0&turnType=false`,
          config
        )
        .then((res) => {
          console.log(res.data);
          setFrontLight(false);
          setFrontLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setFrontLoading(false);
        });
    }
  };

  const toggleFrontLight = async () => {
    try {
      await frontApiCall();
    } catch (error) {
      console.log(error);
    }
  };

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
        <View style={styles.lights_wrap}>
          <Text style={{ fontWeight: "bold", fontSize: 24, color: "#FFC107" }}>
            Headlights
          </Text>
          <View style={styles.lights}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ marginRight: 10 }}>Rear</Text>
              <MaterialCommunityIcons
                color={rearLight ? "#FFC107" : "black"}
                size={32}
                name={"car-light-high"}
              />
              <Switch onValueChange={toggleRearLight} value={rearLight} />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ marginRight: 10 }}>Front</Text>
              <MaterialCommunityIcons
                color={frontLight ? "#FFC107" : "black"}
                size={32}
                name={"car-light-high"}
              />
              <Switch
                disabled={isFrontLoading}
                onValueChange={toggleFrontLight}
                value={frontLight}
              />
            </View>
          </View>
        </View>
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
    height: "30%",
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
    height: "30%",
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
    height: "20%",
    width: "80%",
    backgroundColor: "#52b788",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginBottom: "1%",
  },
  button_text: {
    fontSize: 2,
    fontWeight: "800",
    color: "white",
  },
  lights_wrap: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  lights: {
    display: "flex",
    flexDirection: "column",
    width: "40%",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
