import { selectToken } from "../slices/navSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

const getBike = async (bikeId) => {
  const API_URL = process.env.API_URL;
  const [bike, setBike] = useState(null);
  const jwt = useSelector(selectToken);
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + jwt.token,
    },
  };

  await axios
    .get(`${API_URL}/Bike/GetInfo?BikeId=${bikeId}`, config)
    .then((res) => {
      console.log(res.data);
      setBike(res.data);
    })
    .catch((error) => {
      console.log(error);
    });

  return bike;
};

export default getBike;
