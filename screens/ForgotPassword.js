import React, { Component } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
  Animated,
  Easing,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import Fonts from "../common/assets/fonts";

export default class ForgotPasswordScreen extends Component {
  state = {
    fadeAnim: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <ImageBackground
       
        style={styles.background}
      >
        <KeyboardAvoidingView behavior="padding" style={styles.mainCon}>
          <Animated.View
            style={[styles.container, { opacity: this.state.fadeAnim }]}
          >
            <Pressable onPress={() => this.props.navigation.goBack(null)}>
              <FontAwesome name="arrow-left" size={24} color="#fff" />
            </Pressable>
            <View style={styles.card}>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Don't worry! It happens. Enter your email below to reset your
                password.
              </Text>
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="envelope"
                  size={20}
                  color="#0057ff"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email ID"
                  placeholderTextColor="#888"
                />
              </View>
              <Pressable
                style={styles.button}
                onPress={() => this.props.navigation.navigate("EnterOTP")}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
        resizeMode: "cover",
    backgroundColor:"#000",
  },
  mainCon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 25,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.type.NotoSansExtraBold,
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.type.NotoSansRegular,
    color: "#444",
    textAlign: "center",
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#000",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0057ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#0057ff",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: Fonts.type.NotoSansBlack,
  },
});
