import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import LikesScreen from '../screens/LikesScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import BasicInfo from '../screens/BasicInfo';
import NameScreen from '../screens/NameScreen';
import EmailScreen from '../screens/EmailScreen';
import OtpScreen from '../screens/OtpScreen';
import PasswordScreen from '../screens/PasswordScreen';
import DateOfBirthScreen from '../screens/DateOfBirthScreen';
import LocationScreen from '../screens/LocationScreen';
import GenderScreen from '../screens/GenderScreen';
import TypeScreen from '../screens/TypeScreen';
import DatingType from '../screens/DatingType';
import LookingForScreen from '../screens/LookingFor';
import HomeTownScreen from '../screens/HomeTownScreen';
import WorkPlace from '../screens/WorkPlace';
import JobTitleScreen from '../screens/JobTitleScreen';
import PhotoScreen from '../screens/PhotoScreen';
import PromptsScreen from '../screens/PromptsScreen';
import ShowPromptsScreen from '../screens/ShowPromptsScreen';
import PreFinalScreen from '../screens/PreFinalScreen';
import WritePrompt from '../screens/WritePrompt';
import SendLikeScreen from '../screens/SendLikeScreen';
import HandleLikeScreen from '../screens/HandleLikeScreen';
import ChatRoom from '../screens/ChatRoom';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ProfileDetailScreen from '../screens/ProfileDetailScreen';


const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    const BottomTabs = () => {
        return(
            <Tab.Navigator
                screenOptions = {() => ({
                    tabBarShowLabel: false,
                    tabBarStyle: {height: 90},
            })}>
                <Tab.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{
                        tabBarStyle: {backgroundColor: '#101010'},
                        headerShown: false,
                        tabBarIcon: ({ focused }) =>
                            focused ? (
                                <Ionicons
                                    style={{ paddingTop: 3 }}
                                    name="shuffle-outline"
                                    size={30}
                                    color="white"
                                />
                            ) : (
                                <Ionicons
                                    style={{ paddingTop: 3 }}
                                    name="shuffle-outline"
                                    size={30}
                                    color="#989898"
                                />
                            ),
                    }}
                />

                <Tab.Screen 
                    name="Likes" 
                    component={LikesScreen}
                    options={{
                        tabBarStyle: {backgroundColor: '#101010'},
                        headerShown: false,
                        tabBarIcon: ({ focused }) =>
                            focused ? (
                                <Entypo
                                    style={{ paddingTop: 3 }}
                                    name="heart"
                                    size={30}
                                    color="white"
                                />
                            ) : (
                                <Entypo
                                    style={{ paddingTop: 3 }}
                                    name="heart"
                                    size={30}
                                    color="#989898"
                                />
                            ),
                    }}
                />

                <Tab.Screen 
                    name="Chat" 
                    component={ChatScreen}
                    options={{
                        tabBarStyle: {backgroundColor: '#101010'},
                        headerShown: false,
                        tabBarIcon: ({ focused }) =>
                            focused ? (
                                <MaterialIcons
                                    style={{ paddingTop: 3 }}
                                    name="chat-bubble-outline"
                                    size={30}
                                    color="white"
                                />
                            ) : (
                                <MaterialIcons
                                    style={{ paddingTop: 3 }}
                                    name="chat-bubble-outline"
                                    size={30}
                                    color="#989898"
                                />
                            ),
                    }}
                />

                <Tab.Screen 
                    name="Profile" 
                    component={ProfileScreen}
                    options={{
                        tabBarStyle: {backgroundColor: '#101010'},
                        headerShown: false,
                        tabBarIcon: ({ focused }) =>
                            focused ? (
                                <Ionicons
                                    style={{ paddingTop: 3 }}
                                    name="person-circle-outline"
                                    size={28}
                                    color="white"
                                />
                            ) : (
                                <Ionicons
                                    style={{ paddingTop: 3 }}
                                    name="person-circle-outline"
                                    size={28}
                                    color="#989898"
                                />
                            ),
                    }}
                />

            </Tab.Navigator>
        );
    }

    const AuthStack = () => {
        return(
            <Text>AuthStack</Text>
        );
    };

    const MainStack = () => {
        return(
            <Stack.Navigator>
                <Stack.Screen
                    name="Main"
                    component={BottomTabs}
                />
            </Stack.Navigator>
        );
    };

    return (
        <NavigationContainer>
            <MainStack />
        </NavigationContainer>
    );

};

export default StackNavigator;