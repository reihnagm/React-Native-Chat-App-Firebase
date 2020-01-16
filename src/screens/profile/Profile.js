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
            bio: '',
            phone: '',
            imageSource: require('../../assets/profile/user.png'),
            upload: false
        }
    }

    async _getProfile() {

        const { currentUser }  = firebase.auth()

        const { navigation } = this.props

        await firebase.database().ref(`users/${currentUser.uid}`).on("value", snapshot => {
            const image = snapshot.val().imageSource
            const name = snapshot.val().name
            const email = snapshot.val().email
            const bio = snapshot.val().bio
            const phone = snapshot.val().phone
            this.setState({
                imageSource: image ? { uri: image } : require('../../assets/profile/user.png'),
                name: name ? name : '',
                email: email ? email : '',
                bio: bio ? bio : '',
                phone: phone ? phone : '',
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

    _saveProfile = async () => {

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

                this.updateUser()

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

    updateUser = (imageUrl) => {
        const { imageSource, name, bio, phone } = this.state
        const { currentUser } = firebase.auth()

        firebase.database().ref(`users/${currentUser.uid}`).update({
            imageSource: imageSource ? imageUrl : '',
            name: name ? name : '',
            bio: bio ? bio : '',
            phone: phone ? phone : ''
        })

        toastr('Successfully updated !', 'success')
    }

    updateUserImage = (imageUrl) => {
        this.updateUser(imageUrl)
        this.setState({
            upload: false,
            imageSource: {
                uri: imageUrl
            }
        })
    }

    uploadedFile = async () => {
        const { currentUser } = firebase.auth()
        const file = await this.uriToBlob(this.state.imageSource.uri)
        firebase.storage().ref(`profile_picture/${currentUser.uid}.png`)
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
                backgroundColor: '#d6dce2',
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
                    padding: 8,
                    borderWidth: 1,
                    borderColor: '#34526e',
                    color: '#24394d',
                    width: '80%',
                    marginBottom: 10,
                    borderRadius: 5
                }} placeholder='Name' placeholderTextColor='#24394d' value={this.state.name} onChangeText={this._handleChange('name')} />
                <TextInput style={{
                    padding: 8,
                    borderWidth: 1,
                    borderColor: '#34526e',
                    color: '#24394d',
                    width: '80%',
                    marginBottom: 10,
                    borderRadius: 5
                }} placeholder='Email' placeholderTextColor='#24394d' editable={false} value={this.state.email} onChangeText={this._handleChange('email')} />
                <TextInput style={{
                    padding: 8,
                    borderWidth: 1,
                    borderColor: '#34526e',
                    color: '#24394d',
                    width: '80%',
                    marginBottom: 10,
                    borderRadius: 5
                }} placeholderTextColor='#24394d' placeholder= 'Bio' value={this.state.bio} onChangeText={this._handleChange('bio')} />
                <TextInput style={{
                    padding: 8,
                    borderWidth: 1,
                    borderColor: '#34526e',
                    color: '#24394d',
                    width: '80%',
                    marginBottom: 10,
                    borderRadius: 5
                }} placeholderTextColor='#24394d' placeholder= 'Phone' value={this.state.phone} onChangeText={this._handleChange('phone')} />
                <TouchableOpacity
                    onPress={this._saveProfile}
                    style={{
                        padding: 8,
                        backgroundColor: '#294158',
                        marginTop: 12,
                        borderRadius: 7
                    }}>
                    <Text style={{
                        color:'#d6dce2'
                    }}> Save </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this._signout}
                    style={{
                        padding: 8,
                        marginTop: 14,
                        backgroundColor: '#ff5065',
                        borderRadius: 7
                    }}>
                    <Text style={{
                        color: '#d6dce2'
                    }}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

export default Profile
