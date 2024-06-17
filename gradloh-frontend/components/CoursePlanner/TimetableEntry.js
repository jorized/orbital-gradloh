import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import VenueDetailsModal from './VenueDetailsModal';

const TimetableEntry = ({ entry }) => {

    const [isModalVisible, setIsModalVisible] = useState(false);

    const changeModalVisible = (bool) => {
        setIsModalVisible(bool);
    }

    

    return (
        <View style={styles.entryContainer}>
            <View style = {styles.firstContainer}>
                <Text style={styles.entryText}>Day: {entry.day}</Text>
                <TouchableOpacity onPress={() => changeModalVisible(true)}>
                    <Text>Venue details</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.entryText}>Time: {entry.startTime} - {entry.endTime}</Text>
            <Text style={styles.entryText}>Venue: {entry.venue}</Text>
            <Text style={styles.entryText}>Lesson Type: {entry.lessonType}</Text>
            <Modal transparent={true} animationType='fade' visible={isModalVisible} onRequestClose={() => changeModalVisible(false)}>
                <VenueDetailsModal changeModalVisible={changeModalVisible} venueName = {entry.venue}/>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    entryContainer: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    entryText: {
        fontSize: 14,
    },
    firstContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

export default TimetableEntry;
