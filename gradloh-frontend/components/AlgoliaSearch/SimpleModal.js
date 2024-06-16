import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import axios from 'axios';
import { AxiosContext } from "../../contexts/AxiosContext";
import * as SecureStore from 'expo-secure-store';
import { EventRegister } from "react-native-event-listeners";

const WIDTH = Dimensions.get('window').width;
const HEIGHT_MODAL = 500;

export default function SimpleModal({ currentItem, folderName, changeModalVisible, semIndex }) {

    const publicAxios = useContext(AxiosContext);

    const userProfileDetails = SecureStore.getItem('userprofiledetails');
    const email = JSON.parse(userProfileDetails).email;

    const [loading, setLoading] = useState(true);
    const [moduleDetails, setModuleDetails] = useState({});

    const closeModal = (bool, text) => {
        changeModalVisible(bool);
    };

    const getSemestersOffered = () => {
        if (moduleDetails.semesterData) {
            return moduleDetails.semesterData.map(data => "Sem " + data.semester).join(', ');
        }
        return 'N/A';
    };

    const getTotalWorkload = () => {
        if (moduleDetails.workload) {
            return moduleDetails.workload.reduce((total, current) => total + current, 0);
        }
        return 'N/A';
    };

// Utility function to check prerequisites
    const checkPrerequisites = (modsUpTillCurrentSem, prereqTree) => {
        const completedModules = modsUpTillCurrentSem.map(mod => mod.split(":")[0]);

        if(!prereqTree) {
            return true;
        }
        const checkNode = (node) => {
        if (typeof node === 'string') {
            return completedModules.includes(node.split(":")[0]);
        } else if (node.or) {
            return node.or.some(checkNode);
        } else if (node.and) {
            return node.and.every(checkNode);
        } else if (node.nOf) {
            const [requiredCount, courses] = node.nOf;
            const satisfiedCount = courses.filter(checkNode).length;
            return satisfiedCount >= requiredCount;
        }
        return false;
        };
    
        return checkNode(prereqTree);
    };
  
  //Checks the prerequisites and compare from the sem that they are adding into, with the previous sems before this
  const handleAdd = () => {
    publicAxios.authAxios.get('/modsforprevsemtocurrsem', {
      params: { email: email, folderName: semIndex }
    }).then(response => {
      const modsUpTillCurrentSem = response.data.modsForPrevFolderToCurrFolder;

      if (checkPrerequisites(modsUpTillCurrentSem, moduleDetails.prereqTree)) {
        const folderName = semIndex;
        const moduleCode = moduleDetails.moduleCode;
        publicAxios.authAxios.post('/addmodinspecificsem', {
            email,
            folderName,
            moduleCode
        }).then(response => {
            Alert.alert(
                "Module successfully added.",
                "",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      closeModal(false);  // Close the modal
                      EventRegister.emit('folderInserted', {
                        folderName,
                        moduleCode
                      });  // Re-render the current screen
                    }
                  }
                ]
              );
        }).catch(error => {
            console.log(error);            
        })
       

      } else {
        // Show alert
        Alert.alert("Prerequisite not met", "You have not completed the required prerequisites for this module.");
      }
    }).catch(error => {
      console.log(error);
    });
  };

    useEffect(() => {

        axios.get(`https://api.nusmods.com/v2/2023-2024/modules/${currentItem.moduleCode}.json`)
            .then(response => {
                setModuleDetails(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    return (
        <TouchableOpacity disabled={true} style={styles.container}>
            <View style={styles.modal}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Add {currentItem.moduleCode} to {folderName}?</Text>
                </View>
                {loading ? 
                <ActivityIndicator size="small" color="black" /> :
                <View style={styles.contentContainer}>
                    <Text style={styles.previewText}>Preview</Text>
                    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.scrollViewContent}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleTextKey}>Title</Text>
                            <Text style={styles.titleTextValue}>{moduleDetails.title}</Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleTextKey}>Faculty</Text>
                            <Text style={styles.titleTextValue}>{moduleDetails.faculty}</Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleTextKey}>Prerequisite</Text>
                            <Text style={styles.titleTextValue}>{moduleDetails.prerequisite ? moduleDetails.prerequisite : "None"}</Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleTextKey}>Offered in:</Text>
                            <Text style={styles.titleTextValue}>{getSemestersOffered()}</Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleTextKey}>Workload:</Text>
                            <Text style={styles.titleTextValue}>{getTotalWorkload()} Hrs</Text>
                        </View>
                    </ScrollView>
                </View>}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => closeModal(false, 'Cancel')}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.detailsBtn}>
                        <Text>Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                        <Text>Add</Text>
                    </TouchableOpacity>
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
        width: WIDTH - 80,
        backgroundColor: "white",
        borderRadius: 10,
        overflow: 'hidden', // Ensures content stays within bounds
    },
    headerContainer: {
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        padding: 20
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 22,
        textAlign: "center"
    },
    contentContainer: {
        flex: 1,
    },
    scrollViewContainer: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    cancelBtn: {
        padding: 10, // Adjusted for better spacing
    },
    detailsBtn: {
        padding: 10, // Adjusted for better spacing
    },
    addBtn: {
        padding: 10, // Adjusted for better spacing
    },
    previewText: {
        textAlign: "center",
        fontSize: 22,
        marginVertical: 10
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between", // Adjusted to spread text within the view
        marginVertical: 8,
    },
    titleTextKey: {
        fontSize: 14,
        fontWeight: "bold",
        flex: 1, // Ensure key and value are on the same line
    },
    titleTextValue: {
        marginLeft: 30,
        fontSize: 14,
        flex: 2, // Ensure key and value are on the same line
    }
});
