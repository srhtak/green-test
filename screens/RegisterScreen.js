import { useNavigation, CommonActions } from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useDispatch } from "react-redux";

export default function HomeScreen() {
  const API_URL = process.env.API_URL;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSubmit = async (values) => {
    setIsLoading(true);
    const response = await axios
      .post(`${API_URL}/Account/Register`, values)
      .then((res) => {
        if (res.status === 200) {
          dispatch(setAuthToken({ token: `${res.data.value.token}` }));
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: "Home" }],
            })
          );
          console.log(values);
          console.log(res.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
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
          handleSubmit,
          values,
          touched,
          errors,
          setFieldTouched,
          isSubmitting,
        }) => (
          <View style={styles.container}>
            <Text style={styles.title}>YEŞİL</Text>
            <TextInput
              autoCapitalize="none"
              placeholder="Name"
              placeholderTextColor="#FFFFFF"
              style={styles.input}
              onChangeText={handleChange("name")}
              onBlur={() => setFieldTouched("name")}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.validationError}>{errors.name}</Text>
            )}
            <TextInput
              autoCapitalize="none"
              placeholder="Surname"
              placeholderTextColor="#FFFFFF"
              style={styles.input}
              onChangeText={handleChange("surName")}
              onBlur={() => setFieldTouched("surName")}
              value={values.surName}
            />
            {touched.surName && errors.surName && (
              <Text style={styles.validationError}>{errors.surName}</Text>
            )}
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
              placeholder="Email"
              placeholderTextColor="#FFFFFF"
              style={styles.input}
              onChangeText={handleChange("eMail")}
              onBlur={() => setFieldTouched("eMail")}
              value={values.eMail}
            />
            {touched.eMail && errors.eMail && (
              <Text style={styles.validationError}>{errors.eMail}</Text>
            )}
            <TextInput
              placeholder="Phone number"
              placeholderTextColor="#FFFFFF"
              style={styles.input}
              onChangeText={handleChange("phoneNumber")}
              onBlur={() => setFieldTouched("phoneNumber")}
              value={values.phoneNumber}
            />
            {touched.phoneNumber && errors.phoneNumber && (
              <Text style={styles.validationError}>{errors.phoneNumber}</Text>
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
    backgroundColor: "#00072D",
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
  signinTitle: {
    textAlign: "right",
    paddingRight: 20,
    color: "#24F384",
  },
  validationError: { fontSize: 12, color: "#FF285C", paddingLeft: 18 },
});
