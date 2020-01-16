import React, { useEffect } from 'react'

import { Provider } from 'react-redux'

import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings(['Setting a timer'])

import { Root } from 'native-base'

import { store, persistor } from './store'

import { PersistGate } from 'redux-persist/es/integration/react'

import 'react-native-gesture-handler'

import Route from './Routes'

export default function App() {

    return (
        <>
            <Root>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <Route />
                    </PersistGate>
                </Provider>
            </Root>
        </>
    )

}
