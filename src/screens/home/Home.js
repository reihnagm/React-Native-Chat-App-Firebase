import React, { Component } from 'react'

import { SafeAreaView, Image, Text, View, Button, FlatList, AsyncStorage, TouchableOpacity } from 'react-native'

import firebase from 'firebase'

class Home extends Component {

    static navigationOptions = () => {
        return {
            headerShown: false
        }
    }

    state = {
        users: [],
        dbRef: firebase.database().ref('users')
    }

    async _fetchdata () {

        const currentUserUID = await AsyncStorage.getItem('userToken')

        await this.state.dbRef.on('child_added', (val) => {
            let person = val.val()
            person.uid = val.key
            if (person.uid === currentUserUID) {
                person.email
                person.image ? person.image : null
            } else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        })

    }

    componentDidMount() {

        this._fetchdata()

    }

    componentWillUnmount() {

        this.state.dbRef.off()

    }

    renderRow = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Chat', item)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    borderBottomColor: '#ccc',
                    borderBottomWidth: 1 }}>
                <Image
                    style={{
                        width: 32,
                        height: 32,
                        resizeMode: 'cover',
                        borderRadius: 32,
                        marginRight: 5
                    }}
                    source={ item.image ? { uri: item.image } : require('../../assets/profile/user.png') } />
                <Text style={{ fontSize: 16 }}>{ item.uid }</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: '#d6dce2', flex: 1 }}>
                <FlatList
                    data={ this.state.users }
                    renderItem={ this.renderRow }
                    keyExtractor={ (item) => item.uid }
                    ListHeaderComponent={ () =>
                        <Text style={{
                            fontSize: 20,
                            color: '#24394d',
                            fontWeight: 'bold',
                            marginVertical: 10,
                            marginLeft: 10
                        }}> Chats </Text>
                    }
                />
            </SafeAreaView>
        )
    }

}

export default Home
