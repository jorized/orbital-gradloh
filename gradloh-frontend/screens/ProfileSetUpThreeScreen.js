
import { View, Text, StyleSheet, Pressable, Platform, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator, } from "react-native";
import { useFonts } from "expo-font";
import { Lexend_300Light, Lexend_400Regular, Lexend_600SemiBold, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { forwardRef, useContext, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import DropdownWithErrorHandling from "../components/DropdownWithErrorHandling";
import { AuthContext } from "../contexts/AuthContext";
import { AxiosContext } from "../contexts/AxiosContext";
import Toast from "react-native-toast-message";
export default function ProfileSetUpThreeScreen() {

    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

    const authContext = useContext(AuthContext);
    const { publicAxios } = useContext(AxiosContext);

    const [facultyValue, setFacultyValue] = useState('');
    const [majorValue, setMajorValue] = useState('');
    const [minorFacultyValue, setMinorFacultyValue] = useState('');
    const [minorValue, setMinorValue] = useState('');
    const [isFacultyFocus, setIsFacultyFocus] = useState(false);
    const [isMajorFocus, setIsMajorFocus] = useState(false);
    const [isMinorFacultyFocus, setIsMinorFacultyFocus] = useState(false);
    const [isMinorFocus, setIsMinorFocus] = useState(false);

    const [facultyError, setFacultyError] = useState(false);
    const [majorError, setMajorError] = useState(false);
    const [minorFacultyError, setMinorFacultyError] = useState(false);
    const [minorError, setMinorError] = useState(false);

    const toastConfig = {
        warning: ({ text1, text2, props }) => (
          <View style={[styles.toastContainer, styles.warningToast]}>
            <View style={styles.textContainer}>
              <Text style={styles.toastText1}>{text1}</Text>
              {text2 ? <Text style={styles.toastText2}>{text2}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => Toast.hide()} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ),
        success: ({ text1, text2, props }) => (
          <View style={[styles.toastContainer, styles.successToast]}>
            <View style={styles.textContainer}>
              <Text style={styles.toastText1}>{text1}</Text>
              {text2 ? <Text style={styles.toastText2}>{text2}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => Toast.hide()} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ),
    };

    const CustomToast = forwardRef((props, ref) => (
        <Toast ref={ref} config={toastConfig} />
    ));
    

    const route = useRoute();
    const { nickname, email, password, enrolmentYear, primaryMajor, isSelectedMinor, homeFaculty } = route.params || {};

    const facultyData = [
        { label: 'Arts and Social Sciences (FASS)', value: 'FASS' },
        { label: 'Business (SOB)', value: 'SOB' },
        { label: 'Computing (SOC)', value: 'SOC' },
        { label: 'Design and Engineering (CDE)', value: 'CDE' },
        { label: 'Science (FOS)', value: 'FOS' },
    ];

    const secondMajorRestrictions = [
        { label: "Anthropology", value: "Anthropology", faculty: "FASS", restrictedWith: [] },
        { label: "Chinese Language", value: "Chinese Language", faculty: "FASS", restrictedWith: [] },
        { label: "Chinese Studies", value: "Chinese Studies", faculty: "FASS", restrictedWith: [] },
        { label: "Communications and New Media", value: "Communications and New Media", faculty: "FASS", restrictedWith: [] },
        { label: "Economics", value: "Economics", faculty: "FASS", restrictedWith: [] },
        { label: "English Language", value: "English Language", faculty: "FASS", restrictedWith: [] },
        { label: "English Literature", value: "English Literature", faculty: "FASS", restrictedWith: [] },
        { label: "European Studies", value: "European Studies", faculty: "FASS", restrictedWith: [] },
        { label: "Geography", value: "Geography", faculty: "FASS", restrictedWith: [] },
        { label: "Global Studies", value: "Global Studies", faculty: "FASS", restrictedWith: [] },
        { label: "History", value: "History", faculty: "FASS", restrictedWith: [] },
        { label: "Japanese Studies", value: "Japanese Studies", faculty: "FASS", restrictedWith: [] },
        { label: "Malay Studies", value: "Malay Studies", faculty: "FASS", restrictedWith: [] },
        { label: "Philosophy", value: "Philosophy", faculty: "FASS", restrictedWith: [] },
        { label: "Political Science", value: "Political Science", faculty: "FASS", restrictedWith: [] },
        { label: "Psychology", value: "Psychology", faculty: "FASS", restrictedWith: [] },
        { label: "Social Work", value: "Social Work", faculty: "FASS", restrictedWith: [] },
        { label: "Sociology", value: "Sociology", faculty: "FASS", restrictedWith: [] },
        { label: "Southeast Asian Studies", value: "Southeast Asian Studies", faculty: "FASS", restrictedWith: [] },
        { label: "South Asian Studies", value: "South Asian Studies", faculty: "FASS", restrictedWith: [] },
        { label: "Theatre Studies", value: "Theatre Studies", faculty: "FASS", restrictedWith: [] },
        { label: "Management", value: "Management", faculty: "SOB", restrictedWith: ["Business Administration"] },
        { label: "Real Estate Finance", value: "Real Estate Finance", faculty: "SOB", restrictedWith: ["Real Estate"] },
        { label: "Business Analytics", value: "Business Analytics", faculty: "SOC", restrictedWith: ["Computer Science", "Information Systems", "Computer Engineering", "Information Security", "Business Analytics"] },
        { label: "Computer Science", value: "Computer Science", faculty: "SOC", restrictedWith: ["Business Analytics", "Information Systems", "Computer Engineering", "Information Security"] },
        { label: "Information Security", value: "Information Security", faculty: "SOC", restrictedWith: ["Business Analytics", "Computer Science", "Information Systems", "Computer Engineering"] },
        { label: "Information Systems", value: "Information Systems", faculty: "SOC", restrictedWith: ["Business Analytics", "Computer Science", "Information Security", "Computer Engineering"] },
        { label: "Innovation and Design", value: "Innovation and Design", faculty: "CDE", restrictedWith: [] },
        { label: "Systems Engineering", value: "Systems Engineering", faculty: "CDE", restrictedWith: [] },
        { label: "Sustainable Urban Development", value: "Sustainable Urban Development", faculty: "CDE", restrictedWith: [] },
        { label: "Chemistry", value: "Chemistry", faculty: "FOS", restrictedWith: [] },
        { label: "Data Analytics", value: "Data Analytics", faculty: "FOS", restrictedWith: ["Business Analytics", "Data Science and Analytics", "Computer Science"] },
        { label: "Food Science", value: "Food Science", faculty: "FOS", restrictedWith: [] },
        { label: "Life Sciences", value: "Life Sciences", faculty: "FOS", restrictedWith: [] },
        { label: "Mathematics", value: "Mathematics", faculty: "FOS", restrictedWith: ["Applied Mathematics", "Quantitative Finance", "Data Science and Analytics"] },
        { label: "Nutrition", value: "Nutrition", faculty: "FOS", restrictedWith: [] },
        { label: "Pharmaceutical Science", value: "Pharmaceutical Science", faculty: "FOS", restrictedWith: [] },
        { label: "Physics", value: "Physics", faculty: "FOS", restrictedWith: [] },
        { label: "Quantitative Finance", value: "Quantitative Finance", faculty: "FOS", restrictedWith: ["Applied Mathematics", "Mathematics", "Data Science and Analytics"] },
        { label: "Statistics", value: "Statistics", faculty: "FOS", restrictedWith: [] },
    ];

    const minors = [
        // Faculty of Arts & Social Sciences (FASS)
        { label: "Anthropology", value: "Anthropology", faculty: "FASS", restrictedWith: [] },
        { label: "Chinese Language", value: "Chinese Language", faculty: "FASS", restrictedWith: [] },
        { label: "Chinese Studies", value: "Chinese Studies", faculty: "FASS", restrictedWith: [] },
        { label: "Chinese Translation", value: "Chinese Translation", faculty: "FASS", restrictedWith: [] },
        { label: "Communications and New Media", value: "Communications and New Media", faculty: "FASS", restrictedWith: [] },
        { label: "Economics", value: "Economics", faculty: "FASS", restrictedWith: ["Economics"] },
        { label: "English Language", value: "English Language", faculty: "FASS", restrictedWith: [] },
        { label: "English Literature", value: "English Literature", faculty: "FASS", restrictedWith: [] },
        { label: "European Studies", value: "European Studies", faculty: "FASS", restrictedWith: [] },
        { label: "History", value: "History", faculty: "FASS", restrictedWith: [] },
        { label: "Human Services", value: "Human Services", faculty: "FASS", restrictedWith: [] },
        { label: "India Studies", value: "India Studies", faculty: "FASS", restrictedWith: [] },
        { label: "Interpreting", value: "Interpreting", faculty: "FASS", restrictedWith: [] },
        { label: "Japanese Studies", value: "Japanese Studies", faculty: "FASS", restrictedWith: [] },
        { label: "Malay Studies", value: "Malay Studies", faculty: "FASS", restrictedWith: [] },
        { label: "Philosophy", value: "Philosophy", faculty: "FASS", restrictedWith: [] },
        { label: "Political Science", value: "Political Science", faculty: "FASS", restrictedWith: ["Political Science"] },
        { label: "Psychology", value: "Psychology", faculty: "FASS", restrictedWith: ["Psychology"] },
        { label: "Sociology", value: "Sociology", faculty: "FASS", restrictedWith: [] },
        { label: "Southeast Asian Studies", value: "Southeast Asian Studies", faculty: "FASS", restrictedWith: [] },
        { label: "South Asian Studies", value: "South Asian Studies", faculty: "FASS", restrictedWith: [] },
        { label: "Theatre Studies", value: "Theatre Studies", faculty: "FASS", restrictedWith: [] },
    
        // School of Business (SOB)
        { label: "Management", value: "Management", faculty: "SOB", restrictedWith: ["Business Administration"] },
        { label: "Entrepreneurship", value: "Entrepreneurship", faculty: "SOB", restrictedWith: [] },
        { label: "Technopreneurship", value: "Technopreneurship", faculty: "SOB", restrictedWith: [] },
        { label: "Real Estate", value: "Real Estate", faculty: "SOB", restrictedWith: ["Real Estate Finance"] },
        { label: "Management of Technology", value: "Management of Technology", faculty: "SOB", restrictedWith: [] },
    
        // School of Computing (SOC)
        { label: "Artificial Intelligence", value: "Artificial Intelligence", faculty: "SOC", restrictedWith: [] },
        { label: "Business Analytics", value: "Business Analytics", faculty: "SOC", restrictedWith: ["Business Analytics", "Computer Science", "Computer Engineering", "Information Security", "Information Systems"] },
        { label: "Computer Science", value: "Computer Science", faculty: "SOC", restrictedWith: ["Business Analytics", "Computer Science", "Computer Engineering", "Information Security", "Information Systems"] },
        { label: "Information Security", value: "Information Security", faculty: "SOC", restrictedWith: ["Business Analytics", "Computer Science", "Computer Engineering", "Information Security", "Information Systems"] },
        { label: "Information Systems", value: "Information Systems", faculty: "SOC", restrictedWith: ["Business Analytics", "Computer Science", "Computer Engineering", "Information Security", "Information Systems"] },
        { label: "Data Engineering", value: "Data Engineering", faculty: "SOC", restrictedWith: [] },
        { label: "Interactive Media Development", value: "Interactive Media Development", faculty: "SOC", restrictedWith: [] },
    
        // College of Design and Engineering (CDE)
        { label: "Architectural Studies", value: "Architectural Studies", faculty: "CDE", restrictedWith: [] },
        { label: "Biomedical Engineering", value: "Biomedical Engineering", faculty: "CDE", restrictedWith: [] },
        { label: "Landscape Architectural Studies", value: "Landscape Architectural Studies", faculty: "CDE", restrictedWith: [] },
        { label: "Project Management", value: "Project Management", faculty: "CDE", restrictedWith: ["Civil Engineering"] },
        { label: "Systems Engineering", value: "Systems Engineering", faculty: "CDE", restrictedWith: ["Industrial and Systems Engineering"] },
        { label: "Data Engineering", value: "Data Engineering", faculty: "CDE", restrictedWith: [] },
        { label: "Engineering Materials", value: "Engineering Materials", faculty: "CDE", restrictedWith: [] },
        { label: "Infrastructure Management and Finance", value: "Infrastructure Management and Finance", faculty: "CDE", restrictedWith: [] },
        { label: "Innovation and Design", value: "Innovation and Design", faculty: "CDE", restrictedWith: [] },
        { label: "Management of Technology", value: "Management of Technology", faculty: "CDE", restrictedWith: [] },
    
        // Faculty of Science (FOS)
        { label: "Analytical Chemistry", value: "Analytical Chemistry", faculty: "FOS", restrictedWith: [] },
        { label: "Astronomy", value: "Astronomy", faculty: "FOS", restrictedWith: [] },
        { label: "Bioinformatics", value: "Bioinformatics", faculty: "FOS", restrictedWith: [] },
        { label: "Biophysics", value: "Biophysics", faculty: "FOS", restrictedWith: [] },
        { label: "Botany", value: "Botany", faculty: "FOS", restrictedWith: [] },
        { label: "Chemistry", value: "Chemistry", faculty: "FOS", restrictedWith: [] },
        { label: "Data Analytics", value: "Data Analytics", faculty: "FOS", restrictedWith: ["Business Analytics", "Data Science and Analytics", "Computer Science"] },
        { label: "Environmental Biology", value: "Environmental Biology", faculty: "FOS", restrictedWith: [] },
        { label: "Environmental Chemistry", value: "Environmental Chemistry", faculty: "FOS", restrictedWith: [] },
        { label: "Food Science and Technology", value: "Food Science and Technology", faculty: "FOS", restrictedWith: [] },
        { label: "Forensic Science", value: "Forensic Science", faculty: "FOS", restrictedWith: [] },
        { label: "Geosciences", value: "Geosciences", faculty: "FOS", restrictedWith: [] },
        { label: "Life Sciences", value: "Life Sciences", faculty: "FOS", restrictedWith: [] },
        { label: "Mathematics", value: "Mathematics", faculty: "FOS", restrictedWith: [] },
        { label: "Meteorology and Climate Science", value: "Meteorology and Climate Science", faculty: "FOS", restrictedWith: [] },
        { label: "Nanoscience", value: "Nanoscience", faculty: "FOS", restrictedWith: [] },
        { label: "Nutrition", value: "Nutrition", faculty: "FOS", restrictedWith: [] },
        { label: "Pharmaceutical Science", value: "Pharmaceutical Science", faculty: "FOS", restrictedWith: [] },
        { label: "Physics", value: "Physics", faculty: "FOS", restrictedWith: ["Physics", "Applied Physics"] },
        { label: "Physics in Technology", value: "Physics in Technology", faculty: "FOS", restrictedWith: [] },
        { label: "Statistics", value: "Statistics", faculty: "FOS", restrictedWith: ["Data Science and Analytics", "Statistics"] },
        { label: "Quantitative Finance", value: "Quantitative Finance", faculty: "FOS", restrictedWith: [] }
    ];

    const restrictedFaculties = secondMajorRestrictions
        .filter(secondMajor => secondMajor.restrictedWith.includes(primaryMajor))
        .map(secondMajor => secondMajor.faculty);

    const filteredFaculty = facultyData.filter(faculty => !restrictedFaculties.includes(faculty.value));

    const filteredMajorData = secondMajorRestrictions.filter(
        secondMajor => 
            secondMajor.faculty === facultyValue &&
            !secondMajor.restrictedWith.includes(primaryMajor)
    );
    
    const [fontsLoaded] = useFonts({
        Lexend_300Light,
        Lexend_400Regular,
        Lexend_600SemiBold,
        Lexend_700Bold
    });


    const handleSubmit = async () => {

        if (!facultyValue) {
          setFacultyError(true);
        } 

        if (!majorValue) {
          setMajorError(true);
        }

        // if (!minorFacultyValue) {
        //   setMinorFacultyError(true);
        // }

        // if (!minorValue) {
        //   setMinorError(true);
        // }
        
        else {
          setFacultyError(false);
          setMajorError(false);
          setMinorFacultyError(false);
          setMinorError(false);
          setLoading(true);
          // Create the user account first
          try {
            const secondaryMajor = majorValue;
            const firstMinor = minorValue;
            const secondMinor = '';
            const response = await publicAxios.post('/register', {
              nickname,
              email,
              password,
              enrolmentYear,
              primaryMajor,
              secondaryMajor,
              firstMinor,
              secondMinor,
              homeFaculty
            });
            setLoading(false);

            const { accessToken, refreshToken } = response.data;
            //Navigate to onboarding screen 
            authContext.setAuthState({
                accessToken,
                refreshToken,
            });
            navigation.push('OnboardingScreen', {
                email: email,
                accessToken : accessToken,
                refreshToken : refreshToken
            });

          } catch (error) {
            setLoading(false);
            if (!error.response) {
              Toast.show({
                type: 'warning',
                text1: 'Error',
                text2: "Server is offline",
                visibilityTime: 5000,
                autoHide: true,
                position: 'bottom',
                bottomOffset: 40,
              });
            } else {
              Toast.show({
                type: 'warning',
                text1: 'Error',
                text2: error.response.data.message,
                visibilityTime: 5000,
                autoHide: true,
                position: 'bottom',
                bottomOffset: 40,
              });
            }
          }


        }
    };

    if (!fontsLoaded) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.profileSetUpTitle}>
                    Profile Setup
                </Text>
                <Text style={styles.facultyTitleText}>
                    *Please select your secondary major's faculty
                </Text>

                <DropdownWithErrorHandling
                    data={filteredFaculty} 
                    value={facultyValue} 
                    placeholder="Select faculty*"
                    error={facultyError}
                    setValue={setFacultyValue}
                    setIsFocus={setIsFacultyFocus}
                    setError={setFacultyError}
                />

                {facultyValue && (
                    <>
                        <Text style={styles.majorTitleText}>
                            *Please select your secondary major
                        </Text>
                        <DropdownWithErrorHandling
                            data={filteredMajorData} 
                            value={majorValue} 
                            placeholder="Select major*"
                            error={majorError}
                            setValue={setMajorValue}
                            setIsFocus={setIsMajorFocus}
                            setError={setMajorError}
                            isSearch={true}
                            searchPlaceholder="Search..."
                        />
                    </>
                )}

                {isSelectedMinor && (
                    <>
                        <Text style={styles.facultyTitleText}>
                            *Please select your minor's faculty
                        </Text>

                        <DropdownWithErrorHandling
                            data={filteredFaculty} 
                            value={facultyValue} 
                            placeholder="Select faculty*"
                            error={facultyError}
                            setValue={setFacultyValue}
                            setIsFocus={setIsFacultyFocus}
                            setError={setFacultyError}
                        />
                    </>
                )}

            </View>
            {Platform.OS === 'android' ? (
                    <TouchableNativeFeedback
                        onPress={loading ? null : handleSubmit}
                        background={TouchableNativeFeedback.Ripple('#fff', false)}
                        disabled={loading}
                    >
                        <View style={[styles.loginPressable, loading && styles.disabledPressable]}>
                            {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.loginText}>Next</Text>}
                        </View>
                    </TouchableNativeFeedback>
                ) : (
                    <TouchableOpacity
                        style={[styles.loginPressable, loading && styles.disabledPressable]}
                        onPress={loading ? null : handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.loginText}>Next</Text>}
                    </TouchableOpacity>
            )}
            <CustomToast />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 36,
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-between"
    },
    profileSetUpTitle: {
        fontFamily: "Lexend_600SemiBold",
        color: "#2C2C2E",
        fontSize: 40,
        marginBottom: 24
    },
    facultyTitleText: {
        fontFamily: "Lexend_300Light",
        fontSize: 16,
        marginBottom: 24
    },
    majorTitleText: {
        marginTop: 24,
        fontFamily: "Lexend_300Light",
        fontSize: 16,
        marginBottom: 24
    },
    optionalTitleText: {
        marginTop: 24,
        fontFamily: "Lexend_300Light",
        fontSize: 14,
    },
    optionalText: {
        fontFamily: "Lexend_300Light",
        fontSize: 14,
        marginBottom: 24
    },
    dropdownOne: {
        borderBottomWidth: 1,
        borderBottomColor: "#CBCBCB",
        marginBottom: 24
    },
    dropdownTwo: {
        borderBottomWidth: 1,
        borderBottomColor: "#CBCBCB",
        marginBottom: 24
    },
    dropdownPlaceholder: {
        color: "#CBCBCB"
    },
    loginPressable: {
        padding: 16,
        backgroundColor: "#EF7C00",
        borderRadius: 12,
    },
    loginText: {
        textAlign: "center",
        color: "white",
        fontSize: 18,
        fontFamily: "Lexend_400Regular"
    },
    toastContainer: {   
        width: '90%',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    warningToast: {
        backgroundColor: '#D00E17',
    },
    successToast: {
        backgroundColor: '#28a745', 
    },
    textContainer: {
        flex: 1,
        flexShrink: 1, 
    },
    toastText1: {
        fontSize: 16,
        color: 'white',
    },
    toastText2: {
        fontSize: 12,
        color: 'white',
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
})