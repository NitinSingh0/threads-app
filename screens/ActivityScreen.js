import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { UserType } from "../UserContext";
import User from "../components/User1";
import FriendRequest from "../components/FriendRequest";

const ActivityScreen = () => {
  const [selectedButton, setSelectedButton] = useState("people");
  //const jwtDecode = require("jwt-decode");

  const [users, setUsers] = useState([]);
  const {userId, setUserId } = useContext(UserType);

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

  //fetch only friends list
  const [friendsList, setFriendsList] = useState([]);
   useEffect(() => {
     const fetchFriends = async () => {
       try {
         const token = await AsyncStorage.getItem("authToken");
         if (!token) {
           console.error("Auth token not found");
           return;
         }

         const decodeToken = jwtDecode(token);
         const userId = decodeToken.userId;
         setUserId(userId);

         const response = await axios.get(
           `http://10.0.2.2:3000/user/friendslist/${userId}`
         );
         setFriendsList(response.data);
       } catch (error) {
         console.error("Error fetching users:", error);
       }
     };

     fetchFriends();
   }, [setUserId]);



  const [friendRequests, setFriendRequests] = useState([]);
  useEffect(() => {
    fetchFriendRequests();
  }, []);
  const fetchFriendRequests = async () => {
    console.log("User Id : ", userId);
    try {
      const response = await axios.get(
        `http://10.0.2.2:3000/friend-request/${userId}`
      );
      if (response.status === 200) {
        const friendRequestData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));
        setFriendRequests(friendRequestData);
      }
    } catch (error) {
      console.log("Error message ", error.message);
    }
  };
  console.log("Friend Request: ",friendRequests);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Engagements</Text>

        <View style={styles.buttonGroup}>
          {[ "all", "requests"].map((buttonName) => (
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
            <View style={styles.userList}>
              {users?.length > 0 ? (
                users.map((item, index) => <User key={index} item={item} />)
              ) : (
                <Text style={styles.noDataText}>No users found.</Text>
              )}
            </View>
          )}
          {selectedButton === "all" && (
            <View style={styles.userList}>
              {users?.length > 0 ? (
                users.map((item, index) => <User key={index} item={item} />)
              ) : (
                <Text style={styles.noDataText}>No users found.</Text>
              )}
            </View>
          )}
          {selectedButton === "requests" && (
            <View style={{ padding: 10, marginHorizontal: 12 }}>
              {friendRequests.length > 0 && <Text> Your Friend Requests!</Text>}
              {friendRequests.map((item, index) => (
                <FriendRequest
                  key={index}
                  item={item}
                  friendRequests={friendRequests}
                  setFriendRequests={setFriendRequests}
                />
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
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ced4da",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: "#343a40",
    borderColor: "#343a40",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
  },
  selectedButtonText: {
    color: "#ffffff",
  },
  userList: {
    marginTop: 15,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6c757d",
    marginTop: 20,
  },
});
