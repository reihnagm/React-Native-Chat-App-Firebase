import { combineReducers } from 'redux'

import auth from './auth'
import app from './app'
import listchat from './listchat'
import listcontact from './listcontact'

export default combineReducers({
    auth,
    app,
    listchat,
    listcontact
})
