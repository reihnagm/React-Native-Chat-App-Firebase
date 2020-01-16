import React, { Component } from 'react'

import {
    View,
    Button,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    ImageBackground,
    AsyncStorage,
    ActivityIndicator,
} from 'react-native'

import { toastr } from '../../helpers/helper'

import User from './User'

import firebase from 'firebase'

class SignIn extends Component {

    static navigationOptions = {
        headerShown: false
    }

    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: ''
        }
    }

    _handleChange = key => value => {
        this.setState({ [key]: value })
    }

    _signInAsync = async () => {

        const { name, email, password, phone } = this.state

        const { navigation } = this.props

        try {

            const response = await firebase.auth().signInWithEmailAndPassword(email, password)

            await AsyncStorage.setItem('userToken',response.user.uid)

            navigation.navigate('App')

        } catch(error) {

            toastr(error.message, 'danger')

        }

    }

    _renderAccessButton = () => {

        return (
            <TouchableOpacity
                style={styles.btnLogin}
                onPress={() => this._signInAsync()}
                underlayColor='#325b84'>
                <Text style={styles.loginText}> Login </Text>
            </TouchableOpacity>
        )

    }

    render() {
        return (
             <View style={styles.container}>

                <View style={styles.formGroup}>
                     <TextInput
                        value={this.state.email}
                        onChangeText={this._handleChange('email')}
                        placeholder='Email'
                        placeholderTextColor='#7f99b2'
                        style={styles.textInput}
                        returnKeyType="next"
                    />
                      <TextInput
                        value={this.state.password}
                        onChangeText={this._handleChange('password')}
                        placeholder='Password'
                        placeholderTextColor='#7f99b2'
                        style={styles.textInput}
                        returnKeyType="go"
                    />
                    <View style={styles.btnLogIn}>
                        { this._renderAccessButton() }
                    </View>
                </View>


                <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                    <Text style={styles.textRegister}>Don't have account ? Sign up now »</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    textTitle: {
        fontSize: 30,
        color: '#fff'
    },
    formGroup: {
        flex: 1,
        justifyContent: 'center'
    },
    textInput: {
        backgroundColor: '#e5eaef',
        borderRadius: 7,
        paddingHorizontal: 16,
        marginVertical: 10,
        fontSize: 16,
        color: '#7f99b2'
    },
    textRegister: {
        fontSize: 16,
        textAlign: 'center',
        color: '#A0A0A0'
    },
    btnLogin: {
        marginTop: 12,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#194775',
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#194775'
    },
    loginText: {
        color:'#fff',
        textAlign:'center',
    }
})

const mapStateToProps = state => ({
    user: state.auth,
    email: state.auth.email,
    password: state.auth.password,
    phone: state.auth.phone
})

export default SignIn
