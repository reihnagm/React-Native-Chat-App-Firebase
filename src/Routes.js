import React from 'react'

import { Image } from 'react-native'

import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'

import AuthLoadingScreen from './screens/auth/AuthLoading'
import SignInScreen from './screens/auth/SignIn'
import SignUpScreen from './screens/auth/SignUp'

import HomeScreen from './screens/home/Home'
import ChatScreen from './screens/chat/Chat'
import MapScreen from './screens/map/Map'
import ProfileScreen from './screens/profile/Profile'
import ContactScreen from './screens/contact/Contact'

import { enableScreens } from 'react-native-screens'

enableScreens()

const AppStack = createStackNavigator({
    Home: HomeScreen,
    Chat: ChatScreen
})

AppStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = navigation.state.index === 0

    return {
        tabBarVisible
    }
}

const AuthStack = createStackNavigator({
    SignIn: SignInScreen,
    SignUp: SignUpScreen
})

const TabNavigator = createBottomTabNavigator({
    Chats: AppStack,
    Map: MapScreen,
    Contact: ContactScreen,
    Profile: ProfileScreen
}, {
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state
            let imageName = require('./assets/chat/chat.png')

            if(routeName === 'Profile') {
                imageName = require('./assets/settings/settings.png')
            }

            if(routeName === 'Map') {
                imageName = require('./assets/map/map.png')
            }

            if(routeName === 'Contact') {
                imageName = require('./assets/contact/contact.png')
            }

            return <Image source={imageName} style={{ width: 25, resizeMode: 'contain', tintColor }} />
        },
    }),
    tabBarOptions: {
        activeTintColor: '#eaedf0',
        inActiveColor: '#c2cbd3',
        style: {
            borderTopColor: 'transparent',
            backgroundColor: '#34526e',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 60,
            position:'absolute'
        }
    },
})

export default createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingScreen,
            App: TabNavigator,
            Auth: AuthStack,
        },
        {
            initialRouteName: 'AuthLoading',
        }
    )
)
