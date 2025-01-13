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
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };
    axios
      .post("http://10.0.2.2:3000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "You have been registered successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration failed",
          "An error occurred during registration"
        );
        console.log("error", error.response?.data || error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/icon.png")} />
      </View>
      <KeyboardAvoidingView>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>Create your Account</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              style={styles.icon}
              name="person"
              size={24}
              color="gray"
            />
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor="gray"
              style={styles.input}
              placeholder="Enter your name"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              style={styles.icon}
              name="email"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor="gray"
              style={styles.input}
              placeholder="Enter your email"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <AntDesign style={styles.icon} name="lock" size={24} color="gray" />
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholderTextColor="gray"
              style={styles.input}
              placeholder="Enter your password"
            />
          </View>
        </View>

        {/* Register Button */}
        <Pressable onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        {/* Navigate to Login */}
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  logoContainer: {
    marginTop: 50,
  },
  logo: {
    width: 250,
    height: 200,
    resizeMode: "contain",
  },
  inputWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    marginTop: 30,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    color: "gray",
    marginVertical: 10,
    width: 300,
    fontSize: 16,
  },
  button: {
    width: 200,
    backgroundColor: "black",
    padding: 15,
    borderRadius: 6,
    marginTop: 40,
    alignSelf: "center",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  linkContainer: {
    marginTop: 10,
  },
  linkText: {
    textAlign: "center",
    fontSize: 16,
    color: "#007FFF",
  },
});
