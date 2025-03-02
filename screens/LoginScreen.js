import {
    StyleSheet, 
    Text,
    View,
    SafeAreaView,
    Image,
    KeyboardAvoidingView,
    TextInput,
    Pressable 
} from "react-native";
import React, { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
    const [option, setOption] = useState('Sign In');
    const navigation = useNavigation();
    const [word, setWord] = useState('');
    const [password, setPassword] = useState('');

    const createAccount = () => {
        setOption('Create account')
        navigation.navigate('Basic')
    }

    const handleLogin = () => {
        setOption('Sign In');

        if (!word || !password) {
            return;
        }

        const user = {
            email: word,
            password: password
        };
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{height: 200, backgroundColor: '#581845', width: '100%'}}>
                <View
                    style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 25,
                }}>
                    <Image 
                        style={{width: 150, height: 80, resizeMode: 'contain'}}
                        source={{
                            uri: 'https://cdn-icons-png.flaticon.com/128/4207/4207268.png',
                        }}
                    />
                </View>
                <Text
                    style={{
                        marginTop: 20,
                        textAlign: 'center',
                        fontSize: 24,
                        fontFamily: 'GeezaPro-bold',
                        color: 'white',
                }}>
                    Hinge
                </Text>

                <KeyboardAvoidingView>
                    <View style={{alignItems: 'center'}}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 40,
                                color: '#581845',
                        }}>
                            Designed to be deleted
                        </Text>
                    </View>

                    { option == 'Sign In' && (
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 20,
                        }}>
                            <Image 
                                style={{width: 150, height: 80, resizeMode: 'contain'}}
                                source={{
                                    uri: 'https://cdn-icons-png.flaticon.com/128/6809/6809493.png',
                                }}
                            />
                        </View>
                    )}

                    <View style={{marginHorizontal: 20, marginTop: 20}}>
                        { option == 'Sign In'} ? (
                            <>
                                <View>
                                    <View style={{marginTop: 14}}>
                                        <View
                                            style={{
                                                padding: 14,
                                                backgroundColor: 'white',
                                                borderRadius: 8,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 15,
                                                borderColor: '#E0E0E0',
                                                borderWidth: 0.6,
                                        }}>
                                            <Text style={{fontSize: 14, color: '#800080', width: 70}}>
                                                Email
                                            </Text>
                                            <TextInput
                                                value={word}
                                                onChangeText={text => setWord(text)}
                                                laceholder="User@example.com"
                                                placeholderTextColor={'gray'}
                                            />
                                        </View>
                                    </View>

                                    
                                </View>
                            </>
                        ) : (
                            <View>

                            </View>
                        )
                    </View>
                </KeyboardAvoidingView>

            </View>
        </SafeAreaView>
    );
}

export default LoginScreen;