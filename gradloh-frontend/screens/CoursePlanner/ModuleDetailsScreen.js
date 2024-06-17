import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ThemeContext from '../../contexts/ThemeContext';
import { HeaderBackButton } from '@react-navigation/elements';
import GoogleMapView from '../../components/GoogleMapView';
import axios from 'axios';
import { useFonts } from 'expo-font';
import { Lexend_100Thin, Lexend_200ExtraLight, Lexend_300Light, Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, Lexend_700Bold, Lexend_800ExtraBold, Lexend_900Black } from '@expo-google-fonts/lexend';
import Semester from '../../components/CoursePlanner/Semester';

export default function ModuleDetailsScreen({ route, navigation }) {
    const theme = useContext(ThemeContext);
    const { headerName, moduleCode } = route.params;
    const [loading, setLoading] = useState(true);
    const [moduleDetails, setModuleDetails] = useState({});
    const [totalWorkload, setTotalWorkload] = useState(0);

    let [fontsLoaded] = useFonts({
        Lexend_100Thin,
        Lexend_200ExtraLight,
        Lexend_300Light,
        Lexend_400Regular,
        Lexend_500Medium,
        Lexend_600SemiBold,
        Lexend_700Bold,
        Lexend_800ExtraBold,
        Lexend_900Black,
      });

    const WorkloadDisplay = ({ workload }) => {
    const labelColors = ['#0a63ad', '#5f892d', '#5d4a43', '#b26a00', '#cd0015']
    const colors = ['#BBDEFB', '#DCEDC8', '#D7CCC8', '#FFE0B2', '#FFCDD2'];
    const labels = ['Lec', 'Tut', 'Lab', 'Project', 'Preparation'];

    return (
        <View style={styles.workloadContainer}>
            {workload.map((value, index) => {
                if (value > 0) {
                    return (
                        <View key={index} style={styles.workloadSegmentContainer}>
                            <Text style={[styles.label, { color: labelColors[index] }]}>{labels[index]}</Text>
                            <View style={styles.segmentRow}>
                                {Array.from({ length: value }).map((_, i) => (
                                    <View key={i} style={[styles.segment, { backgroundColor: colors[index] }]} />
                                ))}
                            </View>
                        </View>
                    );
                }
                return null;
            })}
        </View>
        );
    };
    

    useEffect(() => {
        axios.get(`https://api.nusmods.com/v2/2023-2024/modules/${moduleCode}.json`)
            .then(response => {
                setModuleDetails(response.data);
                setTotalWorkload(response.data.workload.reduce((accumulator, currentValue) => accumulator + currentValue, 0))
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[styles.safe, { backgroundColor: theme.backgroundColor }]}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <View style={styles.headerFlexContainer}>
                            <HeaderBackButton
                                style={styles.headerbackBtnStyle}
                                onPress={() => navigation.goBack()}
                                tintColor={theme.hamburgerColor}
                                labelVisible={false}
                            />
                            <Text style={[styles.titleText, { color: theme.hamburgerColor }]}>
                                {headerName}
                            </Text>
                        </View>
                    </View>
                    {/* Content */}
                    {loading ? (
                        <View style={styles.LoadingContainer}>
                            <ActivityIndicator size="small" color={theme.hamburgerColor} />
                        </View>
                    ) : (
                        <ScrollView style={styles.contentContainer}>
                            <Text style={[styles.moduleCodeText, { color: theme.color }]}>
                                {moduleDetails.moduleCode}
                            </Text>
                            <Text style={[styles.moduleTitleText, { color: theme.color }]}>
                                {moduleDetails.title}
                            </Text>
                            <View style={[styles.depFacUnitsContainer, { color : theme.color}]}>
                                <Text style={[styles.departmentText, { color : theme.color}]}>{moduleDetails.department} - </Text>
                                <Text style={[styles.facultyText, { color : theme.color}]}>{moduleDetails.faculty} - </Text>
                                <Text style={[styles.moduleCreditText, { color : theme.color}]}>{moduleDetails.moduleCredit} Credits</Text>
                            </View>
                            <View style = {styles.breakLine}></View>
                            <Text style = {[styles.descriptionText, { color : theme.color} ]}>{moduleDetails.description}</Text>
                            <Text style = {[styles.preReqTitle, { color : theme.color}]}>Pre-requisites</Text>
                            <Text style = {[styles.preReqText, { color : theme.color}]}>{moduleDetails.prerequisite ? moduleDetails.prerequisite : "None"}</Text>
                            <Text style = {[styles.preReqTitle, { color : theme.color}]}>Preclusions</Text>
                            <Text style = {[styles.preReqText, { color : theme.color}]}>{moduleDetails.preclusion ? moduleDetails.preclusion : "None"}</Text>
                            <Text style = {[styles.preReqTitle, { color : theme.color}]}>Grading Basis</Text>
                            <Text style = {[styles.preReqText, { color : theme.color}]}>{moduleDetails.gradingBasisDescription ? moduleDetails.gradingBasisDescription : "None"}</Text>
                            <Text style = {[styles.preReqTitle, { color : theme.color}]}>Workload (Per week/sem)</Text>
                            <Text style = {[styles.preReqText, { color : theme.color}]}>{totalWorkload} Hrs</Text>
                            <Text style = {[styles.preReqTitle, { color : theme.color}]}>Workload breakdown</Text>
                            <WorkloadDisplay workload={moduleDetails.workload} />
                            <Text style = {[styles.preReqTitle, { color : theme.color}]}>Past timetable details</Text>
                            {moduleDetails.semesterData.map((semester, index) => (
                                <Semester key={index} semesterData={semester} />
                            ))}
                            {/* <GoogleMapView venueCoordinates={{latitude: 1.2947422882567174, longitude: 103.77155005931856}}/> */}
                        </ScrollView>
                    )}
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    headerContainer: {
        paddingTop: 10,
    },
    headerFlexContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5,
    },
    headerbackBtnStyle: {
        marginLeft: 10,
    },
    titleText: {
        fontSize: 26,
        fontFamily: 'Lexend_600SemiBold',
        marginLeft: 10,
    },
    LoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    contentContainer: {
        paddingTop: 20,
        paddingHorizontal: 30,
    },
    moduleCodeText: {
        fontFamily: "Lexend_700Bold",
        fontSize: 36
    },
    moduleTitleText: {
        fontFamily: "Lexend_300Light",
        fontSize: 24
    },
    depFacUnitsContainer: {
        flexDirection: "row",
        marginTop: 10
    },
    departmentText: {
        fontFamily: "Lexend_500Medium",
        fontSize: 14
    },
    facultyText: {
        fontFamily: "Lexend_500Medium",
        fontSize: 14
    },
    moduleCreditText: {
        fontFamily: "Lexend_500Medium",
        fontSize: 14
    },
    breakLine: {
        borderWidth: 0.5,
        borderColor: "#bbb",
        marginVertical: 10
    },
    descriptionText: {
        fontFamily: "Lexend_300Light",
        fontSize: 18
    },
    preReqTitle: {
        marginTop: 20,
        fontFamily: "Lexend_500Medium",
        fontSize: 26
    },
    preReqText: {
        marginTop: 14,
        fontFamily: "Lexend_300Light",
        fontSize: 16
    },
    workloadContainer: {

        alignItems: 'flex-start',
        marginTop: 10,
    },
    workloadSegmentContainer: {

        marginRight: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    segmentRow: {
        flexDirection: 'row',
    },
    segment: {
        width: 20,
        height: 20,
        margin: 1,
    },
});
