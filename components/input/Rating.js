import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Use this for star icons

const Rating = ({ maxStars = 5, readOnly = false, value = 0, onChange }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readOnly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0);
    }
  };

  return (
    <View style={styles.container}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1; // Define inside the map loop
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.star,
              {
                color:
                  starValue <= (hoverValue || value)
                    ? "#FBBF24" // Yellow color for filled stars
                    : "#D1D5DB", // Gray color for empty stars
              },
            ]}
            onPress={() => handleClick(starValue)}
            onPressIn={() => handleMouseEnter(starValue)}
            onPressOut={handleMouseLeave}
            disabled={readOnly}
          >
            <MaterialCommunityIcons
              name="star"
              size={24}
              color={starValue <= (hoverValue || value) ? "#FBBF24" : "#D1D5DB"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  star: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Rating;
