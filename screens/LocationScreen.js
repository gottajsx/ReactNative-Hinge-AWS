import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Platform,
    TouchableOpacity,
    Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import { Ionicons } from '@expo/vector-icons';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {useNavigation} from '@react-navigation/native';
import { saveRegistrationProgress } from '../utils/registrationUtils';
  
const LocationScreen = () => {
    const [region, setRegion] = useState('');
    const navigation = useNavigation();
    const [location, setLocation] = useState('Loading...');
  
    useEffect(() => {
        Geolocation.getCurrentPosition(
            position => {
                const {latitude, longitude} = position.coords;
  
                const initialRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
  
                setRegion(initialRegion);
  
                // setMarkerCoordinate({latitude, longitude});
                fetchAddress(latitude, longitude);
            },
            error => console.log('Error fetching location:', error),
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
    }, []);
    
    const fetchAddress = (latitude, longitude) => {
        fetch(
        `   https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDfr7eubWiWHSMt_3DGir2Fcx4BN1NtoTg`,
        )
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const addressComponents = data?.results[0].address_components;
                let formattedAddress = '';
                for (let component of addressComponents) {
                    if (component.types.includes('sublocality_level_1')) {
                        formattedAddress += component.long_name + ', ';
                    }
                    if (component.types.includes('locality')) {
                        formattedAddress += component.long_name + ', ';
                    }
                }
                formattedAddress = formattedAddress.trim().slice(0, -1);
                setLocation(formattedAddress);
            }
        })
        .catch(error => console.log('Error fetching address:', error));
    };
  
    const handleNext = () => {
        saveRegistrationProgress('Location',{location});
        navigation.navigate('Gender');
    };
    
    console.log('Location', location);
    
    return (
        <SafeAreaView
            style={{
                paddingTop: Platform.OS === 'android' ? 35 : 0,
                flex: 1,
                backgroundColor: 'white',
        }}>
            <View style={{marginTop: 80, marginHorizontal: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            borderWidth: 2,
                            borderColor: 'black',
                            justifyContent: 'center',
                            alignItems: 'center',
                    }}>
                        <MaterialIcons name="map-marker" size={23} color="black" />
                    </View>
                    <Image
                        style={{width: 100, height: 40}}
                        source={{
                            uri: 'https://cdn-icons-png.flaticon.com/128/10613/10613685.png',
                    }}/>
                </View>
    
                <Text
                    style={{
                        fontSize: 25,
                        fontWeight: 'bold',
                        fontFamily: 'GeezaPro-Bold',
                         marginTop: 15,
                }}>
                    Where do you live?
                </Text>
    
                <MapView
                    style={{width: '100%', height: 500, marginTop: 20, borderRadius: 5}}
                    region={region}
                >
                    {region && (
                        <Marker
                            coordinate={{
                            latitude: region.latitude,
                            longitude: region.longitude,
                        }}>
                            <View
                                style={{
                                    backgroundColor: 'black',
                                    padding: 12,
                                    borderRadius: 30,
                            }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 14,
                                        fontWeight: '500',
                                        color: 'white',
                                }}>
                                    {location}
                                </Text>
                            </View>
                        </Marker>
                    )}
                </MapView>
    
                <TouchableOpacity
                    onPress={handleNext}
                    activeOpacity={0.8}
                    style={{marginTop: 30, marginLeft: 'auto'}}>
                        <Ionicons
                            name="chevron-forward-circle-outline"
                            size={45}
                            color="#581845"
                         />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
  
export default LocationScreen;
  
const styles = StyleSheet.create({});