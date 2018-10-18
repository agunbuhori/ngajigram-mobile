import { createStackNavigator } from 'react-navigation';
import LoginScreen from './auth/LoginScreen';
import RegisterScreen from './auth/RegisterScreen';
import transition from 'agunbuhori-rn-transition';

const AuthNavigator = createStackNavigator({
    Login: {screen: LoginScreen, navigationOptions: {header: null}},
    Register: {screen: RegisterScreen, navigationOptions: {header: null}}
}, {
    transitionConfig: transition
});

export default AuthNavigator;