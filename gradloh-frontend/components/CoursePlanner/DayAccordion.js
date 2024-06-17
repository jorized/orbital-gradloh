import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import TimetableEntry from './TimetableEntry';
import { AntDesign } from '@expo/vector-icons';

const DayAccordion = ({ day, entries }) => {
    const [collapsed, setCollapsed] = useState(true);

    const toggleExpanded = () => {
        setCollapsed(!collapsed);
    };

    // Sort entries by start time
    const sortedEntries = entries.sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime));

    return (
        <View style={styles.dayContainer}>
            <TouchableOpacity onPress={toggleExpanded} style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day}</Text>
                <Text>{collapsed ? <AntDesign name="down" size={20} color="black" /> : <AntDesign name="up" size={20} color="black" />}</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed}>
                {sortedEntries.map((entry, index) => (
                    <TimetableEntry key={index} entry={entry} />
                ))}
            </Collapsible>
        </View>
    );
};

const styles = StyleSheet.create({
    dayContainer: {
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dayTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DayAccordion;
