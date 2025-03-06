import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {TabBar, TabView} from 'react-native-tab-view';
import ViewProfile from '../components/ViewProfile';

const ProfileDetailScreen = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key: 'edit', title: 'Edit'},
        {key: 'view', title: 'View'},
    ]);
    const route = useRoute();
    const userInfo = route?.params?.userInfo;
    const renderScene = ({route}) => {
        switch (route.key) {
            case 'edit':
                return <EditProfile />;
            case 'view':
                return <ViewProfile userInfo={userInfo} />;
    }
  };

const EditProfile = () => {};
    return (
        <SafeAreaView style={{flex:1,backgroundColor:"white"}}> 
            <View style={{padding: 10}}>
                <Text style={{fontSize: 17, fontWeight: '500', textAlign: 'center'}}>
                    {route?.params?.userInfo?.firstName}
                </Text>
            </View>

            <TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{width: '100%'}}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{backgroundColor: 'black'}}
                        style={{backgroundColor: 'white'}}
                        labelStyle={{fontWeight: 'bold'}}
                        activeColor="black"
                        inactiveColor="gray"
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default ProfileDetailScreen;

const styles = StyleSheet.create({});