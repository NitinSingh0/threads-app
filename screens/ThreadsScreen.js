import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TextInput,
} from "react-native";
import React, { useContext, useState } from "react";
import { UserType } from "../UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const ThreadsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [content, setContent] = useState("");
  // const jwtDecode = require("jwt-decode");

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Auth token not found");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    } catch (error) {
      console.error("Error fetching userId:", error);
    }
  };

  fetchUsers();

  const handlePostSubmit = () => {
    const postData = {
      userId: userId,
    };
    if (content) {
      postData.content = content;
    }
    axios
      .post("http://10.0.2.2:3000/create-post", postData)
      .then((response) => {
        console.log(response.data.message);
        setContent("");
      })
      .catch((error) => {
        console.log(
          "Error creating post:",
          error.response?.data || error.message
        );
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          style={styles.profileImage}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text style={styles.profileName}>Nitin_Singh</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholder="Express yourself here... "
          placeholderTextColor={"gray"}
          multiline
        />
      </View>
      <Button onPress={handlePostSubmit} title="Send Voice" color="#007AFF" />
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
    marginRight: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343a40",
  },
  inputContainer: {
    marginBottom: 20,
    padding: 10,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  input: {
    fontSize: 16,
    color: "#495057",
    textAlignVertical: "top",
    minHeight: 100,
  },
});
