import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Container, Form, Item, Text, Input, View, Button, Icon } from 'native-base';
import RadioForm from 'react-native-simple-radio-button';
import ScalableImage from 'react-native-scalable-image';
import { env, lib } from '../../global';

var radio_props = [
    { label: 'Laki-laki', value: 0 },
    { label: 'Perempuan', value: 1 }
];

export default class RegisterScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            contact: '',
            password: '',
            password_retype: '',
            gender: 0,
            registerStep: 1,
            password_length_error: false
        }
    }

    validate() {
        if (this.state.password.length < 6)
            this.setState({password_length_error: true});

    }

    async signup() {
        this.setState({isLoading: true});
    }

    rendersignupFailedMessage() {
        return <Text style={styles.signupFailedMessage}>Signup gagal</Text>
    }

    renderStep1() {
        return (
            <View>
                <View style={styles.inputWrapper}>
                    <Item regular style={styles.signupInput}>
                        <Icon type="Entypo" name="user" />
                        <Input placeholder="Nama Lengkap" keyboardType="default" value={this.state.name} autoCapitalize="words" onChangeText={name => this.setState({ name })} />
                    </Item>
                </View>

                <RadioForm
                    radio_props={radio_props}
                    initial={0}
                    animation={false}
                    buttonColor={env.colors.primary}
                    buttonInnerColor={env.colors.primary}
                    selectedButtonColor={env.colors.primary}
                    formHorizontal={true}
                    labelHorizontal={true}
                    labelStyle={{marginRight: 15}}
                    buttonSize={15}
                    onPress={(value) => { this.setState({ value: value }) }}
                ></RadioForm>

                <Button disabled={this.state.name === ''} block style={[styles.signupButton, { opacity: this.state.name === '' ? 0.7 : 1 }]} onPress={() => this.setState({registerStep: 2})}>
                    <Text style={{ fontWeight: 'bold' }}>SELANJUTNYA</Text>
                </Button>

                <View style={styles.loginButton}>
                    <Text>Sudah punya akun? </Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}><Text style={{ fontWeight: 'bold' }}>Login</Text></TouchableOpacity>
                </View>
            </View>
        );
    }

    renderStep2() {
        return (
            <View>
                <View style={styles.inputWrapper}>
                    <Item regular style={styles.signupInput}>
                        <Icon type="Entypo" name="phone" />
                        <Input placeholder="Nomor telepon" keyboardType="number-pad" maxLength={12} value={this.state.contact} onChangeText={contact => this.setState({ contact })} />
                    </Item>
                </View>

                { this.state.password_length_error ? <Text style={styles.signupFailedMessage}>Minimal 6 karakter</Text> : null }
                <View style={styles.inputWrapper}>
                    <Item regular style={styles.signupInput}>
                        <Icon type="Entypo" name="lock" />
                        <Input placeholder="Kata sandi (min 6 karakter)" value={this.state.password} secureTextEntry={true} onChangeText={password => this.setState({ password })} />
                    </Item>
                </View>

                <View style={styles.inputWrapper}>
                    <Item regular style={styles.signupInput}>
                        <Icon type="Entypo" name="lock" />
                        <Input placeholder="Ketik ulang kata sandi" value={this.state.password_retype} secureTextEntry={true} onChangeText={password_retype => this.setState({ password_retype })} />
                    </Item>
                </View>

                <Button disabled={this.state.contact.length < 6 
                    || this.state.contact == '' 
                    || this.state.password != this.state.password_retype 
                    || this.state.isLoading} block 
                    style={[styles.signupButton, {opacity: this.state.password.length < 6 || this.state.password != this.state.password_retype ? 0.7 : 1}]} onPress={this.signup.bind(this)}>
                    {
                        !this.state.isLoading
                            ?
                            <Text style={{ fontWeight: 'bold' }}>MENDAFTAR</Text>
                            :
                            <ActivityIndicator color="white" />
                    }
                </Button>
                {
                    this.state.registerStep === 1
                    ?
                    <View style={styles.loginButton}>
                        <Text>Sudah punya akun? </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}><Text style={{ fontWeight: 'bold' }}>Login</Text></TouchableOpacity>
                    </View>
                    :
                    <View style={styles.loginButton}>
                        <TouchableOpacity onPress={() => this.setState({registerStep: 1})}>
                            <Icon type="Entypo" name="chevron-with-circle-left"/>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }

    renderForm() {
        switch (this.state.registerStep) {
            case 1:
                return this.renderStep1();
                break;
            case 2:
                return this.renderStep2();
                break;
            default:
                return this.renderStep1();
                break;
        }
    }

    renderActivityIndicator() {
        return <ActivityIndicator size="large" color={env.colors.primary} />;
    }

    render() {
        return (
            <Container style={styles.container}>
                <Form style={styles.signupForm}>
                    <ScalableImage style={[styles.logo, { marginBottom: 15 }]} width={100} source={require('../../assets/images/avatar.png')} />

                    {this.renderForm()}
                </Form>
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
    signupForm: {
        width: '100%'
    },
    logo: {
        alignSelf: 'center'
    },
    inputWrapper: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: env.colors.border,
        marginBottom: 10,
        backgroundColor: env.colors.backgroundSecondary
    },
    signupInput: {
        backgroundColor: env.colors.backgroundSecondary,
        borderColor: 'transparent',
        paddingLeft: 5,
        paddingRight: 5,
        height: 44
    },
    signupButton: {
        borderRadius: 10,
        marginTop: 15,
        height: 50,
        backgroundColor: env.colors.primary
    },
    signupFailedMessage: {
        color: env.colors.red,
        alignSelf: 'center',
        marginBottom: 10
    },
    loginButton: {
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    intruction: {
        color: '#888',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    }
});