import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CharAvatar = ({ name, width, height, style }) => {
    const getInitials = (name) => {
      if (!name) return "";
      const words = name.split(" ");
      let initials = "";

      for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
      }
      return initials.toUpperCase();
    };
  return (
    <View
      style={[
        styles.avatar,
        { width: width || 48, height: height || 48 }, // Default to 48 for width/height if not provided
        style, // Apply custom styles
      ]}
    >
      <Text style={styles.initials}>{getInitials(name || "")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24, // Ensure it is circular
    backgroundColor: "#f3f4f6", // Gray background
  },
  initials: {
    color: "#1f2937", // Text color (gray-900)
    fontSize: 18,
    fontWeight: "500", // Medium weight
  },
});

export default CharAvatar;
