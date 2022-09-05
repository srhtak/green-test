import { useNavigation, CommonActions } from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { API_URL } from "@env";
import axios from "axios";
import Toast from "react-native-root-toast";
import { setAuthToken } from "../slices/navSlice";

export default function HomeScreen() {
  const API_URL = process.env.API_URL;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSubmit = async (values) => {
    console.log(values);
    try {
      setIsLoading(true);
      await axios
        .post(`${API_URL}/Account/Login`, values)
        .then(async (res) => {
          if (res.data.resultTypeId === 200) {
            dispatch(setAuthToken({ token: `${res.data.value.token}` }));
            setIsLoading(false);
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{ name: "Home" }],
              })
            );
          } else if (res.data.resultTypeId === 400) {
            Toast.show("Kullanıcı adı veya şifre yanlış", {
              duration: Toast.durations.LONG,
              position: Toast.positions.BOTTOM,
              backgroundColor: "red",
              textColor: "white",
            });
            setIsLoading(false);
            console.log(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } catch (err) {
      console.log(err.data);
      setIsLoading(false);
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
          password: yup.string().required("Password is required").min(4),
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
            <Text style={styles.title}>YEŞİL</Text>
            <TextInput
              autoCapitalize="none"
              placeholder="Username"
              placeholderTextColor="#FFFFFF"
              style={styles.input}
              onChangeText={handleChange("userName")}
              onBlur={() => setFieldTouched("userName")}
              value={values.userName}
            />
            {touched.userName && errors.userName && (
              <Text style={styles.validationError}>{errors.userName}</Text>
            )}
            <TextInput
              autoCapitalize="none"
              placeholder="Password"
              placeholderTextColor="#FFFFFF"
              style={styles.input}
              onChangeText={handleChange("password")}
              onBlur={() => setFieldTouched("password")}
              value={values.password}
              secureTextEntry={true}
            />
            {touched.password && errors.password && (
              <Text style={styles.validationError}>{errors.password}</Text>
            )}
            {isLoading ? (
              <ActivityIndicator size="large" color="#24F384" />
            ) : (
              <TouchableOpacity
                onPress={() => handleSubmit()}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: "#00072D",
    paddingTop: 23,
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  title: {
    color: "#24F384",
    textAlign: "left",
    padding: 20,
    fontWeight: "bold",
    fontSize: 60,
  },
  input: {
    color: "#24F384",
    height: 40,
    marginHorizontal: 10,
    marginVertical: 5,
    borderColor: "#24F384",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: "#24F384",
    padding: 10,
    margin: 15,
    height: 40,
    borderRadius: 5,
    shadowColor: "#000",
  },
  submitButtonText: {
    color: "#00072D",
    textAlign: "center",
    fontWeight: "bold",
  },
  signupTitle: {
    textAlign: "right",
    paddingRight: 20,
    color: "#24F384",
  },
  validationError: { fontSize: 12, color: "#FF285C", paddingLeft: 18 },
});
