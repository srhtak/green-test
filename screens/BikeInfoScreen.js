import * as React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";

export default function BikeInfoScreen({ route, navigation }) {
  const { photo } = route.params;

  function ratingCompleted(rating) {
    console.log("Rating is: " + rating);
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.images} />
      <AirbnbRating
        style={{ marginTop: 20 }}
        onFinishRating={ratingCompleted}
        count={5}
        reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
        defaultRating={3}
        size={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  images: {
    width: "80%",
    height: "50%",
    transform: [{ rotate: "-90deg" }],
  },
  rating: {
    width: "80%",
    height: "50%",
  },
});
