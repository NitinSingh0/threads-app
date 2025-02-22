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
    const user = { name, email, password };
    axios
      .post("http://10.0.2.2:3000/register", user)
      .then(() => {
        Alert.alert("Success", "You have been registered successfully");
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch(() => {
        Alert.alert("Error", "Registration failed. Please try again.");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/icon.png")} />
      </View>
      <KeyboardAvoidingView style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.title}>Create Your Account</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person"
              size={24}
              color="#ffb703"
              style={styles.icon}
            />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#aaa"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={24}
              color="#fb8500"
              style={styles.icon}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <AntDesign
              name="lock"
              size={24}
              color="#219ebc"
              style={styles.icon}
            />
            <TextInput
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#aaa"
              style={styles.input}
            />
          </View>
        </View>
        <Pressable onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
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
    backgroundColor: "#1e1e2e",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 180,
    resizeMode: "contain",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#2b2b3a",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 0,
  },
  inputWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#ffd166",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: "#3b3b4f",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 15,
  },
  linkText: {
    fontSize: 16,
    color: "#f4a261",
    textAlign: "center",
  },
});
