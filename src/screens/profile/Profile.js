import React, { Component } from 'react'

import { SafeAreaView, Text, AsyncStorage, Image, View, Button, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native'

import ImagePicker from 'react-native-image-picker'

import User from '../auth/User'

import { toastr } from '../../helpers/helper'

import firebase from 'firebase'

class Profile extends Component {

    static navigationOptions = {
        headerTitle: () => {
            <Text> Profile </Text>
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            phone: '',
            imageSource: User.image ? { uri:  User.image }  : require('../../assets/profile/user.png'),
            upload: false
        }
    }

    async _getProfile() {

        const { currentUser }  = firebase.auth()

        await firebase.database().ref(`users/${currentUser.uid}`).on("value", snapshot => {
            const name = snapshot.val().name
            const email = snapshot.val().email
            const phone = snapshot.val().phone
            this.setState({
                name,
                email,
                phone,
                imageSource: User.image ? { uri:  User.image } : require('../../assets/profile/user.png'),
                upload: false
            })
        })
        
    }

    componentDidMount() {

        this._getProfile()

    }

    _signout = async (props) => {

        await AsyncStorage.clear()

        this.props.navigation.navigate('SignIn')

    }

    _handleChange = key => value => {
        this.setState({ [key]: value })
    }

    _changeName = async () => {

        let error = false

        try {

            if(this.state.name.trim() === "") {
                error = true
                throw new Error('Please enter valid name')
            }

            if(this.state.name.length < 3) {
                error = true
                throw new Error('Minimum Character 3 length')
            }

            if(error === false) {
                if(User.name !== this.state.name) {
                    this.updateUser()
                }
            }

        } catch(error) {

            toastr(error.message, 'danger')

        }

    }

    _changeImage = () => {

        const options = {
            quality: 0.7,
            allowsEditing: true,
            mediaType: 'photo',
            noData: true,
            storageOptions: {
                skipBackup: true,
                waitUntilSaved: true,
                path: 'images',
                cameraRoll: true
            }
        }

        ImagePicker.showImagePicker(options, response => {

            let error  = false

            const arr = [response.fileName]
            const extension = arr[0].split('.')
            const filename = extension[1]

            try {
                if(response.fileSize > 5242880) {
                    throw new Error('File size cannot than 5 MB !')
                    error = true
                }
                if(!this.isImage(filename)) {
                    throw new Error('File allowed only JPG, JPEG, PNG, GIF, SVG !')
                    error = true
                }

                if(response.error) {
                    throw new Error(response.error)
                } else if(!response.didCancel) {
                    this.setState({
                        upload: true,
                        imageSource: {
                            uri: response.uri
                        }
                    }, this.uploadedFile)
                }

            } catch(error) {
                toastr(error.message, 'danger')
            }


        })

    }

    isImage = (filename) => {
        switch (filename) {
            case 'jpg':
            case 'gif':
            case 'bmp':
            case 'png':
                return true
        }
        return false
    }

    updateUser = () => {
        firebase.database().ref('users').child(User.phone).set(User)
        toastr('Successfully updated !', 'success')
    }

    updateUserImage = (imageUrl) => {
        User.image = imageUrl
        User.name = this.state.name
        this.updateUser()
        this.setState({
            upload: false,
            imageSource: {
                uri: imageUrl
            }
        })
    }

    uploadedFile = async () => {
        const file = await this.uriToBlob(this.state.imageSource.uri)
        firebase.storage().ref(`profile_picture/${User.phone}.png`)
            .put(file)
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url =>  this.updateUserImage(url))
            .catch(error => {
                this.setState({
                    upload: false,
                    imageSource: require('../../assets/profile/user.png')
                })
            })
    }

    uriToBlob = (uri) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.onload = function () {
                resolve(xhr.response)
            }
            xhr.onerror = function () {
                reject(new Error('Error on upload image'))
            }
            xhr.responseType = 'blob'
            xhr.open('GET', uri, true)
            xhr.send(null)
        })
    }

    render() {
        return (
            <SafeAreaView style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={ this._changeImage }>
                    {
                        this.state.upload ? <ActivityIndicator size="large" /> : <Image style={{
                                borderRadius: 100,
                                width: 100,
                                height: 100,
                                marginBottom: 10,
                                resizeMode: 'cover'
                            }} source={ this.state.imageSource } />
                    }
                </TouchableOpacity>
                <TextInput style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    width: '80%',
                    marginBottom: 10,
                    borderRadius: 5
                }} value={this.state.name} onChangeText={this._handleChange('name')} />
                <Text style={{ fontSize: 16 }}>{this.state.name}</Text>
                <Text style={{ fontSize: 16 }}>{this.state.email}</Text>
                <Text style={{ fontSize: 16 }}>{this.state.phone}</Text>
                <TouchableOpacity onPress={this._changeName}>
                    <Text> Change Name</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._signout}>
                    <Text> Logout </Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

export default Profile
