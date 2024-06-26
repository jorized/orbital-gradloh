// CustomToast.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

const CustomToast = (props) => {
  const toastConfig = {

  };

  return <Toast config={toastConfig} />;
};

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  },
  warningToast: {
    backgroundColor: '#D00E17'
  },
  successToast: {
    backgroundColor: '#28a745' // Green color for success
  },
  textContainer: {
    flex: 1,
    flexShrink: 1
  },
  toastText1: {
    fontSize: 16,
    color: 'white'
  },
  toastText2: {
    fontSize: 12,
    color: 'white'
  },
  closeButton: {
    padding: 5
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  }
});

export default CustomToast;
