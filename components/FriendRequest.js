import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userId } = useContext(UserType);
  const navigation = useNavigation();

  const acceptRequest = async (friendRequestId) => {
    try {
      const response = await fetch(
        "https://campusconnect-phi.vercel.app/friend-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: friendRequestId,
            recepientId: userId,
          }),
        }
      );
      if (response.ok) {
        // Remove accepted request from UI
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== friendRequestId)
        );
        navigation.navigate("Chats");
      }
    } catch (error) {
      console.log("Error accepting the friend request", error);
    }
  };

  const declineRequest = async (friendRequestId) => {
    try {
      const response = await fetch(
        "https://campusconnect-phi.vercel.app/friend-request/decline",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: friendRequestId,
            recepientId: userId,
          }),
        }
      );
      if (response.ok) {
        // Remove declined request from UI
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== friendRequestId)
        );
      }
    } catch (error) {
      console.log("Error declining the friend request", error);
    }
  };

  return (
    <Pressable style={styles.container}>
      <Image style={styles.image} source={{ uri: item.image }} />
      <Text style={styles.text}>{item?.name} sent you a friend request</Text>
      <Pressable
        onPress={() => acceptRequest(item._id)}
        style={styles.acceptButton}
      >
        <Text style={styles.buttonText}>Accept</Text>
      </Pressable>
      <Pressable
        onPress={() => declineRequest(item._id)}
        style={styles.declineButton}
      >
        <Text style={[styles.buttonText, { color: "red" }]}>Decline</Text>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  acceptButton: {
    backgroundColor: "#0066b2",
    padding: 10,
    borderRadius: 6,
  },
  declineButton: {
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 6,
    marginLeft:4,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
});

export default FriendRequest;
