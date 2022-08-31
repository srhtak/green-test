import axios from "axios";
import { API_URL } from "@env";
import { useSelector } from "react-redux";
import { selectToken } from "../slices/navSlice";
import { useState } from "react";

const getUser = async () => {
  const [user, setUser] = useState(null);
  const token = useSelector(selectToken);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
  };

  await axios
    .get(`${API_URL}/UserClient/GetUser`, config)
    .then((res) => {
      console.log(res.data);
      setUser(res.data);
    })
    .catch((error) => {
      console.log(error);
    });

  return user;
};

export default getUser;
