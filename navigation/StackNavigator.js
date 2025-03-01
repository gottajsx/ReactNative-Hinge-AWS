import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import { Text } from "react-native";

const StackNavigator = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    const BottomTabs = () => {
        return(
            <Tab.Navigator>
                <Tab.Screen 
                    name="Home" 
                    component={HomeScreen}
                />
            </Tab.Navigator>
        );
    };

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