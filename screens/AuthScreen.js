import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, AsyncStorage, TouchableOpacity } from 'react-native';
import { Container, Form, Item as FormItem, Input, View, Icon, Button, Text } from 'native-base';
import ScalableImage from 'react-native-scalable-image';
import { env } from '../global';

export default class AuthScreen extends Component {
    state = {
        page: 1,
        username: null,
        password: null,
        loginFailed: false,
        processing: false,
        login: this.login.bind(this)
    }

    async login() {
        this.setState({ processing: true, loginFailed: false });

        await fetch(env.http.baseUrl + 'login', {
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
            this.setState({ processing: false });

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
            this.setState({ processing: false, loginFailed: true });
        });
    }

    _renderLogo() {
        return (
            <View style={styles.logo}>
                <ScalableImage width={env.dimensions.logoWidth} source={require('../assets/images/logo-img.png')}/>
                <ScalableImage width={env.dimensions.logoWidth} source={require('../assets/images/logo-text.png')}/>
            </View>
        );
    }

    renderSubmitButton(prop) {
        return (
            <Button disabled={this.state.processing || prop.disabled} style={styles.submitButton} block onPress={prop.submit}>
                {
                    this.state.processing
                    ? <ActivityIndicator color="white" />
                    : <Text style={{ fontWeight: 'bold' }}>{prop.text}</Text>
                }
            </Button>
        );
    }

    renderErrorMessage(message, show = false) {
        return show ? <Text style={styles.errorMessage}>{message}</Text> : null;
    }

    renderSwitchButton() {
        let question, pageTitle;

        if (this.state.page === 1) {
            question = "Tidak Memiliki Akun?";
            pageTitle = "Mendaftar";
            target = 2;
        } else {
            question = "Sudah Memiliki Akun?";
            pageTitle = "Masuk";
            target = 1;
        }

        return (
            <View style={styles.switchButton}>
                <Text>{question}</Text>
                <TouchableOpacity onPress={() => this.setState({ page: target })}>
                    <Text style={{fontWeight: 'bold'}}>{pageTitle}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderLoginForm() {
        return (
            <Form style={styles.form}>
                {this.renderErrorMessage('Gagal masuk', this.state.loginFailed)}

                <View style={styles.loginInput}>
                    <FormItem style={styles.formItem} regular icon>
                        <Icon type="Entypo" name="user" />
                        <Input disabled={this.state.processing} placeholder="Username" autoCapitalize="none" onChangeText={username => this.setState({ username })} />
                    </FormItem>

                    <FormItem style={{...styles.formItem, ...styles.lastLoginInput}} regular>
                        <Icon type="Entypo" name="lock" />
                        <Input disabled={this.state.processing} placeholder="Kata Sandi" secureTextEntry={true} onChangeText={password => this.setState({ password })} />
                    </FormItem>
                </View>

                {
                    this.renderSubmitButton({
                        text: 'MASUK',
                        disabled: this.state.username === null || this.state.password === null,
                        submit: this.state.login
                    })
                }

                { this.renderSwitchButton() }
            </Form>
        );
    }

    renderRegisterForm() {
        return (
            <Form style={styles.form}>
                <View style={styles.loginInput}>
                    <FormItem style={styles.formItem} regular icon>
                        <Icon type="Entypo" name="user" />
                        <Input disabled={this.state.processing} placeholder="Username" autoCapitalize="none" onChangeText={username => this.setState({ username })} />
                    </FormItem>

                    <FormItem style={{ ...styles.formItem, ...styles.lastLoginInput }} regular>
                        <Icon type="Entypo" name="lock" />
                        <Input disabled={this.state.processing} placeholder="Kata Sandi" secureTextEntry={true} onChangeText={password => this.setState({ password })} />
                    </FormItem>
                </View>

                {
                    this.renderSubmitButton({
                        text: 'MENDAFTAR',
                        disabled: this.state.username === null || this.state.password === null,
                        submit: this.state.login
                    })
                }

                {this.renderSwitchButton()}
            </Form>
        );
    }

    render() {
        return (
            <Container style={styles.container}>
                { this._renderLogo() }
                {
                    this.state.page === 1
                    ? this.renderLoginForm()
                    : this.renderRegisterForm()
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20
    },
    logo: {
        marginBottom: 20
    },
    form: {
        width: '100%',
    },
    loginInput: {
        borderColor: env.colors.border,
        borderWidth: 0.5,
        borderRadius: 5,
        overflow: 'hidden'
    },
    lastLoginInput: {
        borderTopWidth: 0.5,
        borderTopColor: env.colors.border
    },
    formItem: {
        marginLeft: 0,
        borderWidth: 0,
        borderColor: 'transparent',
        height: 45,
        backgroundColor: env.colors.backgroundSecondary
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: env.colors.primary,
        height: 50
    },
    errorMessage: {
        alignSelf: 'center',
        color: env.colors.red,
        fontSize: 14,
        marginBottom: 10
    },
    switchButton: {
        marginTop: 20,
        alignItems: 'center'
    }
})