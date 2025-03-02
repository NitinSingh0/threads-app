import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { UserType } from "../UserContext";
import { jwtDecode } from "jwt-decode";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  console.log(userId);
  const [requestSent, setRequestSent] = useState(false);
  const sendFollow = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch(
        "https://campusconnect-phi.vercel.app/follow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentUserId, selectedUserId }),
        }
      );
      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error message", error);
    }
  };

  const handleUnfollow = async (targetId) => {
    try {
      const response = await fetch(
        "https://campusconnect-phi.vercel.app/users/unfollow",
        {
          // Removed extra '/'
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            loggedInUserId: userId, // Correct property name
            targetUserId: targetId,
          }),
        }
      );
      if (response.ok) {
        setRequestSent(false);
        console.log("Unfollowed successfully");
      } else {
        const errorData = await response.json();
        console.log("Error:", errorData.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        <Image
          style={styles.profileImage}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text style={styles.name}>{item?.name}</Text>

        {requestSent || item?.followers?.includes(userId) ? (
          <Pressable
            onPress={() => handleUnfollow(item?._id)}
            style={styles.followButton}
          >
            <Text style={styles.followButtonText}>Following</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => sendFollow(userId, item._id)}
            style={styles.followButton}
          >
            <Text style={styles.followButtonText}>Follow</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "contain",
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
    color: "#333",
  },
  followButton: {
    borderColor: "#D0D0D0",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 10,
    width: 100,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  followButtonText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
});

