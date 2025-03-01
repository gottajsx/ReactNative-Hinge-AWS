import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from "react-native";

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