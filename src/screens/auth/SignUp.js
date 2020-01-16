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

import firebase from 'firebase'

class SignUp extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            password: '',
            phone: ''
        }
    }

    _signUpAsync = async () => {

        const {name, email, password, phone} = this.state

        let error = false

        try {

            if(name.trim() === "") {
                error = true
                throw new Error('Name is Required.')
            }

            if(name.length < 3) {
                error = true
                throw new Error('Name Minimum 3 Character.')
            }

            if(phone < 12) {
                error = true
                throw new Error('Phone Minimum 12 Character.')
            }

            firebase.database().ref('users').set({ name, email, password, phone })

            const response = await firebase.auth().createUserWithEmailAndPassword(email, password)

            await AsyncStorage.setItem('userToken', response.uid)

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
                onPress={() => _signUpAsync()}
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
                    placeholderTextColor='#7f99b2'
                    style={styles.textInput}
                    returnKeyType="next"
                />
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
                <TextInput
                    value={this.state.phone}
                    onChangeText={this._handleChange('phone')}
                    placeholder='Phone Number'
                    placeholderTextColor='#7f99b2'
                    keyboardType='number-pad'
                    style={styles.textInput}
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


export default SignUp
