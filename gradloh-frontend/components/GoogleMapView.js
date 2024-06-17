import React, { useEffect, useState, useRef } from 'react';
import { Dimensions, Platform, StyleSheet, View, TouchableOpacity, Text, Linking } from 'react-native';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE, Marker } from 'react-native-maps';

export default function GoogleMapView({ venueCoordinates }) {

    const [mapRegion, setMapRegion] = useState(venueCoordinates);

    const mapRef = useRef(null);

    useEffect(() => {
        if (venueCoordinates) {
            setMapRegion(venueCoordinates);
        }
    }, [venueCoordinates]);

    const zoomIn = () => {
        setMapRegion(prevRegion => ({
            ...prevRegion,
            latitudeDelta: prevRegion.latitudeDelta / 2,
            longitudeDelta: prevRegion.longitudeDelta / 2,
        }));
    };

    const zoomOut = () => {
        setMapRegion(prevRegion => ({
            ...prevRegion,
            latitudeDelta: prevRegion.latitudeDelta * 2,
            longitudeDelta: prevRegion.longitudeDelta * 2,
        }));
    };

    const openInGoogleMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${mapRegion.latitude},${mapRegion.longitude}`;
        Linking.openURL(url);
    };

    return (
        <View style={styles.mapContainer}>
            <MapView 
                ref={mapRef}
                style={styles.mapViewStyle} 
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                region={mapRegion}
                showsUserLocation={true}
            > 
                <Marker 
                    coordinate={{ 
                        latitude: mapRegion.latitude, 
                        longitude: mapRegion.longitude 
                    }} 
                    title={"Marker Title"}
                    description={"Marker Description"}
                />
            </MapView>
            <View style={styles.overlayContainer}>
                <TouchableOpacity onPress={zoomIn} style={styles.zoomButton}>
                    <Text style={styles.zoomText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={zoomOut} style={styles.zoomButton}>
                    <Text style={styles.zoomText}>-</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.openInGoogleMapsContainer}>
                <TouchableOpacity onPress={openInGoogleMaps} style={styles.googleMapsButton}>
                    <Text style={styles.googleMapsText}>Open in Google Maps</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10, // Add padding here
    },
    mapViewStyle: {
        width: '100%', // Adjust width to fill the container
        height: '100%', // Adjust height to fill the container
        borderRadius: 10, // Add border radius if needed
    },
    overlayContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        padding: 5,
    },
    openInGoogleMapsContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    zoomButton: {
        margin: 5,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    zoomText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    googleMapsButton: {
        backgroundColor: '#EF7C00',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    googleMapsText: {
        fontSize: 16,
        color: 'white',
    },
});
