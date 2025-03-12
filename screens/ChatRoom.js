import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import React, {useState, useContext, useEffect, useLayoutEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import {BASE_URL} from '../urls/url';
import {useSocketContext} from '../SocketContext';
  
const ChatRoom = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [message, setMessage] = useState('');
    const {userId} = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const {socket} = useSocketContext();
    
    useLayoutEffect(() => {
        return navigation.setOptions({
            headerTitle: '',
            headerLeft: () => (
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                        {route?.params?.name}
                    </Text>
                </View>
            ),
            headerRight: () => (
                <Ionicons name="videocam-outline" size={24} color="black" />
            ),
        });
    }, []);

    const sendMessage = async (senderId, receiverId) => {
        try {
            setMessage('');
  
            await axios.post(`${BASE_URL}/sendMessage`, {
                senderId,
                receiverId,
                message,
            });
  
            socket.emit('sendMessage', {senderId, receiverId, message});
  
            setTimeout(() => {
                fetchMessages();
            }, 100);
        } catch (error) {
            console.log('Error', error);
        }
    };
    
    useEffect(() => {
        fetchMessages();
    }, []);
    
    const fetchMessages = async () => {
        try {
            const senderId = userId;
            const receiverId = route?.params?.receiverId;
  
            const response = await axios.get(`${BASE_URL}/messages`, {
                params: {senderId, receiverId},
            });
  
            setMessages(response.data);
        } catch (error) {
            console.log('Error', error);
        }
    };
  
    const listenMessages = () => {
        const {socket} = useSocketContext();
  
        useEffect(() => {
            socket?.on('newMessage', newMessage => {
                newMessage.shouldShake = true;
                setMessages([...messages, newMessage]);
            });
        }, [socket, messages, setMessages]);
    };
  
    listenMessages();
    const keyboardVerticalOffset = Platform.OS == 'ios' ? 65 : 0;
    console.log('Messages', messages);
    
    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={{flex: 1, backgroundColor: 'white'}}>
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                    {messages?.map((item, index) => {
                        return (
                            <Pressable
                                style={[
                                    item?.senderId == userId
                                    ? {
                                        alignSelf: 'flex-end',
                                        backgroundColor: '#5b0d63',
                                        padding: 10,
                                        maxWidth: '60%',
                                        borderRadius: 7,
                                            margin: 10,
                                    }: {
                                            alignSelf: 'flex-start',
                                            backgroundColor: '#e1e3e3',
                                            padding: 10,
                                            maxWidth: '60%',
                                            borderRadius: 7,
                                                margin: 10,
                                    },
                                ]}
                                key={index}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        textAlign: 'left',
                                        letterSpacing: 0.3,
                                        color: item?.senderId == userId ? 'white' : 'black',
                                }}>
                                    {item?.message}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
  
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        borderTopWidth: 1,
                        borderTopColor: '#dddddd',
                        marginBottom: 30,
                        gap: 12,
                }}>
                    <TextInput
                        value={message}
                        onChangeText={text => setMessage(text)}
                        placeholderTextColor="gray"
                        placeholder="Type your message..."
                        style={{
                            flex: 1,
                            borderColor: '#dddddd',
                            borderWidth: 1,
                            borderRadius: 20,
                            paddingHorizontal: 10,
                            height: 40,
                            fontSize: 15,
                        }}
                    />
                    <Pressable
                        onPress={() => sendMessage(userId, route?.params?.receiverId)}
                        style={{
                            backgroundColor: '#662d91',
                            paddingVertical: 8,
                            borderRadius: 20,
                            paddingHorizontal: 12,
                    }}>
                        <Text style={{textAlign: 'center', color: 'white'}}>Send</Text>
                    </Pressable>
                </View>
        </KeyboardAvoidingView>
    );
};
  
export default ChatRoom;
  
const styles = StyleSheet.create({});