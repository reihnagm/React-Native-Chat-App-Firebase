import React, { Component } from 'react'

import { SafeAreaView, Image, Text, View, Button, FlatList, AsyncStorage, TouchableOpacity } from 'react-native'

import firebase from 'firebase'

import { NavigationEvents } from 'react-navigation'

import _ from 'lodash'

class Home extends Component {

    _isMounted = false

    constructor(props) {

        super(props)

        this.state = {
            users: [],
        }

    }

    static navigationOptions = () => {

        return {
            headerShown: false
        }

    }

    async _fetchdata () {

        this._isMounted = true

        const uid = await AsyncStorage.getItem('userToken')

        firebase.database().ref(`user_conversations/${uid}`).on('child_added', snapshot => {

            if (snapshot.key !== uid) {
                if (this._isMounted) {
                    this.setState(prevState => {
                        return {
                            users: prevState.users.concat(snapshot.val())
                        }
                    })
                }
            }

        })

    }

    componentDidMount() {

        this._fetchdata()

    }

    componentWillUnmount() {

        this._isMounted = false

    }

    renderRow = ({ item }) => {

        return (
            <>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Chat', item)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        borderBottomColor: '#99a8b6',
                        borderBottomWidth: 0.8 }}>
                    <Image
                        style={{
                            width: 36,
                            height: 36,
                            resizeMode: 'cover',
                            borderRadius: 32,
                            marginRight: 14
                        }}
                        source={ item.image ? { uri: item.image } : require('../../assets/profile/user.png') } />
                    <View>
                        <Text style={{
                            fontSize: 16,
                            color: '#1f3142',
                            fontWeight: 'bold',
                        }}>{ item.name } - { item.lastMessage } </Text>
                    </View>
                </TouchableOpacity>
            </>
        )

    }

    render() {
        return (
            <>
                <SafeAreaView style={{ backgroundColor: '#d6dce2', flex: 1 }}>

                    <FlatList
                        data={ this.state.users }
                        renderItem={ this.renderRow }
                        keyExtractor={ (item) => item.uid }
                        ListHeaderComponent={ () =>
                            <View style={{
                                backgroundColor: '#34526e',
                                padding: 10,
                                alignItems: 'center'
                            }}>
                                <Text style={{
                                    fontSize: 20,
                                    color: '#eaedf0',
                                    fontWeight: 'bold',
                                }}> Chats </Text>
                            </View>
                        }
                    />

                </SafeAreaView>
            </>
        )
    }

}

export default Home
