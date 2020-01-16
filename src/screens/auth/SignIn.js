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

import { connect } from 'react-redux'

import { handleEmail, handlePassword, handlePhone, changeValuePhone, login } from '../../actions/auth'

import User from './User'

import firebase from 'firebase'

class SignIn extends Component {

    static navigationOptions = {
        headerShown: false
    }

    state = {
        phone: '',
        name: ''
    }

    _handleChange = key => value => {
        this.setState({ [key]: value })
    }

    componentDidMount() {
        AsyncStorage.getItem('userPhone').then(value => {
            if(value) {
                this.setState({
                    phone: value
                })
            }
        })
    }

    _signInAsync = async () => {

        if(this.state.phone.length < 12) {
            toastr('Wrong Phone Number','danger')
        } else if(this.state.name.length < 3) {
            toastr('Name is Required','danger')
        }
        else {
            await AsyncStorage.setItem('userPhone', this.state.phone)
            User.phone = this.state.phone
            firebase.database().ref(`users/${User.phone}`).set({ name: this.state.name })
            this.props.navigation.navigate('App')
        }

    }

    _renderAccessButton = () => {

        if (this.props.signInLoading) {

            return (
                <ActivityIndicator size="large" color="#5c748b" />
            )

        }

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
                        value={this.state.phone}
                        onChangeText={this._handleChange('phone')}
                        placeholder='Phone Number'
                        placeholderTextColor='#7f99b2'
                        keyboardType='number-pad'
                        style={styles.textInput}
                    />
                    <TextInput
                        value={this.state.name}
                        onChangeText={this._handleChange('name')}
                        placeholder='Name'
                        placeholderTextColor='#7f99b2'
                        style={styles.textInput}
                        returnKeyType="next"
                    />
                    {/* <TextInput
                        value={this.props.email}
                        onChangeText={value => this.props.handleEmail(value)}
                        placeholder='Email'
                        placeholderTextColor='#7f99b2'
                        style={styles.textInput}
                        returnKeyType="next"
                    /> */}
                    {/*  <TextInput
                        value={this.props.password}
                        onChangeText={value => this.props.handlePassword(value)}
                        placeholder='Password'
                        placeholderTextColor='#7f99b2'
                        style={styles.textInput}
                        returnKeyType="go"
                    /> */}
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

export default connect(
    mapStateToProps,
    { handleEmail, handlePassword, handlePhone, changeValuePhone, login }
)(SignIn)
