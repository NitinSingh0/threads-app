import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure you have installed `@expo/vector-icons`


const POLL_TYPE = [
  { id: "01", label: "Yes/No", value: "yes/no" },
  { id: "02", label: "Single Choice", value: "single-choice" },
  { id: "03", label: "Rating", value: "rating" },
  { id: "04", label: "Image Based", value: "image-based" },
  { id: "05", label: "Open Ended", value: "open-ended" },
];

const HeaderWithFilter = ({ title, filterType, setFilterType }) => {
  const [open, setOpen] = useState(false);

  return (
    <View>
      {/* Header Row */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={[
            styles.filterButton,
            open ? styles.activeFilter : styles.inactiveFilter,
          ]}
          onPress={() => {
            if (filterType !== "") setFilterType("");
            setOpen(!open);
          }}
        >
          <Ionicons
            name={filterType !== "" ? "close-outline" : "filter-outline"}
            size={20}
            color="white"
          />
          <Text style={styles.filterText}>
            {filterType !== "" ? "Clear" : "Filter"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Options */}
      {open && (
        <View style={styles.filterContainer}>
          <FlatList
            data={POLL_TYPE}
            keyExtractor={(item) => item.value}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filterType === item.value
                    ? styles.activeOption
                    : styles.inactiveOption,
                ]}
                onPress={() => setFilterType(item.value)}
              >
                <Text
                  style={
                    filterType === item.value
                      ? styles.activeText
                      : styles.inactiveText
                  }
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a90e2",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: "#4a90e2",
  },
  inactiveFilter: {
    backgroundColor: "#1E90FF",
  },
  filterText: {
    color: "white",
    fontSize: 14,
    marginLeft: 5,
  },
  filterContainer: {
    backgroundColor: "#4a90e2",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeOption: {
    backgroundColor: "#004C8C",
  },
  inactiveOption: {
    backgroundColor: "#B0E0E6",
  },
  activeText: {
    color: "white",
    fontSize: 14,
  },
  inactiveText: {
    color: "#004C8C",
    fontSize: 14,
  },
});

export default HeaderWithFilter;
