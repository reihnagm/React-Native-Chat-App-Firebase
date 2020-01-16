import React, { useEffect } from 'react'

import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    AsyncStorage,
    View,
} from 'react-native'

import User from './User'

const AuthLoading = ({ navigation }) => {

    const _bootstrapAsync = async () => {
        User.phone = await AsyncStorage.getItem('userPhone')
        navigation.navigate(User.phone ? 'App' : 'Auth')
    }

    useEffect(() => {
        _bootstrapAsync()
    },[])

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
        </View>
    )

}

export default AuthLoading
