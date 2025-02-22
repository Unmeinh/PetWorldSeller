import {
    Image, Text, View,
    TouchableHighlight,
    TextInput, Pressable,
    ToastAndroid, Keyboard
} from 'react-native';
import React, { useState } from 'react';
import styles from '../../styles/all.style';
import PhoneSelect from '../../components/modals/PhoneSelect';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { onSendOTPbyPhoneNumber } from '../../utils/functionSupport';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { onAxiosPost } from '../../api/axios.function';

export default function RegisterTab(route) {
    const navigation = useNavigation();
    const [inputPhoneCountry, setinputPhoneCountry] = useState('+84');
    const [inputUsername, setinputUsername] = useState(route.user);
    const [inputNameShop, setinputNameShop] = useState("");
    const [inputPhoneNumber, setinputPhoneNumber] = useState("");
    const [isShowPhoneSelect, setisShowPhoneSelect] = useState(false);
    const [widthPhoneSelect, setwidthPhoneSelect] = useState(0);

    function onChangeTab() {
        route.callback(inputUsername);
    }

    function checkValidate() {
        var regPhone = /^(\+\d{9,})$/;
        if (inputUsername.trim() == "") {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Tên đăng nhập không được trống!',
            });
            return false;
        }

        if (inputNameShop.trim() == "") {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Tên shop không được trống!'
            });
            return false;
        }

        if (!(inputPhoneCountry + inputPhoneNumber).match(regPhone)) {
            Toast.show({
                type: 'error',
                text1: 'Số điện thoại cần đúng định dạng!\nVí dụ: +123456789',
                position: 'top',
            })
            return false;
        }

        return true;
    }

    async function onSignUp() {
        if (checkValidate() == false) {
            return;
        }
        Keyboard.dismiss();
        Toast.show({
            type: 'loading',
            position: 'top',
            text1: "Đang gửi mã xác minh...",
            bottomOffset: 20,
            autoHide: false
        });

        var phoneCountry = inputPhoneCountry.replace(/\D/g, '');
        var newShop = {
            userName: inputUsername,
            nameShop: inputNameShop,
            hotline: phoneCountry + inputPhoneNumber,
        }

        var res = await onAxiosPost('/shop/checkPhoneNumber', { userName: newShop.userName, hotline: newShop.hotline }, 'json', true);
        if (res) {
            const response = await onSendOTPbyPhoneNumber(inputPhoneCountry + inputPhoneNumber);
            if (response != undefined && response.success) {
                try {
                    setTimeout(() => {
                        navigation.navigate('ConfirmOTP', { navigate: "RegisterShop", objShop: newShop, typeVerify: 'phoneNumber', valueVerify: inputPhoneCountry + inputPhoneNumber, authConfirm: (code) => response.confirm.confirm(code) })
                    }, 500)
                } catch (error) {
                    console.log(error);
                }
            } 
        } 
    }

    function onInputPhoneNumber(input) {
        var phoneNUM = input.replace(/\D/g, '');
        setinputPhoneNumber(phoneNUM);
    }

    function onInputPhoneCountry(input) {
        setinputPhoneCountry(input);
        setisShowPhoneSelect(false);
    }

    const onLayoutPhoneSelect = (event) => {
        const { x, y, height, width } = event.nativeEvent.layout;
        setwidthPhoneSelect(width);
    }

    return (
        <Pressable style={[styles.container, styles.formContainer]} onPress={() => {
            if (isShowPhoneSelect) {
                setisShowPhoneSelect(false);
            }
        }}>
            <Image style={styles.positionAbsolute}
                source={require('../../assets/images/form/topLeftPaw.png')} />
            <Image style={[styles.pawBottomRight, styles.positionAbsolute]}
                source={require('../../assets/images/form/bottomRightPaw.png')} />
            <View style={{ marginTop: 75 }}>
                <View style={[styles.flexRow, styles.itemsCenter]}>
                    <TouchableHighlight
                        activeOpacity={0.5} underlayColor="#F3D2C1"
                        onPress={onChangeTab}>
                        <Text style={[styles.textDarkBlue, styles.textDisableLogin]}>Đăng nhập</Text>
                    </TouchableHighlight>
                    <Text style={[styles.slash, styles.textDarkBlue]}>/</Text>
                    <Text style={[styles.textDarkBlue, styles.textEnable]}>Đăng ký</Text>
                </View>

                <View style={{ flexDirection: 'row', marginLeft: 20, marginTop: 5 }}>
                    <Text style={[styles.textDarkBlue, styles.textLeftGreetingSI]}>Bắt đầu</Text>
                    <Text style={[styles.textDarkBlue, styles.textRightGreeting]}> hoạt động của bạn!</Text>
                </View>
            </View>

            <View style={{ marginTop: 30 }}>
                <View>
                    <Text style={[{
                        color: 'rgba(0, 24, 88, 0.80)',
                    }, styles.titleInput]}>Tên đăng nhập</Text>
                    <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown, styles.textDarkBlue, styles.bgLightBrown]} value={inputUsername}
                        onChangeText={(input) => { setinputUsername(input) }} />
                </View>
                <View>
                    <Text style={[{
                        color: 'rgba(0, 24, 88, 0.80)',
                    }, styles.titleInput]}>Tên shop</Text>
                    <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown, styles.textDarkBlue, styles.bgLightBrown]} value={inputNameShop}
                        onChangeText={(input) => { setinputNameShop(input) }} />
                </View>
                <Text style={[{
                    color: 'rgba(0, 24, 88, 0.80)',
                }, styles.titleInput]}>Số điện thoại</Text>
                <View>
                    <View style={[styles.viewInputSelectPhone, styles.bgLightBrown, styles.flexRow, styles.bgLightBrown, styles.flexRow, { marginLeft: 0 }]}
                        onLayout={onLayoutPhoneSelect}>
                        <Pressable onPress={() => {
                            setisShowPhoneSelect(true);
                        }}>
                            <TextInput style={[styles.textInputPhoneCountry, styles.textDarkBlue, styles.bgLightBrown]}
                                value={inputPhoneCountry}
                                editable={false} />
                        </Pressable>
                        <TextInput style={[styles.textInputPhoneNumber, styles.textDarkBlue, styles.bgLightBrown]}
                            keyboardType='number-pad' value={inputPhoneNumber}
                            onChangeText={(input) => { onInputPhoneNumber(input) }}
                        />
                        <FontAwesome name='sort-down' style={styles.dropdownSelectPhone}
                            color={'#00185880'} size={13} />
                    </View>
                    <PhoneSelect isShow={isShowPhoneSelect} callBack={onInputPhoneCountry}
                        width={widthPhoneSelect} />
                </View>

                <TouchableHighlight style={[styles.buttonConfirmFullPink, styles.bgPinkLotus, styles.itemsCenter, { marginTop: 45 }]}
                    activeOpacity={0.5} underlayColor="#DC749C"
                    onPress={onSignUp}>
                    <Text style={[styles.textButtonConfirmFullPink, styles.textYellowWhite]}>Đăng ký</Text>
                </TouchableHighlight>

            </View>
        </Pressable>
    );
}
