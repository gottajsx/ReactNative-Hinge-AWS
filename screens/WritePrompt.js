import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Platform,
    Pressable,
    TextInput,
} from 'react-native';
import React, {useState} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
  
const WritePrompt = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const question = route?.params?.question;
    const {index, prompts, setPrompts} = route.params;
    const [answer, setAnswer] = useState('');
    
    const handleDone = () => {
        const updatedPrompts = [...prompts];
        updatedPrompts[index] = {question,answer};
        navigation.replace("Prompts",{updatedPrompts});
    }
    
    return (
        <SafeAreaView
            style={{
                paddingTop: Platform.OS === 'android' ? 35 : 0,
                flex: 1,
        }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
            }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 12,
                        gap: 5,
                }}>
                    <Ionicons name="chevron-back-outline" size={25} color="black" />
                    <Text style={{fontSize: 15}}>Write Answer</Text>
                </View>
                <Pressable onPress={handleDone}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: '#5a0763',
                            marginRight: 10,
                            fontWeight: '500',
                    }}>
                        Done
                    </Text>
                </Pressable>
            </View>
  
            <View style={{padding: 12}}>
                <View style={{backgroundColor: 'white', padding: 15, borderRadius: 5}}>
                    <Text>{question}</Text>
                </View>
  
                <View
                    style={{
                        padding: 10,
                        borderRadius: 10,
                        height: 100,
                        marginTop: 15,
                        backgroundColor: 'white',
                }}>
                    <TextInput
                        multiline
                        placeholder="Enter your answer"
                        value={answer}
                        onChangeText={text => setAnswer(text)}
                        style={{fontFamily: 'Helvetica', fontSize: answer ? 17 : 17}}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};
  
export default WritePrompt;
  
const styles = StyleSheet.create({});