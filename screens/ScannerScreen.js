import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ActivityIndicator,
  Image,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  selectInvoice,
  selectToken,
  setIsTracking,
  setInvoice,
} from "../slices/navSlice";
import axios from "axios";
import * as Animatable from "react-native-animatable";

export default function Scanner() {
  const API_URL = process.env.API_URL;
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const invoice = useSelector(selectInvoice);
  const jwt = useSelector(selectToken);

  const zoomIn = {
    from: {
      scale: 0.9,
    },
    to: {
      scale: 1,
    },
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    dispatch(setIsTracking(true));
    dispatch(setInvoice({ ...invoice, bikeId: data }));
    navigation.navigate("Home");
    setLoading(true);
    console.log(data);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + jwt.token,
      },
    };

    await axios
      .get(`${API_URL}/Bike/UnLock?BikeId=${data}`, config)
      .then((res) => {
        if (res.data.resultTypeId === 200) {
          setLoading(false);
          console.log(res.data);
          dispatch(setIsTracking({ isTracking: true }));
          navigation.navigate("Home");
        } else {
          setLoading(false);
          console.log(res.data.messageCode);
        }
      })
      .catch((error) => {
        console.log("here error");
        setLoading(false);
        console.log(error);
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={loading ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <Animatable.Image
        animation={zoomIn}
        iterationCount={Infinity}
        direction="alternate"
        source={require("../assets/scanner.png")}
        style={styles.scanner}
      />
      {loading && <ActivityIndicator size="large" color="#24F384" />}
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  scanner: {
    position: "absolute",
    backgroundColor: "transparent",
    width: "100%",
    height: "70%",
  },
});
