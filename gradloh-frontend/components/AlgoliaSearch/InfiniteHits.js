import React, { forwardRef, useContext, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useInfiniteHits, useInstantSearch } from 'react-instantsearch-core';
import ThemeContext from '../../contexts/ThemeContext';

export const InfiniteHits = forwardRef(({ hitComponent: Hit, ...props }, ref) => {
  const { hits, isLastPage, showMore, results } = useInfiniteHits({
    ...props,
    escapeHTML: false,
  });

  const { status } = useInstantSearch();
  const [totalHits, setTotalHits] = useState(0);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (results) {
      setTotalHits(results.nbHits);
    }
  }, [results]);


  // if (status === 'loading') {
  //   console.log(status);
  //   <ActivityIndicator style={styles.loading} size="small" color="black" />
  // }


  return (
    <View style={styles.container}>
      <Text style={styles.hitsText}>Showing {hits.length} of {totalHits} results</Text>
      <FlatList
        indicatorStyle={theme.color}
        ref={ref}
        data={hits}
        keyExtractor={(item) => item.objectID}
        ItemSeparatorComponent={() => <View style={[styles.separator, {borderColor: theme.separatorComponentBorderColor}]} />}
        onEndReached={() => {
          if (!isLastPage) {
            showMore();
          }
        }}
        onEndReachedThreshold={0.5} // This triggers showMore when the user has scrolled halfway through the list
        renderItem={({ item }) => (
          <View style={[styles.item]}>
            <Hit hit={item} />
          </View>
        )}
        ListFooterComponent={() => !isLastPage && <ActivityIndicator style={styles.loading} size="small" color={theme.color} />}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    borderBottomWidth: 1,
  },
  item: {
    padding: 18,
  },
  loading: {
    paddingVertical: 20,
  },
  hitsText: {
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
    color: "#bbb",
  },
});
