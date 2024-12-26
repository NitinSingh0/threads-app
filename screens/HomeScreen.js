import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { UserType } from "../UserContext";

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodeToken = jwtDecode(token);
      const userId = decodeToken.userId;
      setUserId(userId);
    };

    fetchUsers();
  }, []);
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
