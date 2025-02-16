import React, { Component } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";



export default class ResetPassword extends Component {
  render() {
    return (
      <KeyboardAvoidingView behavior="position" style={styles.mainCon}>
        <LinearGradient colors={["#1a1a2e", "#16213e"]} style={styles.gradient}>
          <View style={{ padding: 20 }}>
            <Pressable onPress={() => this.props.navigation.goBack(null)}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
          </View>
          <View style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={"New Password"}
                placeholderTextColor={"#aaa"}
                secureTextEntry={true}
              />
              <TextInput
                style={styles.input}
                placeholder={"Confirm Password"}
                placeholderTextColor={"#aaa"}
                secureTextEntry={true}
              />
            </View>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  mainCon: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    fontSize: 16,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
