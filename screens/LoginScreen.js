import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { API_URL } from "@env";
import axios from "axios";

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSubmit = async (values) => {
    try {
      const response = await axios
        .post(`${API_URL}/Account/Login`, values)
        .then((res) => {
          if (res.status === 200) {
            navigation.navigate("Home");
          }
        })
        .catch((err) => {
          console.log(err.data);
        });
    } catch (err) {
      console.log(err.data);
    }
  };

  return (
    <SafeAreaView>
      <Formik
        initialValues={{ userName: "", password: "" }}
        onSubmit={onSubmit}
        validationSchema={yup.object().shape({
          userName: yup
            .string()
            .min(4, "Username should be at least 4 chars")
            .max(10, "Username should not excced 10 chars")
            .required("Username is required"),
          password: yup
            .string()
            .required("Password is required")
            .min(4)
            .max(10, "password should not excced 10 chars"),
        })}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
          setFieldTouched,
          isValid,
        }) => (
          <View style={styles.container}>
            <Text style={styles.title}>Green</Text>
            <TextInput
              autoCapitalize="none"
              placeholder="Username"
              style={styles.input}
              onChangeText={handleChange("userName")}
              onBlur={() => setFieldTouched("userName")}
              value={values.userName}
            />
            {touched.userName && errors.userName && (
              <Text style={{ fontSize: 12, color: "#FF0D10", paddingLeft: 18 }}>
                {errors.userName}
              </Text>
            )}
            <TextInput
              autoCapitalize="none"
              placeholder="Password"
              style={styles.input}
              onChangeText={handleChange("password")}
              onBlur={() => setFieldTouched("password")}
              value={values.password}
              secureTextEntry={true}
            />
            {touched.password && errors.password && (
              <Text style={{ fontSize: 12, color: "#FF0D10", paddingLeft: 18 }}>
                {errors.password}
              </Text>
            )}
            <TouchableOpacity
              disabled={!isValid}
              onPress={() => handleSubmit()}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Register");
              }}
              style={styles.signup}
            >
              <Text style={styles.signupTitle}>
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "",
  },
  title: {
    color: "#006d77",
    textAlign: "left",
    padding: 20,
    fontWeight: "bold",
    fontSize: 60,
  },
  input: {
    height: 40,
    marginHorizontal: 10,
    marginVertical: 5,
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
  signupTitle: {
    textAlign: "right",
    paddingRight: 20,
    color: "#006d77",
  },
});