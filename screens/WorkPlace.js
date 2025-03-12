import { 
    Image, 
    Platform, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View ,
    SafeAreaView
} from 'react-native'
import React, { useState ,useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getRegistrationProgress, saveRegistrationProgress } from '../utils/registrationUtils';

const WorkPlace = () => {
    const [workPlace,setWorkPlace] = useState("");
    const navigation = useNavigation();
    
    useEffect(() => {
        getRegistrationProgress('WorkPlace').then(progressData => {
            if(progressData){
            setWorkPlace(progressData.workPlace);
            }
        })
    },[])
    
    const handleNext = () => {
        if(workPlace.trim() !== ''){
            saveRegistrationProgress('WorkPlace',{workPlace});
        }
        navigation.navigate("JobTitle")
    }
  
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
                        <MaterialDesignIcons name="briefcase-outline" size={23} color="black" />
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
                    Where do you work?
                </Text>

                <TextInput
                    autoFocus={true}
                    value={workPlace}
                    onChangeText={text => setWorkPlace(text)}
                    placeholder="HomeTown"
                    style={{
                        width: 340,
                        marginTop: 25,
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                        paddingBottom: 10,
                        fontFamily: 'GeezaPro-Bold',
                        fontSize: workPlace ? 22 : 22,
                }}/>

                <TouchableOpacity
                    onPress={handleNext}
                    activeOpacity={0.8}
                    style={{marginTop: 30, marginLeft: 'auto'
                }}>
                    <Ionicons
                        name="chevron-forward-circle-outline"
                        size={45}
                        color="#581845"
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default WorkPlace;

const styles = StyleSheet.create({});