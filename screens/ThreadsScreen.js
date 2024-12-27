import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
} from "react-native";
import React, { useContext, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { UserType } from "../UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const ThreadsScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [content, setContent] = useState("");
  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Auth token not found");
        return;
      }

      const decodeToken = jwtDecode(token);
      const userId = decodeToken.userId;
      setUserId(userId);
    } catch (error) {
      console.error("Error fetching usersId:", error);
    }
  };

  fetchUsers();
  const handlePostSubmit = () => {
    const postData = {
      userId: userId,
    };
    console.log(postData);
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
    <SafeAreaView style={{ padding: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text>Nitin_Singh</Text>
      </View>
      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor={"black"}
          placeholder="Type your message... "
          multiline
        />
      </View>
      <View style={{ marginTop: 20 }} />
      <Button onPress={handlePostSubmit} title="Share Post" />
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({});
