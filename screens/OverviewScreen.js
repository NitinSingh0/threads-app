import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import User from "../components/User1";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);
  const handleLogout = async () => {
    try {
      // Clear the auth token
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logged out", "You have been logged out successfully.");
      // Navigate to Login screen
      navigation.replace("Login");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "An error occurred during logout.");
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Campus Connect (ChitChat)
        </Text>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons
            onPress={() => {
              navigation.navigate("Chats");
            }}
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
          />
          <MaterialIcons
            onPress={() => {
              navigation.navigate("Friends");
            }}
            name="people-outline"
            size={24}
            color="black"
          />
          <MaterialIcons
            onPress={handleLogout}
            name="logout"
            size={24}
            color="black"
          />
        </View>
      ),
    });
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      console.log("User Id : ", userId);
      axios
        .get(`https://campusconnect-phi.vercel.app/user/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("Error retriving users ", error.message);
        });
    };
    fetchUsers();
  }, []);
  console.log("Users : ", users);
  return (
    <View>
      <View style={{ padding: 10 }}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
