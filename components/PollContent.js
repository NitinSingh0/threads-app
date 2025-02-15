import React from "react";
import { View, TextInput, StyleSheet, FlatList } from "react-native";
import OptionInputTile from "./input/OptionInputTile";
import Rating from "./input/Rating";
import ImageOptionInputTile from "./input/ImageOptionInputTile";

const PollContent = ({
  type,
  options,
  selectedOptionIndex,
  onOptionSelect,
  rating,
  onRatingChange,
  userResponse,
  onResponseChange,
}) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
      return (
        <FlatList
          data={options}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <OptionInputTile
              isSelected={selectedOptionIndex === index}
              label={item.optionText || ""}
              onSelect={() => onOptionSelect(index)}
            />
          )}
        />
      );
    case "rating":
      return <Rating value={rating} onChange={onRatingChange} />;
    case "open-ended":
      return (
        <View style={styles.textAreaContainer}>
          <TextInput
            placeholder="Your response"
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={userResponse}
            onChangeText={onResponseChange}
          />
        </View>
      );
    case "image-based":
      return (
        <FlatList
          data={options}
          numColumns={2}
          keyExtractor={(item) => item._id}
          columnWrapperStyle={styles.imageGrid}
          renderItem={({ item, index }) => (
            <ImageOptionInputTile
              isSelected={selectedOptionIndex === index}
              imgUrl={item.optionText || ""}
              onSelect={() => onOptionSelect(index)}
            />
          )}
        />
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  textAreaContainer: {
    marginTop: -3,
  },
  textArea: {
    width: "100%",
    fontSize: 13,
    color: "black",
    backgroundColor: "rgba(176, 190, 222, 0.8)", // Equivalent to bg-slate-200/80
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    textAlignVertical: "top", // Ensures proper text alignment in multiline input
  },
  imageGrid: {
    justifyContent: "space-between",
  },
});

export default PollContent;
