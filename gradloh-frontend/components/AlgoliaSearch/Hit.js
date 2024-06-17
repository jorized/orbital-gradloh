import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Highlight } from "./Highlight";
import { useContext, useEffect, useState } from "react";
import ThemeContext from "../../contexts/ThemeContext";
import { AntDesign } from '@expo/vector-icons';
import SimpleModal from './SimpleModal';
import { AxiosContext } from "../../contexts/AxiosContext";
import * as SecureStore from 'expo-secure-store';
import { EventRegister } from "react-native-event-listeners";

export default function Hit({ hit, folderName, semIndex }) {

  const userProfileDetails = SecureStore.getItem('userprofiledetails');
  const email = JSON.parse(userProfileDetails).email;

  const publicAxios = useContext(AxiosContext);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modsForEverySem, setModsForEverySem] = useState([]);
  const theme = useContext(ThemeContext);

  const changeModalVisible = (bool) => {
    setIsModalVisible(bool);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await publicAxios.authAxios.get('/modsforeverysem', {
          params: { email: email }
        });
        setModsForEverySem(response.data.modsForEveryFolder);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    const listener = EventRegister.addEventListener('updateScreens', (data) => {
      // Handle the event and update state as needed
      fetchData(); // Re-fetch data or update state as needed
    });

    return () => {
      EventRegister.removeEventListener(listener);
    };
  }, []);

  const isModuleInFolder = (moduleCode) => {
    return modsForEverySem.some(mod => mod === moduleCode);
  };

  



  return (
    <View style={styles.container}>
      <Text>
        <Highlight hit={hit} attribute="moduleCode" highlightedStyle={[styles.highlighted]} nonHighlightedStyle={[styles.nonHighlighted, {color: theme.color}]} />
      </Text>
      {isModuleInFolder(hit.moduleCode) ? (
        <Text style={styles.addedText}>Added</Text>
      ) : (
        <TouchableOpacity onPress={() => changeModalVisible(true)}>
          <AntDesign name="plus" size={18} color={theme.color} />
        </TouchableOpacity>
      )}
      <Modal transparent={true} animationType='fade' visible={isModalVisible} onRequestClose={() => changeModalVisible(false)}>
        <SimpleModal currentItem={hit} folderName={folderName} changeModalVisible={changeModalVisible} semIndex= {semIndex}/>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: "space-between"
  },
  highlighted: {
    fontWeight: 'bold',
    backgroundColor: '#CCDDED',
  },
  nonHighlighted: {
    fontWeight: 'normal',
    backgroundColor: 'transparent',
  },
  addedText: {
    color: 'gray',
    fontSize: 16,
  },
});
