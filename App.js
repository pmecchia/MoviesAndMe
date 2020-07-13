import React from 'react';
import {Provider} from 'react-redux'
import Navigation from './Navigation/Navigation'
import Store from './Store/configureStore'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react' //se charge de réhydrater ses components enfants

export default class App extends React.Component {
  render() {
    let persistor = persistStore(Store) //pour persister et récupérer le store persisté
    return (
      <Provider store={Store}>
        <PersistGate persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    )
  }
}
