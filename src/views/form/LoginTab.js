import {
    Image, Text, View,
    TouchableHighlight,
    TextInput, Keyboard,
    TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import styles from '../../styles/all.style';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { storageMMKV } from '../../storage/storageMMKV';
import Toast from 'react-native-toast-message';
import { onAxiosPost } from '../../api/axios.function';

export default function LoginTab(route) {
    const navigation = useNavigation();
    const [passToggle, setpassToggle] = useState(true);
    const [rememberMe, setrememberMe] = useState(false);
    const [inputUsername, setinputUsername] = useState(route.user);
    const [inputPassword, setinputPassword] = useState("");

    function onChangePassToggle() {
        if (passToggle == true) {
            setpassToggle(false);
        } else {
            setpassToggle(true);
        }
    }

    function onChangeRememberMe() {
        if (rememberMe == true) {
            setrememberMe(false);
        } else {
            setrememberMe(true);
        }
    }

    function onChangeTab() {
        route.callback(inputUsername);
    }

    function checkValidate() {
        if (inputUsername == "") {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Tên đăng nhập không được trống!',
                bottomOffset: 20,
            });
            return false;
        }

        if (inputPassword == "") {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Mật khẩu không được trống!',
                bottomOffset: 20,
            });
            return false;
        }
        return true;
    }

    async function onSignIn() {
        var newShop = {
            userName: inputUsername,
            passWord: inputPassword
        }

        if (checkValidate() == false) {
            return;
        }

        Keyboard.dismiss();
        Toast.show({
            type: 'loading',
            position: 'top',
            text1: 'Đang đăng nhập...',
            bottomOffset: 20,
            autoHide: false
        });

        const response = await onAxiosPost('shop/login', newShop, "Json", true);
        if (response) {
            storageMMKV.setValue('login.token', String(response.token));
            if (rememberMe) {
                storageMMKV.setValue('login.isLogin', true);
            } else {
                storageMMKV.setValue('login.isLogin', false);
            }
            if (storageMMKV.getString('login.token') == String(response.token)) {
                Toast.hide();
                if (response.data.shopStatus == 0) {
                    navigation.replace('ConfirmedShop');
                } else {
                    navigation.replace('NaviTabScreen');
                }
            }
        }
    }

    return (
        <View style={[styles.container, styles.formContainer]}>
            <Image style={{ position: 'absolute', right: 0 }}
                source={require('../../assets/images/form/topRightPaw.png')} />
            <Image style={[styles.pawBottomLeft, styles.positionAbsolute]}
                source={require('../../assets/images/form/bottomLeftPaw.png')} />
            <View style={{ marginTop: 75 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.textDarkBlue, styles.textEnable]}>Đăng nhập</Text>
                    <Text style={[styles.slash, styles.textDarkBlue]}>/</Text>
                    <TouchableHighlight
                        activeOpacity={0.5} underlayColor="#F3D2C1"
                        onPress={onChangeTab}>
                        <Text style={[styles.textDarkBlue, styles.textDisableLogin]}>Đăng ký</Text>
                    </TouchableHighlight>
                </View>

                <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 5 }}>
                    <Text style={[styles.textDarkBlue, styles.textLeftGreetingLI]}>Chào mừng</Text>
                    <Text style={[styles.textDarkBlue, styles.textRightGreeting]}> bạn trở lại!</Text>
                </View>

                <View style={{ marginTop: 30 }}>
                    <View>
                        <Text style={[{
                            color: 'rgba(0, 24, 88, 0.80)',
                        }, styles.titleInput]}>Tên đăng nhập</Text>
                        <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown]} value={inputUsername}
                            onChangeText={(input) => { setinputUsername(input) }} />
                    </View>
                    <View>
                        <Text style={[{
                            color: 'rgba(0, 24, 88, 0.80)',
                        }, styles.titleInput]}>Mật khẩu</Text>
                        <View>
                            <TextInput style={[styles.textInputPass, styles.bgLightBrown, styles.textDarkBlue]}
                                secureTextEntry={passToggle} value={inputPassword}
                                onChangeText={(input) => { setinputPassword(input) }} />
                            {
                                (passToggle)
                                    ?
                                    <TouchableOpacity style={styles.togglePassword}
                                        onPress={onChangePassToggle}>
                                        <Entypo name='eye' color={'#001858'} size={22} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.togglePassword}
                                        onPress={onChangePassToggle}>
                                        <Entypo name='eye-with-line' color={'#001858'} size={22} />
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            {
                                (rememberMe)
                                    ?
                                    <TouchableOpacity style={styles.checkboxRM}
                                        onPress={onChangeRememberMe}>
                                        <Feather name='check-square' color={'#001858'} size={20} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.checkboxRM}
                                        onPress={onChangeRememberMe}>
                                        <Feather name='square' color={'#001858'} size={20} />
                                    </TouchableOpacity>
                            }
                            <Text style={[{
                                color: '#001858',
                            }, styles.titleInput]}>Ghi nhớ tôi?</Text>
                        </View>
                        <TouchableHighlight onPress={() => { navigation.navigate('ForgetPassword') }}
                            activeOpacity={0.5} underlayColor="#00185830" style={{ marginTop: 15 }}>
                            <Text style={{
                                color: '#001858', textDecorationLine: 'underline',
                                fontSize: 15, fontFamily: 'ProductSans',
                            }}>Quên mật khẩu?</Text>
                        </TouchableHighlight>
                    </View>

                    <TouchableHighlight style={[styles.buttonConfirmFullPink, styles.bgPinkLotus, styles.itemsCenter, { marginTop: 45 }]}
                        activeOpacity={0.5} underlayColor="#DC749C"
                        onPress={onSignIn}>
                        <Text style={[styles.textButtonConfirmFullPink, styles.textYellowWhite]}>Đăng nhập</Text>
                    </TouchableHighlight>

                </View>
            </View>
        </View>
    );
}
