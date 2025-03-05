import React, { useState } from "react";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; // Add useRoute
import { useCallback } from "react";
import axios from "axios";

const ResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Use useRoute to access route params
  const { userId } = route.params; // Extract userId from route params

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Call the reset password API
      const response = await axios.post(
        "https://your-api-endpoint.com/reset-password",
        {
          userId, // Pass the userId to the API
          oldPassword,
          newPassword,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Password has been reset!", [
          { text: "OK", onPress: () => navigation.navigate("Main") },
        ]);
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("An error occurred. Please try again.");
    }
  }, [userId, oldPassword, newPassword, confirmPassword]);

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <View style={styles.gradient}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Reset Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Old Password"
            placeholderTextColor="#ddd"
            secureTextEntry={true}
            value={oldPassword}
            onChangeText={setOldPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#ddd"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#ddd"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A", // Dark theme base
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
    backgroundColor: "linear-gradient(to bottom, #1E293B, #334155)", // Soft gradient effect
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  formContainer: {
    alignItems: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    fontSize: 16,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    textAlign: "center",
    shadowColor: "#fff",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  button: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: "#ff4d6d",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  errorText: {
    color: "#ff4d6d",
    fontSize: 14,
    marginBottom: 10,
  },
});

export default ResetPassword;
