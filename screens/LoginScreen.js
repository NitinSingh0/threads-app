import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  Pressable,
  TextInput,
  Alert,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logoOpacity] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setTimeout(() => {
            navigation.replace("Main");
          }, 400);
        }
      } catch (error) {
        console.log("Error checking login status:", error);
      }
    };
    checkLoginStatus();

    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = () => {
    const user = { email, password };
    axios
      .post("https://campusconnect-phi.vercel.app/login", user)
      .then((response) => {
        if (response.data.forcePasswordChange) {
          // Navigate to the Reset Password screen
          navigation.navigate("ResetPassword", {
            userId: response.data.userId,
          });
        } else {
          // Save the token and navigate to the Main screen
          const token = response.data.token;
          AsyncStorage.setItem("authToken", token);
          navigation.navigate("Main");
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          Alert.alert("Login error", error.response.data.message);
        } else {
          Alert.alert("Login error", "Invalid email or password.");
        }
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
        <Image style={styles.logo} source={require("../assets/icon.png")} />
      </Animated.View>
      <KeyboardAvoidingView style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#5A67D8" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <AntDesign name="lock" size={24} color="#5A67D8" />
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#666"
            style={styles.input}
          />
        </View>
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D3748",
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#EDF2F7",
    width: "100%",
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#2D3748",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#5A67D8",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#5A67D8",
    fontWeight: "500",
  },
});
