import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';

const CheckBoxWithLabel = ({ label, value, onValueChange }) => {
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)} style={styles.container}>
      <Checkbox
        value={value}
        onValueChange={onValueChange}
        color={value ? '#EF7C00' : undefined} // Customize colors if needed
      />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckBoxWithLabel;