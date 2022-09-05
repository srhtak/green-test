import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { store } from "./store";
import { RootSiblingParent } from "react-native-root-siblings";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import ScannerScreen from "./screens/ScannerScreen";
import CameraScreen from "./screens/CameraScreen";
import RegisterScreen from "./screens/RegisterScreen";
import BikeInfoScreen from "./screens/BikeInfoScreen";
import FeedScreen from "./screens/FeedScreen";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#00072D",
    

  },
};

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator initialRouteName="Register">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Scanner" component={ScannerScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="BikeInfo" component={BikeInfoScreen} />
            <Stack.Screen name="FeedBack" component={FeedScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </RootSiblingParent>
  );
}
