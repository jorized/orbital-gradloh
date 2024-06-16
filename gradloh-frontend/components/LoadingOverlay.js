import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LoadingContext } from '../contexts/LoadingContext';
import ThemeContext from '../contexts/ThemeContext';


const LoadingOverlay = () => {
  const { isLoading } = useContext(LoadingContext);

  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="small" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
});

export default LoadingOverlay;
