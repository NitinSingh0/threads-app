import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";

const HomeScreen = () => {
  const { setUserId } = useContext(UserType); // Use only setUserId from context
  const [userId, setLocalUserId] = useState(null); // Local state for userId
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("Token:", token); // Print token for debugging
        const userId = jwtDecode(token).userId;
        console.log("User ID:", userId);

        setLocalUserId(userId); // Set local state
        setUserId(userId); // Optionally update the context
      } catch (error) {
        console.error("Error decoding token", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:3000/get-posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const handleLike = async (postId) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }
    try {
      const response = await axios.put(
        `http://10.0.2.2:3000/post/${postId}/${userId}/like`
      );
      const updatedPost = response.data;
      const updatedPosts = posts?.map((post) =>
        post?._id === updatedPost._id ? updatedPost : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };
  const handleUnlike = async (postId) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }
    try {
      const response = await axios.put(
        `http://10.0.2.2:3000/post/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      const updatedPosts = posts?.map((post) =>
        post?._id === updatedPost._id ? updatedPost : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };

  return (
    <ScrollView style={{ marginTop: 50, flex: 1, backgroundColor: "white" }}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
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
      </View>
      <View style={{ marginTop: 20 }}>
        {posts?.map((post) => (
          <View
            key={post?._id}
            style={{
              padding: 15,
              borderColor: "#D0D0D0",
              borderTopWidth: 1,
              flexDirection: "row",
              gap: 10,
              marginVertical: 10,
            }}
          >
            <View>
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
            </View>
            <View>
              <Text
                style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}
              >
                {post?.user.name}
              </Text>
              <Text>{post?.content}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 15,
                }}
              >
                {post?.likes?.includes(userId) ? (
                  <AntDesign
                    onPress={() => handleUnlike(post?._id)}
                    name="heart"
                    size={18}
                    color="red"
                  />
                ) : (
                  <AntDesign
                    onPress={() => handleLike(post?._id)}
                    name="hearto"
                    size={18}
                    color="black"
                  />
                )}
                <FontAwesome name="comment-o" size={18} color="black" />
                <Ionicons name="share-social-outline" size={18} color="black" />
              </View>
              <Text style={{ marginTop: 7, color: "gray" }}>
                {post?.likes?.length} likes {post?.replies?.length} reply
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
