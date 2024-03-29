import * as React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";
import { useDispatch, useSelector } from "react-redux";
import { setInvoice } from "../slices/navSlice";
import { selectInvoice, selectToken } from "../slices/navSlice";
import { useNavigation } from "@react-navigation/native";

export default function BikeInfoScreen({ route, navigation }) {
  const { photo } = route.params;
  const [rate, setRate] = React.useState(0);
  const dispatch = useDispatch();
  const invoice = useSelector(selectInvoice);
  const jwt = useSelector(selectToken);
  const navigate = useNavigation();

  function ratingCompleted(rating) {
    setRate(rating);
  }

  const handleReview = async () => {
    dispatch(
      setInvoice({
        ...invoice,
        rate: rate,
      })
    );

    navigate.navigate("FeedBack");
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.uri }} style={styles.images} />
      <Text>{JSON.stringify(invoice)}</Text>
      <AirbnbRating
        style={{ marginTop: 20 }}
        onFinishRating={ratingCompleted}
        count={5}
        reviews={["Terrible", "Bad", "Okay", "Good", "Great"]}
        defaultRating={3}
        size={20}
        selectedColor="#52b788"
        reviewColor="#52b788"
        reviewSize={40}
      />
      <TouchableOpacity onPress={handleReview} style={styles.button}>
        <Text styles={styles.button_text}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "10%",
  },
  images: {
    width: "80%",
    height: "40%",
    borderRadius: 4,
    transform: [{ rotate: "-90deg" }],
  },
  button: {
    height: "8%",
    width: "80%",
    backgroundColor: "#52b788",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    margin: "3%",
    color: "white",
  },
});
