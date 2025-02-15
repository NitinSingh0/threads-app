import React from "react";
import { TouchableOpacity, Image, View, StyleSheet } from "react-native";

const ImageOptionInputTile = ({ isSelected, imgUrl, onSelect }) => {
  const getBorderColor = () => {
    if (isSelected) return "#3B82F6"; // Primary color for selected state
    return "transparent"; // Border transparent when not selected
  };

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: getBorderColor() }]}
      onPress={onSelect}
    >
      <Image
        source={{ uri: imgUrl }}
        style={styles.image}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#E5E7EB", // Light background color (slate-200/40)
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 140, // Adjust as needed
  },
});

export default ImageOptionInputTile;
