import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Pressable,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../urls/url';
import LottieView from 'lottie-react-native';
import UserChat from '../components/UserChat';
  
const ChatScreen = () => {
    const [matches, setMatches] = useState([]);
    const {userId, setUserId} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
  
    const fetchMatches = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/get-matches/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
  
        setMatches(response.data.matches);
        } catch (error) {
            console.log('Error', error);
        } finally {
            setIsLoading(false);
        }
    };
  
    useEffect(() => {
        if (userId) {
            fetchMatches();
        }
    }, [userId]);
  
    const [categorizedChats, setCategorizedChats] = useState({
        yourTurn: [],
        theirTurn: [],
    });
  
    const fetchAndCategorizeChats = async () => {
        const yourTurn = [];
        const theirTurn = [];
  
        await Promise.all(
            matches?.map(async item => {
                try {
                    const response = await axios.get(`${BASE_URL}/messages`, {
                        params: {senderId: userId, receiverId: item?.userId},
                    });
  
                    const messages = response.data;
                    const lastMessage = messages[messages.length - 1];
  
                    if (lastMessage?.senderId == userId) {
                        theirTurn.push({...item, lastMessage});
                    } else {
                        yourTurn.push({...item, lastMessage});
                    }
                } catch (error) {
                    console.log('Error fetching', error);
                }
            }),
        );
        setCategorizedChats({yourTurn, theirTurn});
    };
  
    useEffect(() => {
        fetchAndCategorizeChats();
    }, [matches]);
  
    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F8F8F8',
            }}>
                <LottieView
                    source={require('../assets/loading2.json')}
                    style={{
                        height: 180,
                        width: 300,
                        alignSelf: 'center',
                        marginTop: 40,
                        justifyContent: 'center',
                    }}
                    autoPlay
                    loop={true}
                    speed={0.7}
                />
            </View>
      );
    }
  
    console.log('Matches', matches);
  
    return (
        <ScrollView
            style={{marginTop: 55}}
            contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: 'white',
            justifyContent: matches?.length > 0 ? 'flex-start' : 'center',
        }}>
            <View>
                <View style={{marginVertical: 12, marginHorizontal: 15}}>
                    {matches?.length > 0 ? (
                        <>
                            <Text
                                style={{fontSize: 22, fontWeight: 'bold', marginVertical: 12
                            }}>
                                Matches
                            </Text>
    
                            {categorizedChats?.theirTurn.length > 0 && (
                                <>
                                    <Text
                                        style={{
                                            fontSize: 22,
                                            fontWeight: 'bold',
                                            marginVertical: 12,
                                    }}>
                                        Their Turn
                                    </Text>
                                    {categorizedChats?.theirTurn.map((item, index) => (
                                        <UserChat key={index} item={item} userId={userId} />
                                     ))}
                                </>
                            )}
    
                            {categorizedChats.yourTurn.length > 0 && (
                                <>
                                    <Text
                                        style={{
                                            fontSize: 22,
                                            fontWeight: 'bold',
                                            marginVertical: 12,
                                    }}>
                                        Your Turn
                                    </Text>
                                    {categorizedChats.yourTurn.map((item, index) => (
                                        <UserChat key={index} userId={userId} item={item} />
                                    ))}
                                </>
                            )}
    
                            {/* {matches?.map((item, index) => (
                                <UserChat key={index} item={item} userId={userId} />
                            ))} */}
                        </>
                    ) : (
                            <View
                                style={{flex: 1, justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <Image
                                        style={{width: 100, height: 100}}
                                        source={{
                                            uri: 'https://cdn-icons-png.flaticon.com/128/5065/5065340.png',
                                        }}
                                    />
    
                                    <View style={{marginTop: 50}}>
                                        <Text
                                            style={{
                                                fontSize: 22,
                                                fontWeight: 'bold',
                                                textAlign: 'center',
                                        }}>
                                            No Matches right now
                                        </Text>
                                        <Text
                                            style={{
                                                color: 'gray',
                                                marginTop: 10,
                                                fontSize: 15,
                                                textAlign: 'center',
                                        }}>
                                            Matches are more considered on hinge. We can help improve your
                                            chances
                                        </Text>
                                    </View>
    
                                    <View style={{marginTop: 50}} />
    
                                        <Pressable
                                            style={{
                                                padding: 12,
                                                borderRadius: 22,
                                                backgroundColor: '#0a7064',
                                                width: 250,
                                        }}>
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: '500',
                                                    fontSize: 15,
                                                    color: 'white',
                                            }}>
                                                Boost Your Profile
                                            </Text>
                                        </Pressable>
    
                                        <Pressable
                                            style={{
                                                padding: 12,
                                                borderRadius: 22,
                            
                                                borderColor: '#E0E0E0',
                                                borderWidth: 1,
                                                marginTop: 15,
                                                width: 250,
                                        }}>
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: '500',
                                                    fontSize: 15,
                                            }}>
                                                Upgrage to HingeX
                                            </Text>
                                        </Pressable>
                                    </View>
                        )}
                </View>
            </View>
        </ScrollView>
    );
  };
  
export default ChatScreen;
  
const styles = StyleSheet.create({});