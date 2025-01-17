import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList, // Changed from ScrollView to FlatList
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [user, setUser] = useState({
    name: "",
    followers: [],
    postsCount: 0,
    followingCount: 0,
    posts: [],
  });
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:3000/profile/${userId}`
        );
        const { user } = response.data;
        setUser(user);

        // Fetch the user's posts
        const postsResponse = await axios.get(
          `http://10.0.2.2:3000/posts/user/${userId}`
        );
        setPosts(postsResponse.data.posts);
      } catch (error) {
        console.log("Error fetching profile or posts:", error);
      }
    };
    fetchProfile();
  }, [userId]);

  const logout = () => {
    clearAuthToken();
  };

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("cleared auth token");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          style={styles.coverImage}
          source={{ uri: "https://example.com/cover-photo.jpg" }}
        />
        <View style={styles.profileInfo}>
          <Image
            style={styles.profilePicture}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
            }}
          />
          <Text style={styles.username}>{user?.name}</Text>
          <View style={styles.collegeBadge}>
            <Text style={styles.collegeName}>Threds.net</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.academicInfo}>
          <Text style={styles.academicText}>Course: BScIT</Text>
          <Text style={styles.academicText}>Department: Computer Science</Text>
          <Text style={styles.academicText}>Year: 3rd Year</Text>
        </View>

        <View style={styles.interestsSection}>
          <Text style={styles.interestsTitle}>Interests:</Text>
          <Text style={styles.interestsText}>Movie Buff | Musical Nerd</Text>
          <Text style={styles.interestsText}>Love Nature</Text>
        </View>

        <Text style={styles.followersCount}>
          {user?.followers?.length} followers
        </Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          {/* {posts.length} */}
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{0}</Text>
          {/* user?.followers?.length */}
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user?.followingCount}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <Text>{item.content}</Text>{" "}
            {/* Assuming "content" is the post text */}
          </View>
        )}
        keyExtractor={(item) => item._id.toString()} // Assuming "_id" is the post identifier
      />

      <View style={styles.buttonsSection}>
        <Pressable style={styles.editProfileButton}>
          <Text>Edit Profile</Text>
        </Pressable>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <Text>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>College Social Network</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    position: "relative",
    backgroundColor: "#F5F5F5",
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: -70,
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 10,
  },
  collegeBadge: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#D0D0D0",
    borderRadius: 20,
  },
  collegeName: {
    fontSize: 14,
    fontWeight: "500",
  },
  detailsSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  academicInfo: {
    marginBottom: 10,
  },
  academicText: {
    fontSize: 16,
    color: "#333",
  },
  interestsSection: {
    marginBottom: 10,
  },
  interestsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  interestsText: {
    fontSize: 16,
    color: "#555",
  },
  followersCount: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#777",
  },
  buttonsSection: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
    marginBottom: 30,
  },
  editProfileButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  logoutButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#F5F5F5",
  },
  footerText: {
    fontSize: 16,
    color: "#888",
  },
  postItem: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 8,
  },
});
