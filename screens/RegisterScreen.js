import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { API_URL } from "@env";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSubmit = async (values) => {
    const response = await axios
      .post(`${API_URL}/Account/Register`, values)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.data);
      });
  };

  return (
    <SafeAreaView>
      <Formik
        initialValues={{
          name: "",
          surName: "",
          userName: "",
          password: "",
          eMail: "",
          phoneNumber: "",
        }}
        onSubmit={onSubmit}
        validationSchema={yup.object().shape({
          name: yup
            .string()
            .min(4, "Name should be at least 4 chars")
            .max(10, "Name should not excced 10 chars")
            .required("Name is required"),
          surName: yup.string().required("Surname is required"),
          userName: yup
            .string()
            .min(4, "Username should be at least 4 chars")
            .max(10, "Username should not excced 10 chars")
            .required("Username is required"),
          password: yup
            .string()
            .required("Password is required")
            .matches(
              /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
              "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
          eMail: yup
            .string()
            .required("Email is required")
            .email("Email is invalid"),
          phoneNumber: yup
            .string()
            .max(10, "phone number should not excced 10 chars")
            .matches(phoneRegExp, "Phone number is invalid"),
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
          isSubmitting,
        }) => (
          <View style={styles.container}>
            <Text style={styles.title}>Green</Text>
            <TextInput
              autoCapitalize="none"
              placeholder="Name"
              style={styles.input}
              onChangeText={handleChange("name")}
              onBlur={() => setFieldTouched("name")}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={{ fontSize: 12, color: "#FF0D10", paddingLeft: 18 }}>
                {errors.name}
              </Text>
            )}
            <TextInput
              autoCapitalize="none"
              placeholder="Surname"
              style={styles.input}
              onChangeText={handleChange("surName")}
              onBlur={() => setFieldTouched("surName")}
              value={values.surName}
            />
            {touched.surName && errors.surName && (
              <Text style={{ fontSize: 12, color: "#FF0D10", paddingLeft: 18 }}>
                {errors.surName}
              </Text>
            )}
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
              placeholder="Email"
              style={styles.input}
              onChangeText={handleChange("eMail")}
              onBlur={() => setFieldTouched("eMail")}
              value={values.eMail}
            />
            {touched.eMail && errors.eMail && (
              <Text style={{ fontSize: 12, color: "#FF0D10", paddingLeft: 18 }}>
                {errors.eMail}
              </Text>
            )}
            <TextInput
              placeholder="Phone number"
              style={styles.input}
              onChangeText={handleChange("phoneNumber")}
              onBlur={() => setFieldTouched("phoneNumber")}
              value={values.phoneNumber}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text style={{ fontSize: 12, color: "#FF0D10", paddingLeft: 18 }}>
                {errors.phoneNumber}
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
              onPress={handleSubmit}
              style={styles.submitButton}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text style={styles.signinTitle}>
                Already have an account? Log in
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
  signinTitle: {
    textAlign: "right",
    paddingRight: 20,
    color: "#006d77",
  },
});