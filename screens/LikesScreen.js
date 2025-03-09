import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    Pressable,
    FlatList,
    Dimensions,
} from 'react-native';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {
    useFocusEffect,
    useNavigation,
    useRoute,
} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../urls/url';
import LottieView from 'lottie-react-native';

const LikesScreen = () => {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const {userId} = useContext(AuthContext);
    const [likes, setLikes] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    useFocusEffect(
        useCallback(() => {
            if (userId) {
                fetchReceivedLikes();
            }
        }, [userId]),
    );
    const fetchReceivedLikes = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/received-likes/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const receivedLikes = response.data.receivedLikes;

            setLikes(receivedLikes);
        } catch (error) {
            console.log('Error', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchReceivedLikes();
        }
    }, [userId]);

    const getUserDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user-info`, {
                params: {userId},
            });

            if (response.status === 200) {
                const userData = response.data.user;

                if (JSON.stringify(userData) !== JSON.stringify(userInfo)) {
                    setUserInfo(userData);
                }
             }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            getUserDetails();
        }
    }, [userId])

    const screenWidth = Dimensions.get('window').width;
    const profileWidth = (screenWidth - 46) / 2;

    const checkActive = () => {
        if (!userInfo) {
        return;
        }
        return (
            userInfo.subscriptions?.some(item => item.status == 'active') || false
        );
    };

    const activeSubscription = checkActive();
  

    const renderProfile = ({item: like}) => (
        <Pressable
            disabled={!activeSubscription}
            style={{
                width: profileWidth,
                marginVertical: 10,
                backgroundColor: 'white',
                borderColor: '#E0E0E0',
                borderWidth: 0.5,
                borderRadius: 8,
        }}>
            <View style={{paddingHorizontal: 10, paddingTop: 10}}>
                {like?.comment ? (
                    <View
                        style={{
                            alignItems: 'flex-start',
                            backgroundColor: '#fae8e0',
                            borderRadius: 5,
                            marginBottom: 8,
                            alignSelf: 'flex-start',
                            maxWidth: profileWidth - 20,
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                    }}>
                        <Text numberOfLines={1} ellipsizeMode="tail">
                            {like?.comment || 'Liked your photo'}
                        </Text>
                    </View>
                ) : (
                        <View
                            style={{
                                alignItems: 'flex-start',

                                paddingVertical: 10,

                                borderRadius: 5,
                                marginBottom: 8,
                                alignSelf: 'flex-start',
                        }}>
                            <Text style={{fontStyle: 'italic'}}>Liked your photo</Text>
                        </View>
                )}

                <Text
                    style={{
                        fontSize: 17,
                        fontWeight: '500',
                        marginBottom: 10,
                }}>
                    {like?.userId?.firstName}
                </Text>
            </View>

            <View style={{}}>
                <Image
                    blurRadius={activeSubscription ? 0 : 20}
                    style={{
                        height: 220,
                        width: profileWidth,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                    }}
                    source={{uri: like?.userId?.imageUrls[0]}}
                />
            </View>
        </Pressable>
    );

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
    console.log('Likes', likes);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    backgroundColor: 'white',
                    justifyContent: likes?.length > 0 ? 'flex-start' : 'center',
                    padding: 15,
            }}>
                {likes?.length > 0 ? (
                    <>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                        }}>
                            <Text
                                style={{
                                    fontSize: 23,
                                    fontWeight: 'bold',
                                    fontFamily: 'GeezaPro-Bold',
                                    marginTop: 15,
                            }}>
                                Likes You
                            </Text>
                            <Pressable
                                style={{
                                    backgroundColor: '#008B8B',
                                    padding: 10,
                                    borderRadius: 30,
                            }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontWeight: 'bold',
                                }}>
                                    Boost
                                </Text>
                            </Pressable>
                        </View>

                        <Pressable
                            style={{
                                marginTop: 13,
                                borderColor: '#E0E0E0',
                                borderWidth: 1,
                                alignSelf: 'flex-start',
                                flexDirection: 'row',
                                gap: 6,
                                alignItems: 'center',
                                paddingVertical: 7,
                                paddingHorizontal: 10,
                                borderRadius: 24,
                        }}>
                            <Text style={{color: '#404040', fontWeight: '500'}}>Recent</Text>
                            <MaterialDesignIcons name="chevron-down" size={22} color="gray" />
                        </Pressable>

                        <View style={{marginTop: 15}}>
                            {likes.length > 0 && (
                                <Pressable
                                    onPress={() =>
                                    navigation.navigate('HandleLike', {
                                        name: likes[0].userId?.firstName,
                                        image: likes[0]?.image,
                                        imageUrls: likes[0]?.userId.imageUrls,
                                        prompts: likes[0]?.userId?.prompts,
                                        userId: userId,
                                        selectedUserId: likes[0].userId?.userId,
                                        likes: likes.length,
                                        type: likes[0].type,
                                        prompt: likes[0]?.prompt,
                                        })
                                    }
                                    style={{
                                        padding: 10,
                                        borderColor: '#E0E0E0',
                                        borderWidth: 2,
                                        borderRadius: 7,
                                }}>
                                    <View>
                                        <View
                                            style={{
                                                alignItems: 'flex-start',
                                                paddingHorizontal: 16,
                                                paddingVertical: 12,
                                                backgroundColor: '#fae8e0',
                                                borderRadius: 5,
                                                marginBottom: 8,
                                                alignSelf: 'flex-start',
                                        }}>
                                            <Text numberOfLines={1}>
                                                {likes[0].comment
                                                ? likes[0].comment
                                                : likes[0].type == 'prompt'
                                                ? 'Liked your prompt'
                                                : likes[0].type == 'image'
                                                ? 'Liked your photo'
                                                : 'Liked your Content'}
                                            </Text>
                                        </View>

                                        <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                                            {likes[0].userId?.firstName}
                                        </Text>
                                        <Image
                                            style={{
                                                width: '100%',
                                                height: 350,
                                                resizeMode: 'cover',
                                                marginTop: 20,
                                                borderRadius: 10,
                                            }}
                                            source={{uri: likes[0]?.userId?.imageUrls[0]}}
                                        />
                                    </View>
                                </Pressable>
                            )}
                        </View>

                        {likes?.length > 1 && (
                            <View>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        fontFamily: 'GeezaPro-bold',
                                        marginTop: 20,
                                }}>
                                    Up Next
                                </Text>
                                <Text style={{marginTop: 4, color: '#282828'}}>
                                    Subscribe to see everyone who likes you
                                </Text>
                            </View>
                        )}

                        <View
                            style={{
                                backgroundColor: '#e0ceed',
                                padding: 12,
                                flexDirection: 'row',
                                borderRadius: 10,
                                gap: 10,
                                marginTop: 20,
                                marginBottom: 5,
                                paddingBottom: 15,
                        }}>
                            <View>
                                <Text style={{fontSize: 18, fontWeight: '600', width: 280}}>
                                    Meet {likes[1]?.userId?.firstName} and {likes?.length - 2}{' '}
                                    others who like you
                                </Text>
                                <Pressable
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 6,
                                        backgroundColor: '#8446b0',
                                        marginTop: 10,
                                        alignSelf: 'flex-start',
                                        borderRadius: 18,
                                }}>
                                    <Text
                                        style={{textAlign: 'center', color: 'white', fontSize: 13}}>
                                        Get Hinge +
                                    </Text>
                                </Pressable>
                            </View>
                            <View style={{position: 'relative'}}>
                                <Image
                                    source={{
                                        uri: 'https://www.instagram.com/p/C27SU9sNMXO/media/?size=l',
                                    }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 10,
                                        position: 'absolute',
                                        top: 0,
                                        left: 20,
                                        transform: [{rotate: '-10deg'}],
                                        zIndex: 2,
                                        borderWidth: 2,
                                        borderColor: 'white',
                                    }}
                                />

                                <Image
                                    source={{
                                        uri: 'https://www.instagram.com/p/C1Rzh7KJ0OY/media/?size=l',
                                }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 10,
                                        position: 'absolute',
                                        top: 40,
                                        left: 0,
                                        transform: [{rotate: '10deg'}],
                                        zIndex: 1,
                                        borderWidth: 2,
                                        borderColor: 'white',
                                    }}
                                />
                            </View>
                        </View>

                        <FlatList
                            data={likes?.slice(1)}
                            renderItem={renderProfile}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                            columnWrapperStyle={{
                                justifyContent: 'space-between',
                            }}
                            contentContainerStyle={{
                                paddingBottom: 20,
                            }}
                        />
                    </>
                ) : (
                        <View
                            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                        >
                            <Image
                                style={{width: 100, height: 100}}
                                source={{
                                    uri: 'https://cdn-icons-png.flaticon.com/128/38/38384.png',
                                }}
                            />

                            <View>
                                <Text
                                    style={{fontSize: 22, fontWeight: 'bold', textAlign: 'center'}}
                                >
                                    You're new, no likes yet
                                </Text>

                                <Text
                                    style={{
                                        color: 'gray',
                                        marginTop: 10,
                                        fontSize: 15,
                                        textAlign: 'center',
                                }}>
                                    We can help you to get your first one sooner
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
                                    backgroundColor: '#0a7064',
                                    borderColor: '#E0E0E0',
                                    borderWidth: 1,
                                    marginTop: 15,
                                    width: 250,
                            }}>
                                <Text
                                    style={{textAlign: 'center', fontWeight: '500', fontSize: 15}}
                                >
                                    Upgrage to HingeX
                                </Text>
                            </Pressable>
                        </View>
                    )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default LikesScreen;

const styles = StyleSheet.create({});