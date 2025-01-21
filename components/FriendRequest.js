import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
  const { userId } = useContext(UserType);
  const navigation = useNavigation();

  const acceptRequest = async (friendRequestId) => {
    console.log("Friend Request id : ", friendRequestId);
    try {
      const response = await fetch(
        "http://10.0.2.2:3000/friend-request/accept",
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
        // Filter out the accepted friend request
        setFriendRequests(
          friendRequests.filter((request) => request._id !== friendRequestId)
        );
        navigation.navigate("Chats");
      }
    } catch (error) {
      console.log("Error accepting the friend request", error);
    }
  };

  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
      }}
    >
      <Image
        style={{ width: 50, height: 50, borderRadius: 25 }}
        source={{ uri: item.image }}
      />
      <Text
        style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10, flex: 1 }}
      >
        {item?.name} sent you a friend request
      </Text>
      <Pressable
        onPress={() => acceptRequest(item._id)}
        style={{ backgroundColor: "#0066b2", padding: 10, borderRadius: 6 }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({});
