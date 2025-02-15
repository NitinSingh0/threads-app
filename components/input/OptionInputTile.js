import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const OptionInputTile = ({ isSelected, label, onSelect }) => {
  const getColors = () => {
    if (isSelected)
      return {
        backgroundColor: "#2563eb",
        borderColor: "#38bdf8",
        color: "white",
      };
    return {
      backgroundColor: "#e5e7eb",
      borderColor: "#e5e7eb",
      color: "#1f2937",
    };
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getColors().backgroundColor,
          borderColor: getColors().borderColor,
        },
      ]}
      onPress={onSelect}
    >
      <MaterialCommunityIcons
        name={isSelected ? "radiobox-marked" : "radiobox-blank"}
        size={20}
        color={isSelected ? "white" : "#6b7280"}
      />
      <Text style={[styles.label, { color: getColors().color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    marginLeft: 8,
  },
});

export default OptionInputTile;
