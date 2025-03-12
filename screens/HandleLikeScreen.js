import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    Pressable,
    Alert,
} from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../urls/url';
  
const HandleLikeScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    
    const createMatch = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const currentUserId = route?.params?.userId;
            const selectedUserId = route?.params?.selectedUserId;
  
            const response = await axios.post(
                `${BASE_URL}/create-match`,
                {
                    currentUserId,
                    selectedUserId,
                },
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                },
            );
  
            if (response.status == 200) {
                navigation.goBack();
            }
        } catch (error) {
            console.log('Error', error);
        }
    };

    const match = () => {
        Alert.alert('Accept Request?', `Match with ${route?.params?.name}`, [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {text: 'OK', onPress: () => createMatch()},
        ]);
    };

    return (
         <>
            <ScrollView
                style={{flex: 1, backgroundColor: 'white', marginTop: 55, padding: 12    
            }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                }}>
                    <Text style={{fontSize: 15, fontWeight: '500'}}>
                        All {route?.params?.likes}
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '500'}}>Back</Text>
                </View>
  
                <View style={{marginVertical: 12}}>
                    {route?.params?.type == 'prompt' ? (
                        <View style={{height: 90}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                                {route?.params?.question}
                            </Text>
  
                            <Text style={{fontSize: 16, marginTop: 8}}>
                                {route?.params?.answer}
                            </Text>
                        </View>
                    ) : (
                            <Image
                                style={{
                                    width: '100%',
                                    height: 100,
                                    borderRadius: 7,
                                    resizeMode: 'cover',
                                }}
                                source={{uri: route?.params?.image
                            }}/>
                        )}
                </View>
  
                <View
                    style={{
                        alignSelf: 'flex-start',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        backgroundColor: '#f7f0e1',
                        borderRadius: 5,
                        marginBottom: 8,
                        alignSelf: 'flex-start',
                        bottom: 20,
                }}>
                    {route?.params?.comment ? (
                         <Text></Text>
                    ) : route?.params?.type == 'prompt' ? (
                        <Text>Liked your Prompt</Text>
                    ) : (
                        <Text>Liked Your photo</Text>
                    )}
                </View>
  
                <View style={{marginVertical: 16}}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                    }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10,
                        }}>
                            <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                                {route?.params?.name}
                            </Text>
                            <View
                                style={{
                                    backgroundColor: '#452c63',
                                    paddingHorizontal: 12,
                                    paddingVertical: 4,
                                    borderRadius: 20,
                            }}>
                                <Text style={{textAlign: 'center', color: 'white'}}>
                                    new here
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 15,
                        }}>
                            <Entypo name="dots-three-horizontal" size={22} color="black" />
                        </View>
                    </View>
  
                    <View style={{marginVertical: 15}}>
                        <View>
                            {route?.params?.imageUrls?.length > 0 && (
                                <View>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 410,
                                            resizeMode: 'cover',
                                            borderRadius: 10,
                                        }}
                                        source={{
                                            uri: route?.params?.imageUrls[0],
                                        }}
                                    />
                                    <Pressable
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
                                            backgroundColor: 'white',
                                            width: 42,
                                            height: 42,
                                            borderRadius: 21,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                    }}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                                resizeMode: 'contain',
                                            }}
                                            source={{
                                                uri: 'https://cdn-icons-png.flaticon.com/128/2724/2724657.png',
                                            }}
                                        />
                                    </Pressable>
                                </View>
                            )}
                        </View>
  
                        <View style={{marginVertical: 15}}>
                            {route?.params?.prompts.slice(0, 1).map(prompt => (
                                <>
                                    <View
                                        key={prompt.id}
                                        style={{
                                            backgroundColor: 'white',
                                            padding: 12,
                                            borderRadius: 10,
                                            height: 150,
                                            justifyContent: 'center',
                                    }}>
                                        <Text style={{fontSize: 15, fontWeight: '500'}}>
                                            {prompt.question}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                fontWeight: '600',
                                                marginTop: 20,
                                        }}>
                                            {prompt.answer}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
                                            backgroundColor: 'white',
                                            width: 42,
                                            height: 42,
                                            borderRadius: 21,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: {width: 0, height: 1},
                                            shadowOpacity: 0.25,
                                             shadowRadius: 3.84,
                                             // Shadow properties for Android
                                             elevation: 5,
                                    }}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                                resizeMode: 'contain',
                                            }}
                                            source={{
                                                uri: 'https://cdn-icons-png.flaticon.com/128/2724/2724657.png',
                                            }}
                                        />
                                    </View>
                                </>
                            ))}
                        </View>
  
                        {/* profile details to come here */}
  
                        <View>
                            {route?.params?.imageUrls?.slice(1, 3).map((item, index) => (
                                <View key={index} style={{marginVertical: 10}}>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 410,
                                            resizeMode: 'cover',
                                            borderRadius: 10,
                                        }}
                                        source={{
                                            uri: item,
                                }}/>
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
                                            backgroundColor: 'white',
                                            width: 42,
                                            height: 42,
                                            borderRadius: 21,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                    }}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                                resizeMode: 'contain',
                                            }}
                                            source={{
                                                uri: 'https://cdn-icons-png.flaticon.com/128/2724/2724657.png',
                                            }}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
  
                        <View style={{marginVertical: 15}}>
                            {route?.params?.prompts.slice(1, 2).map(prompt => (
                                <>
                                    <View
                                        key={prompt.id}
                                        style={{
                                            backgroundColor: 'white',
                                            padding: 12,
                                            borderRadius: 10,
                                            height: 150,
                                            justifyContent: 'center',
                                    }}>
                                        <Text style={{fontSize: 15, fontWeight: '500'}}>
                                            {prompt.question}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                fontWeight: '600',
                                                marginTop: 20,
                                        }}>
                                            {prompt.answer}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
                                            backgroundColor: 'white',
                                            width: 42,
                                            height: 42,
                                            borderRadius: 21,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: {width: 0, height: 1},
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            // Shadow properties for Android
                                            elevation: 5,
                                    }}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                                resizeMode: 'contain',
                                            }}
                                            source={{
                                                uri: 'https://cdn-icons-png.flaticon.com/128/2724/2724657.png',
                                                }}
                                        />
                                    </View>
                                </>
                            ))}
                        </View>
  
                        <View>
                            {route?.params?.imageUrls?.slice(3, 4).map((item, index) => (
                                <View key={index} style={{marginVertical: 10}}>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 410,
                                            resizeMode: 'cover',
                                            borderRadius: 10,
                                        }}
                                        source={{
                                            uri: item,
                                        }}
                                    />
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
                                            backgroundColor: 'white',
                                            width: 42,
                                            height: 42,
                                            borderRadius: 21,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                    }}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                                resizeMode: 'contain',
                                            }}
                                            source={{
                                                uri: 'https://cdn-icons-png.flaticon.com/128/2724/2724657.png',
                                            }}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                        <View style={{marginVertical: 15}}>
                            {route?.params?.prompts.slice(2, 3).map(prompt => (
                                <>
                                    <View
                                        key={prompt.id}
                                        style={{
                                            backgroundColor: 'white',
                                            padding: 12,
                                            borderRadius: 10,
                                            height: 150,
                                            justifyContent: 'center',
                                    }}>
                                        <Text style={{fontSize: 15, fontWeight: '500'}}>
                                            {prompt.question}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 20,
                                                fontWeight: '600',
                                                marginTop: 20,
                                        }}>
                                            {prompt.answer}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
                                            backgroundColor: 'white',
                                            width: 42,
                                            height: 42,
                                            borderRadius: 21,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: {width: 0, height: 1},
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            // Shadow properties for Android
                                            elevation: 5,
                                     }}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                                resizeMode: 'contain',
                                            }}
                                            source={{
                                                uri: 'https://cdn-icons-png.flaticon.com/128/2724/2724657.png',
                                            }}
                                        />
                                    </View>
                                </>
                            ))}
                        </View>
  
                        <View>
                            {route?.params?.imageUrls?.slice(4, 7).map((item, index) => (
                                <View key={index} style={{marginVertical: 10}}>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 410,
                                            resizeMode: 'cover',
                                            borderRadius: 10,
                                        }}
                                        source={{
                                            uri: item,
                                        }}
                                    />
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
                                            backgroundColor: 'white',
                                            width: 42,
                                            height: 42,
                                            borderRadius: 21,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                     }}>
                                        <Image
                                            style={{
                                                width: 30,
                                                height: 30,
                                                resizeMode: 'contain',
                                            }}
                                            source={{
                                                uri: 'https://cdn-icons-png.flaticon.com/128/2724/2724657.png',
                                            }}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
  
            <Pressable
                onPress={match}
                style={{
                    position: 'absolute',
                    bottom: 45,
                    right: 12,
                    backgroundColor: 'white',
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
            }}>
                <Image
                    style={{width: 30, height: 30, resizeMode: 'contain'}}
                    source={{
                        uri: 'https://cdn-icons-png.flaticon.com/128/2724/2724657.png',
                    }}
                />
            </Pressable>
        </>
    );
};
  
export default HandleLikeScreen;
  
const styles = StyleSheet.create({});