import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, TouchableOpacity, AsyncStorage } from 'react-native';
import { Container, Form, Item, Text, Input, View, Button, Icon } from 'native-base';
import ScalableImage from 'react-native-scalable-image';
import { env } from '../../global';

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            loginFailed: false,
            isLoading: false
        }
    }

    async login() {
        this.setState({ isLoading: true, loginFailed: false });

        await fetch(env.http.baseUrl+'login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }, 
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
        .then(response => response.json())
        .then(response => {
            this.setState({ isLoading: false });

            if (! response.token)
                this.setState({ loginFailed: true });
            else {
                AsyncStorage.setItem('AUTH_TOKEN', response.token);
                AsyncStorage.setItem('ACTIVE_USER', JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                }));
            }
                
        })
        .catch(error => {
            this.setState({ isLoading: false, loginFailed: true });
        });
    }

    renderLoginFailedMessage() {
        return <Text style={styles.loginFailedMessage}>Login gagal, username atau password salah</Text>
    }

    renderForm() {
        return (
            <Form style={styles.loginForm}>
                <ScalableImage style={styles.logo} width={100} source={require('../../assets/images/logo-img.png')} />
                <ScalableImage style={[styles.logo, {marginBottom: 15}]} width={120} source={require('../../assets/images/logo-text.png')} />

                { this.state.loginFailed ? this.renderLoginFailedMessage() : null }

                <View style={styles.inputWrapper}>
                    <Item regular style={[styles.loginInput, { borderBottomColor: env.colors.border, borderBottomWidth: 0.5 }]}>
                        <Icon type="Entypo" name="user" />
                        <Input placeholder="Username" value={this.state.username} autoCapitalize="none" onChangeText={username => this.setState({ username })} />
                    </Item>

                    <Item regular style={styles.loginInput}>
                        <Icon type="Entypo" name="lock" />
                        <Input placeholder="Password" secureTextEntry={true} onChangeText={password => this.setState({ password })} />
                    </Item>
                </View>

                <Button disabled={this.state.username === '' || this.state.password === '' || this.state.isLoading} block style={[styles.loginButton, {opacity: this.state.username === '' || this.state.password === '' ? 0.7 : 1}]} onPress={this.login.bind(this)}>
                    {
                        ! this.state.isLoading
                        ?
                        <Text style={{ fontWeight: 'bold' }}>MASUK</Text>
                        :
                        <ActivityIndicator color="white"/>
                    }
                </Button>
                    
                <View style={styles.signupButton}>
                    <Text>Tidak Memiliki Akun? </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}><Text style={{ fontWeight: 'bold' }}>Mendaftar</Text></TouchableOpacity>
                </View>
            </Form> 
        );
    }

    renderActivityIndicator() {
        return <ActivityIndicator size="large" color={env.colors.primary}/>;
    }

    render() {
        return (
            <Container style={styles.container}>
                {this.renderForm()}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: env.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },
    loginForm: {
        width: '100%'
    },
    logo: {
        alignSelf: 'center',
    },
    inputWrapper: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: env.colors.border,
        backgroundColor: env.colors.backgroundSecondary
    },
    loginInput: {
        backgroundColor: env.colors.backgroundSecondary,
        borderColor: 'transparent',
        paddingLeft: 5,
        paddingRight: 5,
        margin: 0,
        height: 44
    },
    loginButton: {
        borderRadius: 10,
        marginTop: 15,
        height: 50,
        backgroundColor: env.colors.primary
    },
    loginFailedMessage: {
        color: env.colors.red,
        alignSelf: 'center',
        marginBottom: 10,
        fontSize: 15
    },
    signupButton: {
        alignItems: 'center',
        marginTop: 15
    } 
});