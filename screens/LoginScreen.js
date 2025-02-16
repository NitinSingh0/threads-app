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
      .post("http:/10.0.2.2:3000/login", user)
      .then((response) => {
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token);
        navigation.navigate("Main");
      })
      .catch(() => {
        Alert.alert("Login error", "Invalid email or password.");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
        <Image style={styles.logo} source={require("../assets/icon.png")} />
      </Animated.View>
      <KeyboardAvoidingView style={styles.formContainer}>
        <Text style={styles.title}>Sign In to Your Account</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#6A11CB" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <AntDesign name="lock" size={24} color="#6A11CB" />
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
        </View>
        <View style={styles.optionsRow}>
          <Text style={styles.optionText}>Keep me logged in</Text>
          <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </Pressable>
        </View>
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text style={styles.registerLink}>Sign Up</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 5,
  },
  logo: {
    width: 250,
    height: 200,
    resizeMode: "contain",
  },
  formContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginTop:0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#F9F9F9",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionText: {
    fontSize: 14,
    color: "#555",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#6A11CB",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#6A11CB",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    textAlign: "center",
    color: "#555",
    fontSize: 14,
  },
  registerLink: {
    color: "#6A11CB",
    fontWeight: "bold",
  },
});
