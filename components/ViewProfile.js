import {
    StyleSheet,
    Text,
    View,
    Pressable,
    Image,
    ScrollView,
  } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

const ViewProfile = ({userInfo}) => {
    return (
        <ScrollView>
            <View style={{marginHorizontal: 12, marginVertical: 12}}>
                <>
                    <View>
                        <View
                            style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <View
                                style={{flexDirection: 'row', alignItems: 'center', gap: 10
                            }}>
                                <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                                    {userInfo?.firstName}
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
  
                            <View>
                                <Entypo name="dots-three-horizontal" size={22} color="black" />
                            </View>
                        </View>
  
                        <View style={{marginVertical: 15}}>
                            <View>
                                {userInfo?.imageUrls?.length > 0 && (
                                    <View>
                                        <Image
                                            source={{uri: userInfo?.imageUrls[0]}}
                                            style={{
                                                width: '100%',
                                                height: 350,
                                                resizeMode: 'cover',
                                                borderRadius: 10,
                                        }}/>
                                        <Pressable
                                            style={{
                                                position: 'absolute',
                                                bottom: 10,
                                                right: 10,
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
                                            }}/>
                                        </Pressable>
                                    </View>
                                )}
                            </View>
                        </View>
  
                        <View style={{marginVertical: 15}}>
                            {userInfo?.prompts?.slice(0, 1).map((prompt, index) => (
                                <>
                                    <View
                                        style={{
                                            backgroundColor: 'white',
                                            padding: 12,
                                            borderRadius: 10,
                                            height: 150,
                                            justifyContent: 'center',
                                        }}
                                        key={index}
                                    >
                                        <Text style={{fontSize: 15, fontWeight: '500'}}>
                                            {prompt.question}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 24,
                                                fontWeight: 'bold',
                                                marginTop: 20,
                                                fontFamily: 'Carlito',
                                                lineHeight: 30,
                                        }}>
                                            {prompt.answer}
                                        </Text>
                                    </View>
                                    <Pressable
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
                                            backgroundColor: 'white',
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: {width: 0, height: 1},
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                    }}>
                                        <Image
                                            style={{width: 30, height: 30, resizeMode: 'contain'}}
                                            source={{
                                                uri: 'https://cdn-icons-png.flaticon.com/128/2724/2724657.png',
                                        }}/>
                                    </Pressable>
                                </>
                            ))}
                        </View>
  
                        <View
                            style={{
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 8,
                        }}>
                            <ScrollView
                                style={{}}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >
                                <View
                                    style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginRight: 20,
                                }}>
                                    {/* <MaterialCommunityIcons
                                    name="cake-variant-outline"
                                    size={22}
                                    color="black"
                                    /> */}
                                    <Text style={{fontSize: 15}}>{userInfo?.dateOfBirth}</Text>
                                </View>
  
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 10,
                                        marginRight: 20,
                                }}>
                                    <Ionicons name="person-outline" size={22} color="black" />
                                    <Text style={{fontSize: 15}}>{userInfo?.gender}</Text>
                                </View>
  
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 10,
                                        marginRight: 20,
                                    }}>
                                    <Ionicons name="magnet-outline" size={22} color="black" />
                                    <Text style={{fontSize: 15}}>{userInfo?.type}</Text>
                                </View>
  
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 10,
                                }}>
                                    {/* <Octicons name="home" size={22} color="black" /> */}
                                    <Text style={{fontSize: 15}}>{userInfo?.hometown}</Text>
                                </View>
                            </ScrollView>
  
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginTop: 15,
                                    borderBottomWidth: 0.8,
                                    borderBottomColor: '#E0E0E0',
                                    paddingBottom: 10,
                                    marginTop: 20,
                            }}>
                                <Ionicons name="bag-outline" size={20} color="black" />
                                <Text>{userInfo?.jobTitle}</Text>
                            </View>
  
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginTop: 15,
                                    borderBottomWidth: 0.8,
                                    borderBottomColor: '#E0E0E0',
                                    paddingBottom: 10,
                            }}>
                                <Ionicons name="locate-outline" size={20} color="black" />
                            <   Text>{userInfo?.workPlace}</Text>
                            </View>
  
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginTop: 15,
                                    borderBottomWidth: 0.8,
                                    borderBottomColor: '#E0E0E0',
                                    paddingBottom: 10,
                            }}>
                                <Ionicons name="book-outline" size={22} color="black" />
                                <Text>Hindu</Text>
                            </View>
  
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginTop: 15,
                                    borderBottomWidth: 0.8,
                                    borderBottomColor: '#E0E0E0',
                                    paddingBottom: 10,
                            }}>
                                <Ionicons name="home-outline" size={20} color="black" />
                                <Text>{userInfo?.location}</Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginTop: 15,
                                    borderBottomWidth: 0.7,
                                    borderBottomColor: '#E0E0E0',
                                    paddingBottom: 10,
                            }}>
                                <Ionicons name="search-outline" size={20} color="black" />
                                <Text>{userInfo?.lookingFor}</Text>
                            </View>
  
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginTop: 15,
                                    borderBottomWidth: 0.7,
                                    borderBottomColor: '#E0E0E0',
                                    paddingBottom: 10,
                            }}>
                                <Ionicons name="heart-outline" size={20} color="black" />
                                <Text>Monogamy</Text>
                            </View>
                        </View>
  
                        <View>
                            {userInfo?.imageUrls?.slice(1, 3).map((item, index) => (
                                <View style={{marginVertical: 10}} key={index}>
                                    <Image
                                        source={{uri: item}}
                                        style={{
                                            width: '100%',
                                            height: 350,
                                            resizeMode: 'cover',
                                            borderRadius: 10,
                                    }}/>
                                    <Pressable
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
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
                                        }}/>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
  
                        <View style={{marginVertical: 15}}>
                            {userInfo?.prompts?.slice(1, 2).map(prompt => (
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
                                                fontSize: 24,
                                                fontWeight: 'bold',
                                                marginTop: 20,
                                                fontFamily: 'Carlito',
                                                lineHeight: 30,
                                        }}>
                                            {prompt.answer}
                                        </Text>
                                    </View>
                                    <Pressable
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
                                            backgroundColor: 'white',
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
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
                                            style={{width: 30, height: 30, resizeMode: 'contain'}}
                                            source={{
                                                uri: 'https://cdn-icons-png.flaticon.com/128/2724/2724657.png',
                                        }}/>
                                    </Pressable>
                                </>
                            ))}
                        </View>
  
                        <View>
                            {userInfo?.imageUrls?.slice(3, 4).map((item, index) => (
                                <View key={index} style={{marginVertical: 10}}>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 350,
                                            resizeMode: 'cover',
                                            borderRadius: 10,
                                        }}
                                        source={{
                                            uri: item,
                                    }}/>
                                    <Pressable
                                        onPress={() =>
                                            navigation.navigate('SendLike', {
                                            type: 'image',
                                            image: item,
                                            name: currentProfile?.firstName,
                                            userId: userId,
                                            likedUserId: currentProfile?.userId,
                                            })
                                        }
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
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
                                        }}/>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                        <View style={{marginVertical: 15}}>
                            {userInfo?.prompts?.slice(2, 3).map(prompt => (
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
                                                fontSize: 24,
                                                fontWeight: 'bold',
                                                marginTop: 20,
                                                fontFamily: 'Carlito',
                                                lineHeight: 30,
                                        }}>
                                            {prompt.answer}
                                        </Text>
                                    </View>
                                    <Pressable
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
                                            backgroundColor: 'white',
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
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
                                            style={{width: 30, height: 30, resizeMode: 'contain'}}
                                            source={{
                                                uri: 'https://cdn-icons-png.flaticon.com/128/2724/2724657.png',
                                        }}/>
                                    </Pressable>
                                </>
                            ))}
                        </View>
  
                        <View>
                            {userInfo?.imageUrls?.slice(4, 7).map((item, index) => (
                                <View key={index} style={{marginVertical: 10}}>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 350,
                                            resizeMode: 'cover',
                                            borderRadius: 10,
                                    }}
                                        source={{
                                            uri: item,
                                    }}/>
                                    <Pressable
                                        style={{
                                            position: 'absolute',
                                            bottom: 10,
                                            right: 10,
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
                                        }}/>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </View>
                </>
            </View>
        </ScrollView>
    );
};
  
export default ViewProfile;
  
const styles = StyleSheet.create({});