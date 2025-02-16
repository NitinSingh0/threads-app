import React, { useRef, useState } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import Fonts from "../common/assets/fonts";

export default function OTPScreen({ navigation }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) {
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (key, index) => {
    if (key === "Backspace" && index > 0 && otp[index] === "") {
      inputs.current[index - 1].focus();
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 4) {
      navigation.navigate("ResetPassword");
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.mainCon}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </Pressable>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>An 4-digit code has been sent to</Text>
        <Text style={styles.phone}>+91 1234567890</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpBox}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleBackspace(nativeEvent.key, index)
              }
              ref={(el) => (inputs.current[index] = el)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={verifyOtp}>
          <Text style={styles.submitText}>Verify</Text>
        </TouchableOpacity>

        <Pressable onPress={() => console.log("Resend OTP")}>
          <Text style={styles.resendOtp}>Resend OTP</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainCon: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backBtn: {
    fontSize: 30,
    color: "#FFF",
  },
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.type.NotoSansExtraBold,
    color: "#FFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.type.NotoSansRegular,
    color: "#AAA",
  },
  phone: {
    fontSize: 18,
    fontFamily: Fonts.type.NotoSansSemiBold,
    color: "#FFF",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  otpBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#222",
    textAlign: "center",
    fontSize: 24,
    color: "#FFF",
    fontFamily: Fonts.type.NotoSansBold,
    borderWidth: 2,
    borderColor: "#444",
  },
  submitBtn: {
    marginTop: 30,
    backgroundColor: "#0057ff",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  submitText: {
    fontSize: 18,
    fontFamily: Fonts.type.NotoSansSemiBold,
    color: "#FFF",
  },
  resendOtp: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: Fonts.type.NotoSansSemiBold,
    color: "#FFA500",
  },
});
