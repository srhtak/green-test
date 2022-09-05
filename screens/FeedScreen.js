import { View, Text, StyleSheet, Image } from "react-native";
import * as Animatable from "react-native-animatable";

export default function FeedScreen() {
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
        <Text>TOTAL AMOUNT PAID</Text>
        <Text>150.25 TL</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" style={styles.detail}>
        <Text>PAYED BY</Text>
        <Text>PAYTM</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" style={styles.detail}>
        <Text>TRANSACTION DATE</Text>
        <Text>28 aug 2022, 20:09</Text>
      </Animatable.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  tick: {
    resizeMode: "contain",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#57cc99",
    marginVertical: 10,
  },
  text: {
    fontSize: 17,
    color: "#c0c0c0",
  },
  transaction: {
    fontSize: 16,
    color: "#0077b6",
    marginVertical: 10,
  },
  detail: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomColor: "#c0c0c0",
    borderBottomWidth: 1,
  },
});
