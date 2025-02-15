import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import CharAvatar from "./CharAvatar";

const PollOptionVoteResult = ({ label, optionVotes, totalVotes }) => {
  const progress =
    totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${progress}%` }]} />
      <Text style={styles.voteLabel}>
        {label} <Text style={styles.voteProgress}>{progress}%</Text>
      </Text>
    </View>
  );
};

const ImagePollResult = ({ imgUrl, optionVotes, totalVotes }) => {
  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: imgUrl }} style={styles.image} />
      <PollOptionVoteResult optionVotes={optionVotes} totalVotes={totalVotes} />
    </View>
  );
};

const OpenEndedPollResponse = ({
  profileImgUrl,
  userFullName,
  response,
  createdAt,
}) => {
  return (
    <View style={styles.responseContainer}>
      <View style={styles.profileContainer}>
        {profileImgUrl ? (
          <Image source={{ uri: profileImgUrl }} style={styles.profileImage} />
        ) : (
          <CharAvatar fullName={userFullName} style={styles.avatar} />
        )}
        <Text style={styles.userName}>
          {userFullName} <Text style={styles.date}>{createdAt}</Text>
        </Text>
      </View>
      <Text style={styles.responseText}>{response}</Text>
    </View>
  );
};

const PollingResultContent = ({ type, options, responses, voters }) => {
  switch (type) {
    case "single-choice":
    case "yes/no":
    case "rating":
      return (
        <>
          {options.map((option, index) => (
            <PollOptionVoteResult
              key={option._id}
              label={`${option.optionText} ${type === "rating" ? "Star" : ""}`}
              optionVotes={option.votes}
              totalVotes={voters || 0}
            />
          ))}
        </>
      );
    case "image-based":
      return (
        <View style={styles.imageGrid}>
          {options.map((option, index) => (
            <ImagePollResult
              key={option._id}
              imgUrl={option.optionText || ""}
              optionVotes={option.votes}
              totalVotes={voters || 0}
            />
          ))}
        </View>
      );
    case "open-ended":
      return responses.map((response) => (
        <OpenEndedPollResponse
          key={response._id}
          profileImgUrl={response.voterId?.profileImgUrl}
          userFullName={response.voterId?.name || "Anonymous"}
          response={response.responseText || ""}
          createdAt={
            response.createdAt ? moment(response.createdAt).fromNow() : ""
          }
        />
      ));
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  progressContainer: {
    width: "100%",
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    height: 24,
    marginBottom: 12,
    position: "relative",
  },
  progressBar: {
    backgroundColor: "#2563eb",
    height: "100%",
    borderRadius: 8,
  },
  voteLabel: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    color: "#4b5563",
    fontSize: 12,
    fontWeight: "500",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  voteProgress: {
    fontSize: 11,
    color: "#6b7280",
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "#1f2937",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  responseContainer: {
    marginBottom: 32,
    marginLeft: 12,
  },
  profileContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    fontSize: 12,
    backgroundColor: "#38bdf8",
  },
  userName: {
    fontSize: 13,
    color: "#111827",
  },
  date: {
    fontSize: 10,
    color: "#6b7280",
  },
  responseText: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: -8,
    marginLeft: 48,
  },
});

export default PollingResultContent;
