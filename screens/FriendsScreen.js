import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";

const FriendsScreen = () => {
  const { userId } = useContext(UserType);
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
          image : friendRequest.image,
        }));
        setFriendRequests(friendRequestData);
        
      }
    } catch (error) {
      console.log("Error message ", error.message);
    }
  };
  console.log(friendRequests);
  return (
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
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({});
