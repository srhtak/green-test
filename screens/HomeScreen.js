import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import Map from "../components/Map";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.Map}>
          <Map />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
    height: "100%",
    width: "100%",
    flexDirection: "column",
  },
  Map: {
    width: "100%",
    height: "100%",
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: "#006d77",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: "#006d77",
    padding: 10,
    margin: 15,
    height: 40,
    borderRadius: 5,
    shadowColor: "#000",
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
