import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
//import useUserAuth from "../../hooks/useUserAuth";
import axios from "axios";
import PollCard from "../components/PollCard"; // Ensure PollCard.js exists
import HeaderWithFilter from "../components/HeaderWithFilter"; // Ensure HeaderWithFilter.js exists
import { UserType } from "../UserContext";

const PAGE_SIZE = 3;
const BASE_URL = "http://10.0.2.2:3000"; // Update this if needed

const PollScreen = () => {
  //useUserAuth();
  const navigation = useNavigation();

  const [allPolls, setAllPolls] = useState([]);
  const [stats, setStats] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");
  const { userId } = useContext(UserType);
  const fetchAllPolls = async (overridePage = page) => {
    if (loading) return;
    setLoading(true);
    try {
      
      const response = await axios.get(
        `${BASE_URL}/polls/${userId}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}`
      );

      if (response.data?.polls?.length > 0) {
        setAllPolls((prevPolls) =>
          overridePage === 1
            ? response.data.polls
            : [...prevPolls, ...response.data.polls]
        );
        setStats(response.data?.stats || []);
        setHasMore(response.data.polls.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchAllPolls(1);
  }, [filterType]);

  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
  }, [page]);

  const loadMorePolls = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderWithFilter
        title="Polls"
        filterType={filterType}
        setFilterType={setFilterType}
      />
      <FlatList
        data={allPolls}
        keyExtractor={(poll) => `poll_${poll._id}`}
        renderItem={({ item }) => (
          <PollCard
            pollId={item._id}
            question={item.question}
            type={item.type}
            options={item.options}
            voters={item.voters.length || 0}
            response={item.responses || []}
            creatorProfileImg={item.creator?.ProfileImageUrl || null}
            creatorName={item.creator?.name}
            creatorUsername={item.creator?.username}
            userHasVoted={item.userHasVoted || false}
            isPollClosed={item.closed || false}
            createdAt={item.createdAt || false}
          />
        )}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
        onEndReached={loadMorePolls}
        onEndReachedThreshold={0.1}
      />
      {!hasMore && (
        <Text style={styles.infoText}>No more polls to display.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  infoText: {
    textAlign: "center",
    padding: 10,
    color: "gray",
  },
});

export default PollScreen;
