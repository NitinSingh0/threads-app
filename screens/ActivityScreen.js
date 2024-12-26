import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode, { jwtDecode } from "jwt-decode";

import axios from "axios";
import { UserType } from "../UserContext";
import User from "../components/User";

const ActivityScreen = () => {
  const [selectedButton, setSelectedButton] = useState("people");
  const [users, setUsers] = useState([]);
  const { setUserId } = useContext(UserType); // Ensure this is correctly set up in UserContext

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  useEffect(() => {
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

        const response = await axios.get(`http://10.0.2.2:3000/user/${userId}`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [setUserId]);

  return (
    <ScrollView style={{ marginTop: 50 }}>
      <View style={{ padding: 10 }}>
        <Text style={styles.title}>Activity</Text>

        <View style={styles.buttonGroup}>
          {["people", "all", "requests"].map((buttonName) => (
            <TouchableOpacity
              key={buttonName}
              onPress={() => handleButtonClick(buttonName)}
              style={[
                styles.button,
                selectedButton === buttonName && styles.selectedButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedButton === buttonName && styles.selectedButtonText,
                ]}
              >
                {buttonName.charAt(0).toUpperCase() + buttonName.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View>
          {selectedButton === "people" && (
           
            <View style={{ marginTop: 20 }}>
              
              {users?.map((item, index) => (
                <User key={index} item={item} />    
              ))}
              </View>
              
          )}
        </View>

        
      </View>
    </ScrollView>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderColor: "#D0D0D0",
    borderRadius: 6,
    borderWidth: 0.7,
  },
  selectedButton: {
    backgroundColor: "black",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  selectedButtonText: {
    color: "white",
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#D0D0D0",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
