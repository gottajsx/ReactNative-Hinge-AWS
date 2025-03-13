import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import { useSocketContext } from '../SocketContext';
import axios from 'axios';
import { BASE_URL } from '../urls/url';

const UserChat = ({item, userId}) => {
    const [lastMessage, setLastMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const {socket} = useSocketContext();

    useEffect(() => {
        fetchMessages();
    }, []);
  
    const fetchMessages = async () => {
        try {
            const senderId = userId;
            const receiverId = item?.userId;

            const response = await axios.get(`${BASE_URL}/messages`, {
                params: {senderId, receiverId},
            });

            setMessages(response.data);
            setLastMessage(response.data[response.data.length - 1]);
        } catch (error) {
            console.log('Error', error);
        }
    };

    console.log("last",lastMessage);

    return (
        <Pressable
            onPress={() =>
                navigation.navigate('ChatRoom', {
                image: item?.imageUrls[0],
                name: item?.firstName,
                receiverId: item?.userId,
                senderId: userId,
                })
            }
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginVertical: 12,
        }}>
            <View>
                <Image
                    style={{width: 70, height: 70, borderRadius: 35}}
                    source={{uri: item?.imageUrls[0]
                }}/>
            </View>

            <View>
                <Text
                    style={{
                        fontWeight: '500',
                        fontSize: 16,
                        fontFamily: 'GeezaPro-Bold',
                }}>
                    {item?.firstName}
                </Text>

                <Text style={{fontWeight: '500', fontSize: 15, marginTop: 6}}>
                    {lastMessage
                        ? lastMessage?.message
                        : `Start Chat with ${item?.firstName}`}
                </Text>
            </View>
        </Pressable>
    );
};

export default UserChat;

const styles = StyleSheet.create({});