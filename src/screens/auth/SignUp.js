import React, { Component } from 'react'

import {
    View,
    Button,
    Text,
    StyleSheet,
    AsyncStorage,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
} from 'react-native'

import { toastr } from '../../helpers/helper'

import firebase from 'firebase'

class SignUp extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            password: ''
        }
    }

    _signUpAsync = async () => {

        const { name, email, password } = this.state

        let error = false

        try {

            if(name.trim() === "") {
                error = true
                throw new Error('Name is Required.')
            }

            if(name.trim().length < 3) {
                error = true
                throw new Error('Name Minimum 3 Character.')
            }

            const response = await firebase.auth().createUserWithEmailAndPassword(email, password)

            firebase.database().ref('users').child(response.user.uid).set({
                name,
                email,
                uid: response.user.uid
            })

            await AsyncStorage.setItem('userToken', response.user.uid)

            this.props.navigation.navigate('App')

        } catch(error) {

            toastr(error.message, 'danger')

        }

    }

    _handleChange = key => value => {
        this.setState({ [key]: value })
    }

    _renderRegisterButton = () => {

        return (
            <TouchableOpacity
                style={styles.btnRegister}
                onPress={() => this._signUpAsync()}
                underlayColor='#325b84'>
                <Text style={styles.registerText}> Sign Up </Text>
            </TouchableOpacity>
        )

    }

    render() {
        return (

           <View style={styles.container}>
                <View style={styles.formGroup}>
                    <TextInput
                        value={this.state.name}
                        onChangeText={this._handleChange('name')}
                        placeholder='Name'
                        placeholderTextColor='#294158'
                        style={styles.textInput}
                    />
                     <TextInput
                        value={this.state.email}
                        onChangeText={this._handleChange('email')}
                        placeholder='Email'
                        placeholderTextColor='#294158'
                        style={styles.textInput}
                    />
                      <TextInput
                        value={this.state.password}
                        onChangeText={this._handleChange('password')}
                        placeholder='Password'
                        placeholderTextColor='#294158'
                        style={styles.textInput}
                    />

                    <View style={styles.btnSignUp}>
                       { this._renderRegisterButton() }
                    </View>

                    <TouchableOpacity style={{
                        marginTop: 14
                    }} onPress={() => this.props.navigation.navigate('SignIn')}>
                        <Text style={styles.textLogin}>Already have account ? Sign In »</Text>
                    </TouchableOpacity>
                </View>



            </View>

        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d6dce2',
        padding: 10,
    },
    formGroup: {
        flex: 1,
        justifyContent: 'center',
    },
    textInput: {
        backgroundColor: '#eaedf0',
        borderRadius: 7,
        paddingHorizontal: 16,
        marginVertical: 10,
        fontSize: 16,
        color: '#294158'
    },
    btnRegister: {
        marginTop: 12,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#24394d',
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#24394d'
    },
    textLogin: {
        fontSize: 16,
        textAlign: 'center',
        color: '#A0A0A0'
    },
    registerText: {
       color:'#fff',
       textAlign:'center',
    }
});


export default SignUp
