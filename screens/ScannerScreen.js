import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { API_URL } from "@env";
import { useSelector } from "react-redux";
import { selectToken } from "../slices/navSlice";
import axios from "axios";

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const jwt = useSelector(selectToken);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + jwt.token,
      },
    };

    await axios
      .get(`${API_URL}/Bike/GetInfo?BikeId=${data}`, config)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // await axios
    //   .get(
    //     `${API_URL}/Bike/TurnLights?BikeId=F1HNRF&lightNumber=0&turnType=false`,
    //     config
    //   )
    //   .then((res) => {
    //     if (res.data.resultTypeId === 200) {
    //       console.log(res.data);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
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
  },
});
