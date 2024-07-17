import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DrawerHeader from "../../components/Drawer/DrawerHeader";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import * as SecureStore from 'expo-secure-store';
import ThemeContext from "../../contexts/ThemeContext";
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import GetStartedButtons from '../../components/Henry/GetStartedButtons';
import { AxiosContext } from '../../contexts/AxiosContext';
import NUSModsData from '../../data/ListOfModules2324.json';
import cosineSimilarity from 'compute-cosine-similarity';
import { useNavigation } from '@react-navigation/native';

const botAvatar = require('../../assets/images/henryicon.png');
const BOT = {
    _id: 2,
    name: 'Henry',
    avatar: botAvatar,
};

const predefinedMessages = {
    welcome: {
        text: "Hello I'm Henry, your smart assistant! How can I help you?",
        user: BOT
    },
    notSure: {
        text: "I'm not sure if I understand. Can you rephrase that?",
        user: BOT
    },
    notSureModule: {
        text: "I'm not sure if there is a module with that code. Can you rephrase that?",
        user: BOT
    },
    addEditFeedback: {
        text: 'Would you like to add/edit feedback?',
        user: BOT
    },
    viewFeedbackMessageOne: {
        text: 'Here is the list of semesters with modules that you have given feedbacks for.\n\nPlease select the semester you would like to view/edit the feedbacks.',
        user: BOT
    },
    viewFeedbackMessageTwo: 'You have chosen {chosenSem}.\n\nHere is the list of modules for the chosen semester that you have given reviews for.\n\nTo edit the reviews, select any one of the modules or type "done" if you would like to exit.',
    viewFeedbackMessageThree: "You have chosen {chosenMod}.\n\nYour previous rating for this module was {currentRating}.\n\nWhat would you like to update this module's rating to?\n\nPlease select a rating from 1 to 5.",
    viewFeedbackMessageFour: 'You have successfully updated the rating for {moduleCode}.\n\nThe new rating is now {rating} ⭐.\n\nWould you like to view/edit feedback for another module?',
    giveFeedbackMessageOne: {
        text: 'Here is the list of semesters with modules that have yet to be given feedbacks.\n\nPlease select the semester you would like to give feedback for.',
        user: BOT
    },
    giveFeedbackMessageTwo: 'You have chosen {chosenSem}.\n\nHere is the list of modules for the chosen semester that have yet to be reviewed.\n\nPlease select the module you would like to review.',
    giveFeedbackMessageThree: 'You have chosen {chosenMod}.\n\nWhat would you like to rate this module?\n\nPlease select a rating from 1 to 5.',
    giveFeedbackMessageFour: 'You have successfully given a {rating} ⭐ for {moduleCode}.\n\nWould you like to give feedback for another module?',
    recommendModulesMessageOne: {
        text: 'What would you like me to recommend your modules based on?',
        user: BOT
    },
    recommendModulesMessageTwoA: {
        text: 'Here is the list of recommended modules which you may like in no particular order, based on your completed modules and feedback (if any).\n\nYou can click on them to view more details.\n\nType "again" if you would like another set of recommendations or "done" if you would like to exit.',
        user: BOT
    },
    recommendModulesMessageTwoB: {
        text: 'Please enter the module code of the module you would like me to recommend.',
        user: BOT
    },
    recommendModulesMessageThreeB: {
        text: 'Here is the list of recommended modules based on your chosen module.\n\nYou can click on them to view more details.\n\nType "again" if you would like another set of recommendations or "done" if you would like to exit.',
        user: BOT
    }
};

const semesterMapping = {
    "1": "Y1S1",
    "2": "Y1S2",
    "3": "Y2S1",
    "4": "Y2S2",
    "5": "Y3S1",
    "6": "Y3S2",
    "7": "Y4S1",
    "8": "Y4S2"
};

const reverseSemesterMapping = Object.fromEntries(
    Object.entries(semesterMapping).map(([key, value]) => [value, key])
);

