import { useLayoutEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation, StackActions } from "@react-navigation/native";

export default function FeedScreen() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.Image
        source={require("../assets/tick.png")}
        animation="slideInDown"
        iterationCount={2}
        direction="alternate"
        style={styles.tick}
      />
      <Animatable.Text animation="zoomInUp" style={styles.title}>
        Payment Successful
      </Animatable.Text>
      <Animatable.Text animation="fadeInDown" style={styles.text}>
        Your payment has been processed!
      </Animatable.Text>
      <Animatable.Text animation="fadeInDown" style={styles.text}>
        Details of transaction are included below
      </Animatable.Text>
      <Animatable.Text animation="fadeInUp" style={styles.transaction}>
        Transaction Number : 123456789
      </Animatable.Text>
      <Animatable.View animation="fadeInUp" style={styles.detail}>
        <Text style={styles.text}>TOTAL AMOUNT PAID</Text>
        <Text style={styles.text}>150.25 TL</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" style={styles.detail}>
        <Text style={styles.text}>PAYED BY</Text>
        <Text style={styles.text}>PAYTM</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" style={styles.detail}>
        <Text style={styles.text}>TRANSACTION DATE</Text>
        <Text style={styles.text}>28 aug 2022, 20:09</Text>
      </Animatable.View>
      <Animatable.View
        animation="fadeInUp"
        style={styles.detail}
      ></Animatable.View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.dispatch(StackActions.popToTop());
        }}
      >
        <Text
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#24F384",
            paddingVertical: 20,
            paddingHorizontal: 80,
            fontSize: 18,
            color: "#24F384",
          }}
        >
          BACK TO HOME
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "#00072D",
    justifyContent: "center",
    alignItems: "center",
  },
  tick: {
    resizeMode: "contain",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#24F384",
    marginVertical: 10,
  },
  text: {
    color: "#24F384",
  },
  transaction: {
    fontSize: 16,
    color: "#0077b6",
    marginVertical: 10,
  },
  button: {
    margin: 20,
    backgroundColor: "#00072D",
    display: "flex",
    paddingVertical: 5,
    width: "100%",

    alignItems: "center",
  },
  detail: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 20,
    borderColor: "#24F38440",
    borderTopWidth: 2,
  },
});
