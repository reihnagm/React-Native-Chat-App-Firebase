import React, { useState } from 'react'

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

import { connect } from 'react-redux'

import { handleName, handleEmail, handlePassword, register } from '../../actions/auth'

const SignUp = ({ handleName, handleEmail, handlePassword, register, user: { signUpLoading, name, email, password }, navigation  }) => {

    _signUpAsync = () => {

        const data = {
            name,
            email,
            password
        }

        register(data, navigation)

    }

    _renderRegisterButton = () => {

        if (signUpLoading) {
            return (<ActivityIndicator size="large" color="#00ff00" />)
        }
        return (
            <TouchableOpacity
                style={styles.btnRegister}
                onPress={() => _signUpAsync()}
                underlayColor='#325b84'>
                <Text style={styles.registerText}> Sign Up </Text>
            </TouchableOpacity>
        )

    }

    {/* <ImageBackground source={require('../../assets/images/ic_log_in_background.png')} style={{ flex: 1, width: null }}>
    </ImageBackground>
    */}

    return (

       <View style={styles.container}>
            <View style={styles.formGroup}>
                <TextInput
                    placeholder='Name'
                    placeholderTextColor='#7f99b2'
                    style={styles.textInput}
                    value={name}
                    onChangeText={value => handleName(value)}
                />
                <TextInput
                    placeholder='Email'
                    placeholderTextColor='#7f99b2'
                    style={styles.textInput}
                    value={email}
                    onChangeText={value => handleEmail(value)}
                />
                <TextInput
                    placeholder='Password'
                    placeholderTextColor='#7f99b2'
                    style={styles.textInput}
                    value={password}
                    onChangeText={value => handlePassword(value)}
                />

                <View style={styles.btnSignUp}>
                   { _renderRegisterButton() }
                </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.textLogin}>Already have account ? Sign in »</Text>
            </TouchableOpacity>

        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    formGroup: {
        flex: 1,
        justifyContent: 'center',
    },
    textInput: {
        backgroundColor: '#e5eaef',
        borderRadius: 7,
        paddingHorizontal: 16,
        marginVertical: 10,
        fontSize: 16,
        color: '#7f99b2'
    },
    textLogin: {
        fontSize: 16,
        textAlign: 'center',
        color: '#A0A0A0'
    },
    btnRegister: {
        marginTop: 12,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#194775',
        borderRadius: 7,
        borderWidth: 1,
        borderColor: '#194775'
    },
   registerText: {
       color:'#fff',
       textAlign:'center',
   }
});

const mapStateToProps = state => ({
    user: state.auth
})

export default connect(
    mapStateToProps,
    { handleName, handleEmail, handlePassword, register }
)(SignUp)
