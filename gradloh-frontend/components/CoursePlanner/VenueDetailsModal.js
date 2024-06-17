import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import VenuesData from '../../data/Venues.json';
import GoogleMapView from "../GoogleMapView";

const WIDTH = Dimensions.get('window').width;
const HEIGHT_MODAL = 360;

export default function VenueDetailsModal({ changeModalVisible, venueName }) {

    const [venueCoordinates, setVenueCoordinates] = useState(null);

    const closeModal = (bool) => {
        changeModalVisible(bool);
    };

    useEffect(() => {
        if (VenuesData[venueName]) {
            const latitude = VenuesData[venueName].location.y;
            const longitude = VenuesData[venueName].location.x;
            const venueCoordinatesObj = {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0005,
                longitudeDelta: 0.0005,
            }
            setVenueCoordinates(venueCoordinatesObj);
        }
    }, [venueName]);

    return (
        <TouchableOpacity disabled={true} style={styles.container}>
            <View style={styles.modal}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Venue details</Text>
                    <Text style={styles.roomNameText}>{VenuesData[venueName].roomName}</Text>
                    <TouchableOpacity onPress={() => closeModal(false)} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.contentContainer}>
                    {venueCoordinates && <GoogleMapView venueCoordinates={venueCoordinates} />}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent background
    },
    modal: {
        height: HEIGHT_MODAL,
        width: WIDTH - 50,
        backgroundColor: "white",
        borderRadius: 10,
        overflow: 'hidden', // Ensures content stays within bounds
    },
    headerContainer: {
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
        position: "relative",
    },
    headerText: {
        fontSize: 24,
        fontFamily: "Lexend_700Bold"
    },
    roomNameText: {
        fontSize: 14,
        fontFamily: "Lexend_300Light,"
    },
    closeButton: {
        position: "absolute",
        right: 10,
        top: 10,
        borderRadius: 15,
        padding: 5,
        paddingHorizontal: 10,
    },
    closeButtonText: {
        fontSize: 18,
    },
    contentContainer: {
        flex: 1,
        padding: 10,
    },
});
