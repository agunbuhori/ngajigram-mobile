import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'native-base';

import HomeScreen from './menu/HomeScreen';


const MenuIcon = (props) => ({
    render() {
        return <Icon type="Entypo" name={this.props.icon} style={[{ color: this.props.tintColor }, styles.bottomTabIcon]} />
    }
});

const MenuNavigator = createBottomTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            tabBarLabel: "Home",
            tabBarIcon: ({ tintColor }) => (
                <MenuIcon tintColor={tintColor} icon="home" />
            )
        }
    }
});


const styles = StyleSheet.create({
    bottomTabIcon: {
        fontSize: 24
    }
});

export default MenuNavigator;