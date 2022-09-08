import { Camera, CameraType } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const navigation = useNavigation();
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (!permission) {
        await requestPermission();
      }
    })();
  }, []);

  async function takePicture() {
    console.log("Button Pressed");
    if (cameraRef) {
      console.log("Taking photo");
      const options = {
        quality: 1,
        base64: false,
        fixOrientation: true,
        exif: true,
        skipProcessing: false,
      };
      await cameraRef.current.takePictureAsync(options).then((photo) => {
        photo.exif.Orientation = 1;
        navigation.navigate("BikeInfo", { photo: photo });
        console.log(photo);
      });
    }
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        onCameraReady={() => {
          console.log("camera ready");
        }}
        autoFocus="on"
        style={styles.camera}
        type={type}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 20,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={takePicture}
          ></TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  button: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    backgroundColor: "#00bbf9",
    borderRadius: 50,
    shadowOffset: {
      width: 1,
      height: 5.5,
    },
    elevation: 6,
  },
});
