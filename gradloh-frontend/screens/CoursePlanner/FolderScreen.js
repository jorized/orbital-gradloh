import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DrawerHeader from '../../components/Drawer/DrawerHeader'
import ThemeContext from '../../contexts/ThemeContext';
import { Animations } from '../../misc/consts';
import * as Animatable from 'react-native-animatable'
import { Entypo } from '@expo/vector-icons';
import { AxiosContext } from '../../contexts/AxiosContext';
import * as SecureStore from 'expo-secure-store';
import { EventRegister } from 'react-native-event-listeners';
import Tooltip from 'react-native-walkthrough-tooltip';
import TutorialToolTip from '../../components/TutorialToolTip';
import { useFocusEffect } from '@react-navigation/native';

export default function FolderScreen({ headerName, navigation, route }) {

    const publicAxios = useContext(AxiosContext);

    const userProfileDetails = SecureStore.getItem('userprofiledetails');
    const email = JSON.parse(userProfileDetails).email;

    const viewRef = useRef(null);
    const animation = Animations[15]

    const theme = useContext(ThemeContext);

    const [loading, setLoading] = useState(true);
    const [numOfModsInEachFolder, setNumOfModsInEachFolder] = useState({});
    const [currentSemester, setCurrentSemester] = useState(0);

    const [showTooltip3, setShowTooltip3] = useState(false);

    const fetchAndAnimate = () => {
        publicAxios.authAxios.get('/allfolderdetails', {
            params: { email: email }
        }).then(response => {
            const data = response.data;
            setCurrentSemester(data.currentSemester);
            setNumOfModsInEachFolder(data.numOfModsInEachFolder);
            setLoading(false);
        }).catch(error => {
            console.log(error);
        }).then(() => {
            const unsubscribe = navigation.addListener('focus', () => {
                viewRef.current.animate({ 0: { opacity: 0.5, }, 1: { opacity: 1 } });
              })
              return () => unsubscribe;
        })
    }

    useEffect(() => {
        if (route.params?.startTutorial) {
            setShowTooltip3(true);
        }
        fetchAndAnimate();
        const listener = EventRegister.addEventListener('updateScreens', (data) => {
            // Handle the event and update state as needed
            fetchAndAnimate(); // Re-fetch data or update state as needed
        });
    
        return () => {
            EventRegister.removeEventListener(listener);
        };


    }, [route.params])

    useFocusEffect(
        useCallback(() => {
            if (route.params?.startTutorial) {
                setShowTooltip3(true);
            }
            fetchAndAnimate();
            const listener = EventRegister.addEventListener('updateScreens', (data) => {
                // Handle the event and update state as needed
                fetchAndAnimate(); // Re-fetch data or update state as needed
            });
        
            return () => {
                EventRegister.removeEventListener(listener);
            };
        }, [route.params])
      );


    const handleCloseToolTipThree = () => {
        setShowTooltip3(false);
        navigation.navigate("FolderStack", {
            screen: 'FolderDetailsScreen',
            params: { startTutorial: true, headerName : "Y1S1", semIndex: 1 }
          });
    }

    const semesterMapping = [
        "Y1S1", "Y1S2", "Y2S1", "Y2S2", "Y3S1", "Y3S2", "Y4S1", "Y4S2"
    ];
    
    const ListItem = ({ item, index, animation, navigation, folderCount, currentSemester  }) => {
        return (
            <Animatable.View
            animation={animation}
            duration={1000}
            delay={index * 100}
            >
                <TouchableOpacity
                    style={[styles.listItem, { backgroundColor: theme.gradientColorBottomSheet }]}
                    activeOpacity={0.7}
                    onPress={() => navigation.push('FolderDetailsScreen', { headerName : semesterMapping[index], semIndex : index + 1})}>
                    <View style={styles.iconContainer}>
                        {currentSemester === index + 1 && (
                            <Text style={styles.currentLabel}>Current Sem</Text>
                        )}
                        <Entypo name="folder" size={94} color={theme.hamburgerColor} />
                        <Text style={[styles.iconLabel, { color: theme.color }]}>{folderCount}</Text>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={[styles.name, { color: theme.color }]}>{semesterMapping[index]}</Text>
                    </View>
                </TouchableOpacity>

        </Animatable.View>
        );
    }

    const renderItem = ({ item, index }) => (
        <ListItem item={item} index={index} animation={animation} navigation={navigation} folderCount={numOfModsInEachFolder[index + 1] || 0} currentSemester={currentSemester}/>)


    return (
        <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
            <Tooltip isVisible={showTooltip3} placement="bottom" onClose={() => {}}
                    content = {
                        <TutorialToolTip
                            title="Semesters"
                            text='Here, you can see up to 8 semesters in your course plan, showing the current semester according to your enrolment year, and with each folder (semester) showing the number of modules within them.'
                            buttonText="Next"
                            onPress={handleCloseToolTipThree}
                      />
                    }
            ></Tooltip>
            <DrawerHeader headerName={headerName}/>
            {loading ? <ActivityIndicator size="small" color={theme.hamburgerColor} /> : <>

            <Animatable.View
                ref={viewRef}
                easing={'ease-in-out'}
                duration={150}
                style={styles.container}>
                <FlatList
                data={Array(8).fill('')}
                keyExtractor={(_, i) => String(i)}
                numColumns={2}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                />
            </Animatable.View></>}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(0, 0, 0, .08)',
    },
    listEmpty: {
        height: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItem: {
        height: 200,
        width: Dimensions.get('window').width / 2 - 16,
        backgroundColor: 'white',
        margin: 8,
        borderRadius: 10,
    },
    iconContainer: {
        height: 150,
        margin: 5,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        position: 'relative',
    },
    iconLabel: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: 'bold',
        top: 70
    },
    detailsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        justifyContent: "center"
    },
    currentLabel: {
        position: 'absolute',
        top: 0,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red', 
    },
});
