import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';
import DayAccordion from './DayAccordion';
import { AntDesign } from '@expo/vector-icons';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Semester = ({ semesterData }) => {
    const [collapsed, setCollapsed] = useState(true);

    const toggleExpanded = () => {
        setCollapsed(!collapsed);
    };

    const getEntriesForDay = (day) => {
        return semesterData.timetable.filter(entry => entry.day === day);
    };

    return (
        <View style={styles.semesterContainer}>
            <TouchableOpacity onPress={toggleExpanded} style={styles.semesterHeader}>
                <Text style={styles.semesterTitle}>Semester {semesterData.semester}</Text>
                <Text>{collapsed ? <AntDesign name="down" size={20} color="black" /> : <AntDesign name="up" size={20} color="black" />}</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed}>
                {daysOfWeek.map(day => (
                    <DayAccordion key={day} day={day} entries={getEntriesForDay(day)} />
                ))}
                <Text style={styles.examInfo}>Exam Date: {new Date(semesterData.examDate).toLocaleDateString()}</Text>
                <Text style={styles.examInfo}>Exam Duration: {semesterData.examDuration} minutes</Text>
            </Collapsible>
        </View>
    );
};

const styles = StyleSheet.create({
    semesterContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#e9ecef',
        borderRadius: 5,
    },
    semesterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    semesterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    examInfo: {
        fontSize: 16,
        marginTop: 10,
    },
});

export default Semester;
