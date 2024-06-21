import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const ChangeNicknameAlert = ({ isVisible, onClose, onSubmit, defaultValue }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isVisible) {
      setInputValue(defaultValue);
    }
  }, [isVisible, defaultValue]);

  const handleCancel = () => {
    setInputValue('');
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Change nickname</Text>
          <Text style={styles.message}>Current nickname</Text>
          <TextInput
            style={styles.input}
            placeholder="HINT INPUT"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 200
  },
  container: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginRight: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginLeft: 5,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ChangeNicknameAlert;
