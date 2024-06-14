import React, { useContext, useRef, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { useSearchBox } from 'react-instantsearch-core';
import { AntDesign } from '@expo/vector-icons';
import ThemeContext from '../../contexts/ThemeContext';

export function SearchBox({ onChange, ...props }) {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef(null);
  const theme = useContext(ThemeContext);

  function setQuery(newQuery) {
    setInputValue(newQuery);
    refine(newQuery);
  }

  // Track when the InstantSearch query changes to synchronize it with
  // the React state.
  // We bypass the state update if the input is focused to avoid concurrent
  // updates when typing.
  if (query !== inputValue && !inputRef.current?.isFocused()) {
    setInputValue(query);
  }

  return (
    <View style={[styles.container, {borderColor: theme.hamburgerColor}]}>
      <AntDesign name="search1" size={24} color={theme.hamburgerColor} style={styles.icon} />
      <TextInput
        ref={inputRef}
        style={[styles.input, {color : theme.color}]}
        value={inputValue}
        onChangeText={(newValue) => {
          setQuery(newValue);
          onChange(newValue);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        placeholder='Search modules...'
        placeholderTextColor={"#bbb"}
      />
      {inputValue.length > 0 && (
        <TouchableOpacity onPress={() => setQuery('')}>
          <AntDesign name="closecircle" size={20} color="#ccc" style={styles.clearIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Ensures the icon and input are aligned
    marginRight: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: "75%"
  },
  icon: {
    marginRight: 10, // Adds space between the icon and TextInput
  },
  input: {
    flex: 1, // Ensures TextInput takes up the remaining space
    fontSize: 16,
    borderRadius: 4,
  },
  clearIcon: {
    marginLeft: 10, // Adds space between the input and clear button
  },
});
