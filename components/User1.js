import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  useEffect(() => {
    const fetchFriendRequests = async () => {
      console.log("UserID : ", userId);
      try {
        const response = await fetch(
          `https://campusconnect-phi.vercel.app/friend-requests/sent/${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setFriendRequests(data);
        } else {
          console.log("Error : ", response.status);
        }
      } catch (error) {
        console.log("Error sent friend request : ", error);
      }
    };
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        console.log("User id in friends page : ", userId);
        const response = await fetch(
          `https://campusconnect-phi.vercel.app/friends/${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setUserFriends(data);
          console.log("User Fiends : ", userFriends);
        } else {
          console.log("Error retreiving user friends ", response.status);
        }
      } catch (error) {
        console.log("Error fetch user friend: ", error);
      }
    };
    fetchUserFriends();
  }, []);
  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch(
        "https://campusconnect-phi.vercel.app/friend-request",
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
      console.log("Error message ", error);
    }
  };
  console.log("friends request sent : ", friendRequests);
  console.log("User friends : ", userFriends);
  return (
    <Pressable
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
      }}
    >
      <View>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            resizeMode: "cover",
          }}
          source={{ uri: item.image }}
        />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item?.name}</Text>
        <Text
          style={{
            marginTop: 4,
            color: "gray",
          }}
        >
          {item?.email}
        </Text>
      </View>
      {userFriends.includes(item._id) ? (
        <Pressable
          style={{
            backgroundColor: "#82CD47",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Friends
          </Text>
        </Pressable>
      ) : requestSent ||
        friendRequests.some((friend) => friend._id === item._id) ? (
        <Pressable
          style={{
            backgroundColor: "gray",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Request sent
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "gray",
            padding: 10,
            borderRadius: 6,
            width: 105,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Add friend
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({});
