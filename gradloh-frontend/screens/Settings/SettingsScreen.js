import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import DrawerHeader from '../../components/Drawer/DrawerHeader';
import { useNavigation } from '@react-navigation/native';
import Collapsible from 'react-native-collapsible';
import { AntDesign, Ionicons, Entypo, Feather } from '@expo/vector-icons';
import { AxiosContext } from '../../contexts/AxiosContext';
import * as SecureStore from 'expo-secure-store';
import { LoadingContext } from '../../contexts/LoadingContext';
import ChangeNicknameAlert from '../../components/Settings/ChangeNicknameAlert';
import ThemeContext from '../../contexts/ThemeContext';

export default function SettingsScreen({ toggleTheme, headerName }) {

  const userProfileDetails = SecureStore.getItem('userprofiledetails');
  const email = JSON.parse(userProfileDetails).email;
  const nickname = JSON.parse(userProfileDetails).nickname;

  const navigation = useNavigation();
  const [collapsed, setCollapsed] = useState(true);
  const [isNicknameAlertVisible, setIsNicknameAlertVisible] = useState(false);
  const [faqCollapsed, setFaqCollapsed] = useState(true);
  const [questionCollapsed, setQuestionCollapsed] = useState({});

  const publicAxios = useContext(AxiosContext);
  const { setIsLoading } = useContext(LoadingContext);
  const theme = useContext(ThemeContext);

  const handleTutorial = () => {
    Alert.alert(
      "Notice",
      "Are you sure you want to proceed with the tutorial? It cannot be skipped or pause at any point in time.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Proceed", onPress: () => navigation.navigate("Dashboard", {startTutorial: true}) }
      ],
      { cancelable: false }
    );
  }

  const handleLoadSamplePlan = () => {
    Alert.alert(
      "Warning",
      "Are you sure you load in the sample plan for your curriculum? Note that this will overwrite your existing folders and cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => loadSamplePlan() }
      ],
      { cancelable: false }
    );
  }

  const loadSamplePlan = () => {
    setIsLoading(true);
    publicAxios.authAxios.post('/loadsampleplan', {
      email
    }).then((response) => {
      setIsLoading(false);
      Alert.alert("Success", "Your sample plan has successfully been loaded");
    }).catch((error) => {
      console.log(error)
    });
  }

  const handleOpenNicknameAlert = () => {
    setIsNicknameAlertVisible(true);
  }

  const handleCloseNicknameAlert = () => {
    setIsNicknameAlertVisible(false);
  };

  const handleChangeNickname = (inputvalue) => {
    if (!inputvalue) {
      Alert.alert("Error", "Nickname cannot be empty");
    } else {
      setIsNicknameAlertVisible(false);
      setIsLoading(true);
      const nickname = inputvalue;
      publicAxios.authAxios.put('/updatenickname', {
        email,
        nickname
      }).then((response) => {
        setIsLoading(false);
        Alert.alert("Success", "Your nickname has successfully been updated");
        SecureStore.setItem('userprofiledetails',JSON.stringify({nickname,email}))
      }).catch((error) => {
        console.log(error)
      });
    }
  }

  const toggleFAQ = () => {
    setFaqCollapsed(!faqCollapsed);
  };

  const toggleQuestion = (question) => {
    setQuestionCollapsed({
      ...questionCollapsed,
      [question]: !questionCollapsed[question],
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <DrawerHeader toggleTheme={toggleTheme} headerName={headerName} />

      <ScrollView style={styles.contentContainer}>
        <View style={styles.generalContainer}>
          <SectionTitle title="GENERAL" />
          <SettingsItem
            style={styles.loadSamplePlanContainer}
            icon={<AntDesign name="edit" size={24} color={theme.color} />}
            text="Change nickname"
            onPress={handleOpenNicknameAlert}
            textColor={theme.color}
          />
          <SettingsItem
            style={styles.loadSamplePlanContainer}
            icon={<Ionicons name="download-outline" size={24} color={theme.color} />}
            text="Load sample plan"
            onPress={handleLoadSamplePlan}
            textColor={theme.color}
          />
          <SettingsItem
            style={styles.loadSamplePlanContainer}
            icon={<Ionicons name="footsteps-outline" size={24} color={theme.color} />}
            text="Tutorial"
            onPress={handleTutorial}
            textColor={theme.color}
          />
        </View>
        <View style={styles.feedbackContainer}>
          <SectionTitle title="FEEDBACK" />
          <SettingsItem
            style={styles.loadSamplePlanContainer}
            icon={<AntDesign name="question" size={24} color={theme.color} />}
            text="Frequently asked questions"
            textColor={theme.color}
            onPress={toggleFAQ}
            rightIcon={faqCollapsed ? <Feather name="chevron-down" size={24} color={theme.color} /> : <Feather name="chevron-up" size={24} color={theme.color} />}
          />
          <Collapsible collapsed={faqCollapsed}>
            <TouchableOpacity style={styles.questionContainer} onPress={() => toggleQuestion('q1')}>
              <Text style={styles.questionText}>What is the difference between GradLoh and NUSMods?</Text>
              {questionCollapsed.q1 ? <Feather name="chevron-up" size={18} color={theme.color} /> : <Feather name="chevron-down" size={18} color={theme.color} />}
            </TouchableOpacity>
            <Collapsible collapsed={questionCollapsed.q1}>
              <Text style={styles.answerText}>
                GradLoh is significantly different from NUSMods in the way that it is developed to be a more generalised application made for the mobile platform to allow NUS students to keep track of their graduation, on top of their modules.
              </Text>
            </Collapsible>
            {/* Add more questions here in the same format */}
          </Collapsible>
          <SettingsItem
            style={styles.loadSamplePlanContainer}
            icon={<AntDesign name="warning" size={24} color={theme.color} />}
            text="Report a bug"
            textColor={theme.color}
          />
          <SettingsItem
            style={styles.loadSamplePlanContainer}
            icon={<Entypo name="paper-plane" size={24} color={theme.color} />}
            text="Give us feedback"
            textColor={theme.color}
          />
        </View>
      </ScrollView>
      <ChangeNicknameAlert
        isVisible={isNicknameAlertVisible}
        onClose={handleCloseNicknameAlert}
        onSubmit={handleChangeNickname}
        defaultValue={nickname}
      />
    </View>
  );
}

const SectionTitle = ({ title }) => (
  <View style={styles.sectionTitleContainer}>
    <Text style={styles.sectionTitleText}>{title}</Text>
  </View>
);

const SettingsItem = ({ style, icon, text, onPress, textColor, rightIcon }) => (
  <TouchableOpacity style={[styles.settingsItemContainer, style]} onPress={onPress}>
    {icon}
    <Text style={[styles.settingsItemText, {color: textColor}]}>{text}</Text>
    {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 40,
  },
  sectionTitleContainer: {
    marginBottom: 20,
  },
  sectionTitleText: {
    fontSize: 20,
    fontFamily: "Lexend_300LightBold",
    color: "#888888",
  },
  settingsItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
  },
  settingsItemText: {
    fontSize: 18,
    fontFamily: "Lexend_400Regular",
  },
  loadSamplePlanContainer: {
    paddingVertical: 30,
  },
  feedbackContainer: {
    marginTop: 30
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginVertical: 20,
    padding: 10
  },
  questionText: {
    fontSize: 14,
    fontFamily: "Lexend_400Regular",
  },
  answerText: {
    fontSize: 14,
    fontFamily: "Lexend_300Light",
    padding: 10,
    marginBottom: 10,
  },
  rightIconContainer: {
    marginLeft: 'auto',
  },
});

