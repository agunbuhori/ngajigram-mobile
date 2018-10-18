import React, { Component } from 'react';
import { createSwitchNavigator } from 'react-navigation';

import AuthScreen from './screens/AuthScreen';

export default class App extends Component {
  render() {
    return <AuthScreen/>
  }
}