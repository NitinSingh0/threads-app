import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import CharAvatar from "./CharAvatar";
import moment from "moment";

const UserProfileInfo = ({ imgUrl, fullname, username, createdAt }) => {
  return (
    <View style={styles.container}>
      {imgUrl ? (
        <Image source={{ uri: imgUrl }} style={styles.avatar} />
      ) : (
        <CharAvatar fullName={fullname} style={{ fontSize: 13 }} />
      )}
      <View>
        <Text style={styles.fullName}>
          {fullname} <Text style={styles.dot}>•</Text>{" "}
          <Text style={styles.timestamp}>
            {createdAt && moment(createdAt).fromNow()}
          </Text>
        </Text>
        <Text style={styles.username}>@{username}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Adjust as needed
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  fullName: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
    lineHeight: 16,
  },
  dot: {
    fontSize: 14,
    color: "gray",
    marginHorizontal: 4,
  },
  timestamp: {
    fontSize: 10,
    color: "gray",
  },
  username: {
    fontSize: 12,
    color: "gray",
    lineHeight: 16,
  },
});

export default UserProfileInfo;