export default function ChatbotScreen({ headerName, navigation }) {

    const publicAxios = useContext(AxiosContext);
    const theme = useContext(ThemeContext);
    const [flowState, setFlowState] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    const [semsWoModsReviewed, setSemsWoModsReviewed] = useState([]);
    const [modsInSpecificFolderWoReview, setModsInSpecificFolderWoReview] = useState([]);
    const [giveFeedbackFlowSelectedSemester, setGiveFeedbackFlowSelectedSemester] = useState('');
    const [giveFeedbackFlowSelectedModule, setGiveFeedbackFlowSelectedModule] = useState('');
    const [giveFeedbackFlowSelectedRating, setGiveFeedbackFlowSelectedRating] = useState(0);

    const [recommendedModulesBasedOnSemesters, setRecommendedModulesBasedOnSemesters] = useState([]);
    const [recommendedModulesBasedOnModule, setRecommendedModulesBasedOnModule] = useState([]);
    const [recommendModulesFlowSelectedModule, setRecommendModulesFlowSelectedModule] = useState('');

    const [semsWModsReviewed, setSemsWModsReviewed] = useState([]);
    const [modsInSpecificFolderWReview, setModsInSpecificFolderWReview] = useState([]);
    const [viewFeedbacksFlowSelectedSemester, setViewFeedbacksFlowSelectedSemester] = useState('');
    const [viewFeedbacksFlowSelectedModule, setViewFeedbacksFlowSelectedModule] = useState('');
    const [viewFeedbacksFlowCurrentRating, setViewFeedbacksFlowCurrentRating] = useState(0);
    const [viewFeedbacksFlowSelectedRating, setViewFeedbacksFlowSelectedRating] = useState(0);

    const userProfileDetails = SecureStore.getItem('userprofiledetails');
    const email = JSON.parse(userProfileDetails).email;
    const nickname = JSON.parse(userProfileDetails).nickname;

    const [messages, setMessages] = useState([
        {
            _id: 0,
            text: 'New chat created.',
            createdAt: new Date().getTime(),
            system: true
        },
        { ...predefinedMessages.welcome, _id: Date.now() + Math.random() }
    ]);

    useEffect(() => {
        SecureStore.deleteItemAsync('flowstate');
    }, []);

    // Function to convert text to terms (tokens) from multiple fields
    const textToTerms = (text) => text.toLowerCase().match(/\w+/g);

    // Function to combine relevant module fields into a single text
    const combineModuleFields = (module) => {
        const title = module.title || '';
        const prerequisites = module.prerequisite || '';
        const faculty = module.faculty || '';
        return `${title} ${prerequisites} ${faculty}`;
    };

    // Function to calculate term frequency
    const termFrequency = (terms) => {
        const termCounts = {};
        terms.forEach(term => {
            termCounts[term] = (termCounts[term] || 0) + 1;
        });
        return termCounts;
    };

    // Function to calculate inverse document frequency
    const inverseDocumentFrequency = (docs) => {
        const numDocs = docs.length;
        const docCounts = {};
        docs.forEach(doc => {
            const terms = new Set(doc);
            terms.forEach(term => {
                docCounts[term] = (docCounts[term] || 0) + 1;
            });
        });
        const idf = {};
        Object.keys(docCounts).forEach(term => {
            idf[term] = Math.log(numDocs / (1 + docCounts[term]));
        });
        return idf;
    };

    // Function to calculate TF-IDF vectors for all documents
    const tfidf = (docs) => {
        const termFreqs = docs.map(doc => termFrequency(doc));
        const idf = inverseDocumentFrequency(docs);
        return termFreqs.map(tf => {
            const tfidfVec = {};
            Object.keys(tf).forEach(term => {
                tfidfVec[term] = tf[term] * idf[term];
            });
            return tfidfVec;
        });
    };

    // Function to calculate cosine similarity between two TF-IDF vectors
    const calculateCosineSimilarity = (vec1 = {}, vec2 = {}) => {
        const terms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
        const vec1Arr = [];
        const vec2Arr = [];
        terms.forEach(term => {
            vec1Arr.push(vec1?.[term] || 0);
            vec2Arr.push(vec2?.[term] || 0);
        });
        return cosineSimilarity(vec1Arr, vec2Arr);
    };

    // Fetch user ratings from the backend
    const fetchUserRatings = async (email) => {
        try {
            const apiResponse = await publicAxios.authAxios.get('/everymodulereview', {
                params: { email: email }
            });
            const ratings = apiResponse.data.everyModuleReviews;
            return Object.keys(ratings).map(moduleCode => ({
                moduleCode,
                rating: ratings[moduleCode]
            }));
        } catch (error) {
            console.error('Error fetching user ratings:', error);
            return [];
        }
    };

    // Fetch completed modules from the backend
    const fetchCompletedModules = async (email) => {
        try {
            const apiResponse = await publicAxios.authAxios.get('/modsforeverysem', {
                params: { email: email }
            });
            return apiResponse.data.modsForEveryFolder;
        } catch (error) {
            console.error('Error fetching completed modules:', error);
            return [];
        }
    };

    // Function to recommend modules based on ratings
    const recommendModulesBasedOnRatings = (userRatings, allModules, tfidfMatrix) => {
        const highRatedModules = userRatings.filter(rating => rating.rating >= 4);
        const recommendedModules = [];

        allModules.forEach(module => {
            const isAlreadyTaken = userRatings.some(rating => rating.moduleCode === module.moduleCode);
            if (!isAlreadyTaken) {
                let maxSimilarity = 0;
                highRatedModules.forEach(ratedModule => {
                    const ratedModuleDetails = allModules.find(m => m.moduleCode === ratedModule.moduleCode);
                    if (ratedModuleDetails) {
                        const moduleVec = tfidfMatrix[allModules.indexOf(module)];
                        const ratedModuleVec = tfidfMatrix[allModules.indexOf(ratedModuleDetails)];
                        const similarity = calculateCosineSimilarity(moduleVec, ratedModuleVec);
                        if (similarity > maxSimilarity) {
                            maxSimilarity = similarity;
                        }
                    }
                });
                if (maxSimilarity > 0.5) { // Threshold for similarity
                    recommendedModules.push({ ...module, similarity: maxSimilarity });
                }
            }
        });

        return recommendedModules.sort((a, b) => b.similarity - a.similarity);
    };

    // Function to recommend modules based on completed modules
    const recommendModulesBasedOnCompleted = (completedModules, allModules, tfidfMatrix) => {
        const completedModuleDetails = completedModules.map(code => allModules.find(m => m.moduleCode === code));
        const recommendedModules = [];

        allModules.forEach(module => {
            const isAlreadyTaken = completedModules.includes(module.moduleCode);
            if (!isAlreadyTaken) {
                let maxSimilarity = 0;
                completedModuleDetails.forEach(completedModule => {
                    if (completedModule) {
                        const moduleVec = tfidfMatrix[allModules.indexOf(module)];
                        const completedModuleVec = tfidfMatrix[allModules.indexOf(completedModule)];
                        const similarity = calculateCosineSimilarity(moduleVec, completedModuleVec);
                        if (similarity > maxSimilarity) {
                            maxSimilarity = similarity;
                        }
                    }
                });
                if (maxSimilarity > 0.5) { // Threshold for similarity
                    recommendedModules.push({ ...module, similarity: maxSimilarity });
                }
            }
        });

        return recommendedModules.sort((a, b) => b.similarity - a.similarity);
    };

        // Function to recommend modules based on a specific module
    const recommendModulesBasedOnSpecificModule = (selectedModule, allModules, tfidfMatrix) => {
        const selectedModuleIndex = allModules.indexOf(selectedModule);
        const selectedModuleVector = tfidfMatrix[selectedModuleIndex];

        const recommendedModules = allModules.map((module, index) => {
            if (index === selectedModuleIndex || !module.title) return null; // Skip the selected module and modules without titles
            const moduleVector = tfidfMatrix[index];
            const similarity = calculateCosineSimilarity(selectedModuleVector, moduleVector);
            return { ...module, similarity };
        }).filter(Boolean); // Remove null values

        return recommendedModules
            .sort((a, b) => b.similarity - a.similarity) // Sort by similarity
            .slice(0, 5); // Limit to top 5 recommendations
    };


    async function handleRecommendModulesOneA() {
        setIsTyping(true);
        try {
            const userRatings = await fetchUserRatings(email);

            // Combine module fields and calculate TF-IDF matrix inside this function
            const moduleCombinedTexts = NUSModsData
                .filter(module => module.title)
                .map(module => combineModuleFields(module));
            const moduleTerms = moduleCombinedTexts.map(text => textToTerms(text));
            const tfidfMatrix = tfidf(moduleTerms);

            let recommendations;
            if (userRatings.length > 0) {
                const highRatedModules = userRatings.filter(rating => rating.rating >= 4);
                if (highRatedModules.length > 0) {
                    // Recommend based on high ratings
                    recommendations = recommendModulesBasedOnRatings(userRatings, NUSModsData, tfidfMatrix);
                } else {
                    // Fallback to completed modules if no high ratings
                    const completedModules = userRatings.map(rating => rating.moduleCode);
                    recommendations = recommendModulesBasedOnCompleted(completedModules, NUSModsData, tfidfMatrix);
                }
            } else {
                // Fallback to completed modules if no ratings at all
                const completedModules = await fetchCompletedModules(email);
                recommendations = recommendModulesBasedOnCompleted(completedModules, NUSModsData, tfidfMatrix);
            }

            // Shuffle and limit to 5 recommendations
            recommendations = recommendations
                .sort(() => Math.random() - 0.5)
                .slice(0, 5);

            const newResponse = { ...predefinedMessages.recommendModulesMessageTwoA, _id: Date.now() + Math.random() };
            setIsTyping(false);
            setRecommendedModulesBasedOnSemesters(recommendations);
            await SecureStore.setItemAsync('flowstate', 'recommend_modules_one_a');
            setMessages(previousMessages => GiftedChat.append(previousMessages, newResponse));
        } catch (error) {
            console.error('Error in handleRecommendModulesOneA:', error);
            setIsTyping(false);
            const errorResponse = {
                text: 'An error occurred while fetching data.',
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, errorResponse));
        }
    }

    async function handleRecommendModulesOneB() {
        setIsTyping(true);
        try {
            await SecureStore.setItemAsync('flowstate', 'recommend_modules_one_b');
            setTimeout(() => {
                setIsTyping(false);
                const newResponse = { ...predefinedMessages.recommendModulesMessageTwoB, _id: Date.now() + Math.random() };
                setMessages(previousMessages => GiftedChat.append(previousMessages, newResponse));
            }, 1000);
        } catch (error) {
            console.error('Error in handleRecommendModulesOneB:', error);
        }
    }

    async function handleRecommendModulesTwoB(moduleCode) {
        setIsTyping(true);
        try {
            // Find the selected module
            const selectedModule = NUSModsData.find(module => module.moduleCode === moduleCode);
    
            // Check if the selected module exists
            if (!selectedModule) {
                throw new Error(`Module with code ${moduleCode} not found.`);
            }
    
            // Combine fields for all modules and generate TF-IDF vectors
            const moduleCombinedTexts = NUSModsData
                .filter(module => module.title)  // Ensure all modules have a title
                .map(module => combineModuleFields(module));
    
            const moduleTerms = moduleCombinedTexts.map(text => textToTerms(text));
            const tfidfMatrix = tfidf(moduleTerms);
    
            // Get recommendations based on the specific module
            const recommendations = recommendModulesBasedOnSpecificModule(selectedModule, NUSModsData, tfidfMatrix);
    
            // Shuffle and limit to 5 recommendations
            const shuffledRecommendedModules = recommendations
                .sort(() => Math.random() - 0.5)
                .slice(0, 5);
    
            const newResponse = { ...predefinedMessages.recommendModulesMessageThreeB, _id: Date.now() + Math.random() };
            setIsTyping(false);
            setRecommendedModulesBasedOnModule(shuffledRecommendedModules);
            setRecommendModulesFlowSelectedModule(moduleCode);
            await SecureStore.setItemAsync('flowstate', 'recommend_modules_two_b');
            setMessages(previousMessages => GiftedChat.append(previousMessages, newResponse));
        } catch (error) {
            console.error('Error in handleRecommendModulesTwoB:', error);
            setIsTyping(false);
            const errorResponse = {
                text: 'An error occurred while fetching data.',
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, errorResponse));
        }
    }
    
    

    async function handleGiveFeedback() {
        setIsTyping(true);
        try {
            const apiResponse = await publicAxios.authAxios.get('/folderswithoutallmodsreviewed', {
                params: { email: email }
            });
            setIsTyping(false);
            const data = apiResponse.data;
            const mappedSemesters = data.foldersWithoutAllModsReviewed.map(sem => semesterMapping[sem]);
            const response = { ...predefinedMessages.giveFeedbackMessageOne, _id: Date.now() + Math.random() };
            setSemsWoModsReviewed(mappedSemesters);
            await SecureStore.setItemAsync('flowstate', 'give_feedback');
            setMessages(previousMessages => GiftedChat.append(previousMessages, response));
        } catch (error) {
            setIsTyping(false);
            const errorResponse = {
                text: 'An error occurred while fetching data.',
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, errorResponse));
        }
    }

    async function handleGiveFeedbackTwo(chosenSem) {
        const semKey = reverseSemesterMapping[chosenSem];
        setIsTyping(true);
        try {
            const apiResponse = await publicAxios.authAxios.get('/modsinspecificfolderwithoutreviews', {
                params: { email: email, folderName: semKey }
            });
            setIsTyping(false);
            const data = apiResponse.data;
            const newResponse = {
                text: predefinedMessages.giveFeedbackMessageTwo.replace('{chosenSem}', chosenSem),
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setGiveFeedbackFlowSelectedSemester(chosenSem);
            setModsInSpecificFolderWoReview(data.modsInSpecificFolderWithoutReviews);
            await SecureStore.setItemAsync('flowstate', 'give_feedback_two');
            setMessages(previousMessages => GiftedChat.append(previousMessages, newResponse));
        } catch (error) {
            setIsTyping(false);
            const errorResponse = {
                text: 'An error occurred while fetching data.',
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, errorResponse));
        }
    }

    async function handleGiveFeedbackThree(chosenMod) {
        setIsTyping(true);
        try {
            setGiveFeedbackFlowSelectedModule(chosenMod);
            await SecureStore.setItemAsync('flowstate', 'give_feedback_three');
            setTimeout(() => {
                setIsTyping(false);
                const newResponse = {
                    text: predefinedMessages.giveFeedbackMessageThree.replace('{chosenMod}', chosenMod),
                    user: BOT,
                    _id: Date.now() + Math.random()
                };
                setMessages(previousMessages => GiftedChat.append(previousMessages, newResponse));
            }, 1000);
        } catch (error) {
            setIsTyping(false);
            const errorResponse = {
                text: 'An error occurred while fetching data.',
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, errorResponse));
        }
    }

    async function handleGiveFeedbackFour(chosenRating) {
        const semKey = reverseSemesterMapping[giveFeedbackFlowSelectedSemester];
        setIsTyping(true);
        try {
            const folderName = semKey;
            const moduleCode = giveFeedbackFlowSelectedModule;
            const review = chosenRating;
            await publicAxios.authAxios.put('/updatemodulereview', {
                email,
                folderName,
                moduleCode,
                review
            });
            setIsTyping(false);
            const newResponse = {
                text: predefinedMessages.giveFeedbackMessageFour.replace('{rating}', review).replace('{moduleCode}', moduleCode),
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setGiveFeedbackFlowSelectedRating(review);
            await SecureStore.setItemAsync('flowstate', 'give_feedback_four');
            setMessages(previousMessages => GiftedChat.append(previousMessages, newResponse));
        } catch (error) {
            setIsTyping(false);
            const errorResponse = {
                text: 'An error occurred while updating the module review.',
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, errorResponse));
        }
    }

    async function handleViewFeedbacks() {
        setIsTyping(true);
        try {
            const apiResponse = await publicAxios.authAxios.get('/folderswithmodsreviewed', {
                params: { email: email }
            });
            setIsTyping(false);
            const data = apiResponse.data;
            const mappedSemesters = data.foldersWithModsReviewed.map(sem => semesterMapping[sem]);
            const response = { ...predefinedMessages.viewFeedbackMessageOne, _id: Date.now() + Math.random() };
            setSemsWModsReviewed(mappedSemesters);
            await SecureStore.setItemAsync('flowstate', 'view_feedbacks');
            setMessages(previousMessages => GiftedChat.append(previousMessages, response));
        } catch (error) {
            setIsTyping(false);
            const errorResponse = {
                text: 'An error occurred while fetching data.',
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, errorResponse));
        }
    }

    async function handleViewFeedbacksTwo(chosenSem) {
        const semKey = reverseSemesterMapping[chosenSem];
        setIsTyping(true);
        try {
            const apiResponse = await publicAxios.authAxios.get('/modsinspecificfolderwithreviews', {
                params: { email: email, folderName: semKey }
            });
            setIsTyping(false);
            const data = apiResponse.data;
            const newResponse = {
                text: predefinedMessages.viewFeedbackMessageTwo.replace('{chosenSem}', chosenSem),
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setViewFeedbacksFlowSelectedSemester(chosenSem);
            setModsInSpecificFolderWReview(data.modsInSpecificFolderWithReviews);
            await SecureStore.setItemAsync('flowstate', 'view_feedbacks_two');
            setMessages(previousMessages => GiftedChat.append(previousMessages, newResponse));
        } catch (error) {
            setIsTyping(false);
            const errorResponse = {
                text: 'An error occurred while fetching data.',
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, errorResponse));
        }
    }

    async function handleViewFeedbacksThree(chosenMod) {
        const semKey = reverseSemesterMapping[viewFeedbacksFlowSelectedSemester];
        setIsTyping(true);
        try {
            const apiResponse = await publicAxios.authAxios.get('/modulereview', {
                params: { email: email, folderName: semKey, moduleCode: chosenMod }
            });
            setIsTyping(false);
            const data = apiResponse.data;
            const newResponse = {
                text: predefinedMessages.viewFeedbackMessageThree.replace('{chosenMod}', chosenMod).replace('{currentRating}', data.review),
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setViewFeedbacksFlowSelectedModule(chosenMod);
            setViewFeedbacksFlowCurrentRating(data.review);
            await SecureStore.setItemAsync('flowstate', 'view_feedbacks_three');
            setMessages(previousMessages => GiftedChat.append(previousMessages, newResponse));
        } catch (error) {
            console.log(error);
            setIsTyping(false);
            const errorResponse = {
                text: 'An error occurred while fetching data.',
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, errorResponse));
        }
    }

    async function handleViewFeedbacksFour(chosenRating) {
        const semKey = reverseSemesterMapping[viewFeedbacksFlowSelectedSemester];
        setIsTyping(true);
        try {
            const folderName = semKey;
            const moduleCode = viewFeedbacksFlowSelectedModule;
            const review = chosenRating;
            await publicAxios.authAxios.put('/updatemodulereview', {
                email,
                folderName,
                moduleCode,
                review
            });
            setIsTyping(false);
            const newResponse = {
                text: predefinedMessages.viewFeedbackMessageFour.replace('{rating}', review).replace('{moduleCode}', moduleCode),
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setViewFeedbacksFlowSelectedRating(review);
            await SecureStore.setItemAsync('flowstate', 'view_feedbacks_four');
            setMessages(previousMessages => GiftedChat.append(previousMessages, newResponse));
        } catch (error) {
            setIsTyping(false);
            const errorResponse = {
                text: 'An error occurred while updating the module review.',
                user: BOT,
                _id: Date.now() + Math.random()
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, errorResponse));
        }
    }

    async function handleUserMessage(text) {
        let response;
        const currentFlowState = await SecureStore.getItemAsync('flowstate');

        // On initialise
        if (currentFlowState === null) {
            if (text.toLowerCase() === "give feedback") {
                handleGiveFeedback();
                return;
            } else if (text.toLowerCase() === "recommend modules") {
                handleRecommendModules();
                return;
            } else if (text.toLowerCase() === "view/edit feedbacks") {
                handleViewFeedbacks();
                return;
            } else if (text.toLowerCase() === "help") {
                response = { ...predefinedMessages.welcome, _id: Date.now() + Math.random() };
                setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                return;
            } else {
                response = { ...predefinedMessages.notSure, _id: Date.now() + Math.random() };
                setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                return;
            }
        } else {
            if (currentFlowState === "give_feedback") {
                if (semsWoModsReviewed.includes(text.toUpperCase())) {
                    handleGiveFeedbackTwo(text.toUpperCase());
                    return;
                } else {
                    handleGiveFeedback();
                    return;
                }
            } else if (currentFlowState === "give_feedback_two") {
                if (modsInSpecificFolderWoReview.includes(text.toUpperCase())) {
                    handleGiveFeedbackThree(text.toUpperCase());
                    return;
                } else if (semsWoModsReviewed.includes(text.toUpperCase())) {
                    handleGiveFeedbackTwo(text.toUpperCase());
                    return;
                } else {
                    response = { ...predefinedMessages.notSure, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                }
            } else if (currentFlowState === "give_feedback_three") {
                if (text === "1" || text === "2" || text === "3" || text === "4" || text === "5") {
                    handleGiveFeedbackFour(text);
                    return;
                } else if (modsInSpecificFolderWoReview.includes(text.toUpperCase())) {
                    handleGiveFeedbackThree(text.toUpperCase());
                    return;
                } else {
                    response = { ...predefinedMessages.notSure, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                }
            } else if (currentFlowState === "give_feedback_four") {
                if (text.toLowerCase() === "yes") {
                    handleGiveFeedback();
                    return;
                } else if (text.toLowerCase() === "no") {
                    await SecureStore.deleteItemAsync('flowstate');
                    response = { ...predefinedMessages.welcome, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                } else {
                    response = { ...predefinedMessages.notSure, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                }
            } else if (currentFlowState === "recommend_modules") {
                if (text.toLowerCase() === "my completed modules") {
                    handleRecommendModulesOneA();
                    return;
                } else if (text.toLowerCase() === "a specific module") {
                    handleRecommendModulesOneB();
                    return;
                } else {
                    response = { ...predefinedMessages.notSure, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                }
            } else if (currentFlowState === "recommend_modules_one_a") {
                if (text.toLowerCase() === "again") {
                    handleRecommendModulesOneA();
                    return;
                } else if (text.toLowerCase() === "done") {
                    await SecureStore.deleteItemAsync('flowstate');
                    response = { ...predefinedMessages.welcome, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                } else {
                    response = { ...predefinedMessages.notSure, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                }
            } else if (currentFlowState === "recommend_modules_one_b") {
                if (NUSModsData.find(module => module.moduleCode.toLowerCase() === text.toLowerCase())) {
                    handleRecommendModulesTwoB(text.toUpperCase());
                } else if (!NUSModsData.find(module => module.moduleCode.toLowerCase() === text.toLowerCase())) {
                    response = { ...predefinedMessages.notSureModule, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                } else {
                    response = { ...predefinedMessages.notSure, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                }
            } else if (currentFlowState === "recommend_modules_two_b") {
                if (text.toLowerCase() === "again") {
                    handleRecommendModulesTwoB(recommendModulesFlowSelectedModule);
                    return;
                } else if (text.toLowerCase() === "done") {
                    await SecureStore.deleteItemAsync('flowstate');
                    response = { ...predefinedMessages.welcome, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                } else {
                    response = { ...predefinedMessages.notSure, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                }
            } else if (currentFlowState === "view_feedbacks") {
                if (semsWModsReviewed.includes(text.toUpperCase())) {
                    handleViewFeedbacksTwo(text.toUpperCase());
                    return;
                } else {
                    handleViewFeedbacks();
                    return;
                }
            } else if (currentFlowState === "view_feedbacks_two") {
                if (modsInSpecificFolderWReview.includes(text.toUpperCase())) {
                    handleViewFeedbacksThree(text.toUpperCase());
                    return;
                } else if (semsWModsReviewed.includes(text.toUpperCase())) {
                    handleViewFeedbacksTwo(text.toUpperCase());
                    return;
                } else if (text.toLowerCase() === "done") {
                    await SecureStore.deleteItemAsync('flowstate');
                    response = { ...predefinedMessages.welcome, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                } else {
                    response = { ...predefinedMessages.notSure, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                }
            } else if (currentFlowState === "view_feedbacks_three") {
                if (text === "1" || text === "2" || text === "3" || text === "4" || text === "5") {
                    handleViewFeedbacksFour(text);
                    return;
                } else if (modsInSpecificFolderWReview.includes(text.toUpperCase())) {
                    handleViewFeedbacksThree(text.toUpperCase());
                    return;
                } else {
                    response = { ...predefinedMessages.notSure, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                }
            } else if (currentFlowState === "view_feedbacks_four") {
                if (text.toLowerCase() === "yes") {
                    handleViewFeedbacks();
                    return;
                } else if (text.toLowerCase() === "no") {
                    await SecureStore.deleteItemAsync('flowstate');
                    response = { ...predefinedMessages.welcome, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                } else {
                    response = { ...predefinedMessages.notSure, _id: Date.now() + Math.random() };
                    setMessages(previousMessages => GiftedChat.append(previousMessages, response));
                    return;
                }
            }
        }
    }

    async function handleRecommendModules() {
        setIsTyping(true);
        try {
            await SecureStore.setItemAsync('flowstate', 'recommend_modules');
            setTimeout(() => {
                setIsTyping(false);
                const newResponse = { ...predefinedMessages.recommendModulesMessageOne, _id: Date.now() + Math.random() };
                setMessages(previousMessages => GiftedChat.append(previousMessages, newResponse));
            }, 1000);
        } catch (error) {
            console.error('Error in handleRecommendModules:', error);
        }
    }

    function handleSend(newMessage = []) {
        setMessages(GiftedChat.append(messages, newMessage));
        handleUserMessage(newMessage[0].text);
    }

    function renderBubble(props) {
        return (
            <View>
                <Bubble
                    {...props}
                    wrapperStyle={{
                        right: {
                            backgroundColor: '#6646ee'
                        },
                        left: {
                            backgroundColor: '#f0f0f0'
                        }
                    }}
                    textStyle={{
                        right: {
                            color: '#fff'
                        },
                        left: {
                            color: '#000'
                        }
                    }}
                />
                {props.currentMessage.text === predefinedMessages.welcome.text && (
                    <View>
                        <GetStartedButtons text="View/Edit feedbacks" onButtonPress={() => handleButtonPress("View/Edit feedbacks")} />
                        <GetStartedButtons text="Give feedback" onButtonPress={() => handleButtonPress("Give feedback")} />
                        <GetStartedButtons text="Recommend modules" onButtonPress={() => handleButtonPress("Recommend modules")} />
                    </View>
                )}

                {props.currentMessage.text === predefinedMessages.giveFeedbackMessageOne.text && (
                    semsWoModsReviewed.map((sem, index) => {
                        return <View key={index}><GetStartedButtons text={sem} onButtonPress={() => handleButtonPress(sem)} /></View>
                    })
                )}

                {props.currentMessage.text === predefinedMessages.giveFeedbackMessageTwo.replace('{chosenSem}', giveFeedbackFlowSelectedSemester) && (
                    modsInSpecificFolderWoReview.map((mods, index) => {
                        return <View key={index}><GetStartedButtons text={mods} onButtonPress={() => handleButtonPress(mods)} /></View>
                    })
                )}

                {props.currentMessage.text === predefinedMessages.giveFeedbackMessageThree.replace('{chosenMod}', giveFeedbackFlowSelectedModule) && (
                    <View>
                        <GetStartedButtons textCenter={true} text={"⭐\n Disappointing. Unengaging content, unclear instructions, and high workload. Not beneficial."} onButtonPress={() => handleButtonPress("1")} />
                        <GetStartedButtons textCenter={true} text={"⭐⭐\nSomewhat disappointing. Occasionally interesting but poorly delivered. Heavy workload."} onButtonPress={() => handleButtonPress("2")} />
                        <GetStartedButtons textCenter={true} text={"⭐⭐⭐\nAverage. Relevant content but not very engaging. Manageable workload."} onButtonPress={() => handleButtonPress("3")} />
                        <GetStartedButtons textCenter={true} text={"⭐⭐⭐⭐\nGood. Interesting and well-organized content. Appropriate workload."} onButtonPress={() => handleButtonPress("4")} />
                        <GetStartedButtons textCenter={true} text={"⭐⭐⭐⭐⭐\nExcellent. Engaging, clear, and highly relevant content. Balanced workload and highly beneficial."} onButtonPress={() => handleButtonPress("5")} />
                    </View>
                )}

                {props.currentMessage.text === predefinedMessages.giveFeedbackMessageFour.replace('{rating}', giveFeedbackFlowSelectedRating).replace('{moduleCode}', giveFeedbackFlowSelectedModule) && (
                    <View>
                        <GetStartedButtons textCenter={true} text={"Yes"} onButtonPress={() => handleButtonPress("Yes")} />
                        <GetStartedButtons textCenter={true} text={"No"} onButtonPress={() => handleButtonPress("No")} />
                    </View>
                )}

                {props.currentMessage.text === predefinedMessages.recommendModulesMessageOne.text && (
                    <View>
                        <GetStartedButtons text="My completed modules" onButtonPress={() => handleButtonPress("My completed modules")} />
                        <GetStartedButtons text="A specific module" onButtonPress={() => handleButtonPress("A specific module")} />
                    </View>
                )}

                {props.currentMessage.text === predefinedMessages.recommendModulesMessageTwoA.text && (
                    recommendedModulesBasedOnSemesters.map((mod, index) => {
                        return <View key={index}><GetStartedButtons text={mod.moduleCode} onButtonPress={() => handleModuleDetails(mod.moduleCode)} /></View>
                    })
                )}

                {props.currentMessage.text === predefinedMessages.recommendModulesMessageThreeB.text && (
                    recommendedModulesBasedOnModule.map((mod, index) => {
                        return <View key={index}><GetStartedButtons text={mod.moduleCode} onButtonPress={() => handleModuleDetails(mod.moduleCode)} /></View>
                    })
                )}

                {props.currentMessage.text === predefinedMessages.viewFeedbackMessageOne.text && (
                    semsWModsReviewed.map((sem, index) => {
                        return <View key={index}><GetStartedButtons text={sem} onButtonPress={() => handleButtonPress(sem)} /></View>
                    })
                )}

                {props.currentMessage.text === predefinedMessages.viewFeedbackMessageTwo.replace('{chosenSem}', viewFeedbacksFlowSelectedSemester) && (
                    modsInSpecificFolderWReview.map((mods, index) => {
                        return <View key={index}><GetStartedButtons text={mods} onButtonPress={() => handleButtonPress(mods)} /></View>
                    })
                )}

                {props.currentMessage.text === predefinedMessages.viewFeedbackMessageThree.replace('{chosenMod}', viewFeedbacksFlowSelectedModule).replace('{currentRating}', viewFeedbacksFlowCurrentRating) && (
                    <View>
                        <GetStartedButtons textCenter={true} text={"⭐\n Disappointing. Unengaging content, unclear instructions, and high workload. Not beneficial."} onButtonPress={() => handleButtonPress("1")} />
                        <GetStartedButtons textCenter={true} text={"⭐⭐\nSomewhat disappointing. Occasionally interesting but poorly delivered. Heavy workload."} onButtonPress={() => handleButtonPress("2")} />
                        <GetStartedButtons textCenter={true} text={"⭐⭐⭐\nAverage. Relevant content but not very engaging. Manageable workload."} onButtonPress={() => handleButtonPress("3")} />
                        <GetStartedButtons textCenter={true} text={"⭐⭐⭐⭐\nGood. Interesting and well-organized content. Appropriate workload."} onButtonPress={() => handleButtonPress("4")} />
                        <GetStartedButtons textCenter={true} text={"⭐⭐⭐⭐⭐\nExcellent. Engaging, clear, and highly relevant content. Balanced workload and highly beneficial."} onButtonPress={() => handleButtonPress("5")} />
                    </View>
                )}

                {props.currentMessage.text === predefinedMessages.viewFeedbackMessageFour.replace('{rating}', viewFeedbacksFlowSelectedRating).replace('{moduleCode}', viewFeedbacksFlowSelectedModule) && (
                    <View>
                        <GetStartedButtons textCenter={true} text={"Yes"} onButtonPress={() => handleButtonPress("Yes")} />
                        <GetStartedButtons textCenter={true} text={"No"} onButtonPress={() => handleButtonPress("No")} />
                    </View>
                )}
            </View>
        );
    }

    function renderSend(props) {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <MaterialCommunityIcons name="send-circle" size={40} color={theme.hamburgerColor} />
                </View>
            </Send>
        );
    }

    function scrollToBottomComponent() {
        return (
            <View style={styles.bottomComponentContainer}>
                <AntDesign name="circledown" size={32} color={theme.hamburgerColor} />
            </View>
        );
    }

    async function handleButtonPress(buttonText) {
        const newMessage = {
            _id: Date.now() + Math.random(),
            text: buttonText,
            createdAt: new Date().getTime(),
            user: {
                _id: email,
                name: nickname,
            }
        };
        handleSend([newMessage]);
    }

    async function handleModuleDetails(moduleCode) {
        navigation.navigate('ModuleDetailsScreen', { headerName: "Module details", moduleCode : moduleCode })
    }

    return (
        <View style={styles.container}>
            <DrawerHeader headerName={headerName} />

            <GiftedChat
                messages={messages}
                onSend={newMessage => handleSend(newMessage)}
                user={{ _id: email, name: nickname }}
                renderBubble={renderBubble}
                placeholder='Message'
                alwaysShowSend
                renderSend={renderSend}
                scrollToBottom
                scrollToBottomComponent={scrollToBottomComponent}
                isTyping={isTyping}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
