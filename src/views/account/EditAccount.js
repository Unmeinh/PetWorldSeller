import React, { useState, memo } from 'react';
import {
    Pressable,
    Text, View,
    TextInput,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import HeaderTitle from '../../components/header/HeaderTitle';
import { useNavigation } from '@react-navigation/native';
import styles, { yellowWhite } from '../../styles/all.style';
import { onAxiosDelete, onAxiosPut, onAxiosPost } from '../../api/axios.function';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { onSendOTPbyPhoneNumber } from '../../utils/functionSupport';
import Toast from 'react-native-toast-message';
import PhoneSelect from '../../components/modals/PhoneSelect';
import ShimmerPlaceHolder from '../../components/layout/ShimmerPlaceHolder';
import { onGoBack, onNavigate } from '../../navigation/rootNavigation';

const infoKeys = ["hotline", "email"];
const infoTypes = ["số liên hệ", "email"];
const infoNames = ["Số liên hệ", "Email"];

const EditAccount = ({ route }) => {
    var navigation = useNavigation();
    const infoLogin = route.params.shop;
    const [inputValue, setinputValue] = useState("");
    const [inputOTP, setinputOTP] = useState("");
    const [cdSendAgain, setcdSendAgain] = useState(0);
    const [isVerified, setisVerified] = useState(false);
    const [oldValueDisplay, setoldValueDisplay] = useState("");
    const [isLoader, setisLoader] = useState(true);
    const [isChangeAccount, setisChangeAccount] = useState(false);
    const [inputPhoneCountry, setinputPhoneCountry] = useState('+84');
    const [isShowPhoneSelect, setisShowPhoneSelect] = useState(false);
    const [widthPhoneSelect, setwidthPhoneSelect] = useState(0);

    const onLayoutPhoneSelect = (event) => {
        const { x, y, height, width } = event.nativeEvent.layout;
        setwidthPhoneSelect(width);
    }

    function onInputPhoneCountry(input) {
        setinputPhoneCountry(input);
        setisShowPhoneSelect(false);
    }

    function onChangeInputValue(input) {
        setinputValue(input);
    }

    function onChangeAccount() {
        setisChangeAccount(!isChangeAccount);
    }

    async function updatePhoneNumber() {
        let res = await onAxiosPut('shop/updateAccount', { typeInfo: infoKeys[route.params.infoType], valueUpdate: inputPhoneCountry + inputValue }, 'json', true);
        if (res && res.success) {
            onNavigate('AccountManager');
        }
    }

    async function onSendVerify() {
        let regEmail = /^(\w+@[a-zA-Z]+\.[a-zA-Z]{2,})$/;
        if (!inputValue.match(regEmail)) {
            Toast.show({
                type: 'error',
                text1: 'Email cần đúng định dạng: abc@def.xyz!',
                position: 'top'
            })
            return;
        }
        if (!isVerified) {
            setcdSendAgain(30);
            await onAxiosPost('shop/sendVerifyCodeEmail', { email: inputValue }, 'json', true);
        } else {
            Toast.show({
                type: 'success',
                text1: 'Email đã được xác minh.',
                position: 'top'
            })
        }
    }

    async function onVerifyCode() {
        let regEmail = /^(\w+@[a-zA-Z]+\.[a-zA-Z]{2,})$/;
        if (!inputValue.match(regEmail)) {
            Toast.show({
                type: 'error',
                text1: 'Email cần đúng định dạng: abc@def.xyz!',
                position: 'top'
            })
            return;
        }

        if (inputOTP.trim() == "") {
            Toast.show({
                type: 'error',
                text1: 'Mã xác minh không được để trống!',
                position: 'top'
            })
            return;
        }

        if (inputOTP.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Mã xác minh cần dài 6 số!',
                position: 'top'
            })
            return;
        }

        if (isNaN(inputOTP)) {
            Toast.show({
                type: 'error',
                text1: 'Mã xác minh cần là 6 số!',
                position: 'top'
            })
            return;
        }

        if (!isVerified) {
            let res = await onAxiosPost('shop/verifyCodeEmail', { email: inputValue, otp: inputOTP }, 'json', true);
            if (res) {
                setisVerified(true);
            } else {
                setisVerified(false);
            }
        } else {
            Toast.show({
                type: 'success',
                text1: 'Email đã được xác minh.',
                position: 'top'
            })
        }
    }

    function onShowAlert() {
        if (route.params.infoType == 0) {
            var regPhone = /^\+([0-9]{9,})$/;
            if (!(inputPhoneCountry + inputValue).match(regPhone)) {
                Toast.show({
                    type: 'error',
                    text1: 'Số liên hệ cần đúng định dạng!\nVí dụ: +123456789',
                    position: 'top',
                })
                return;
            }
            if ((inputPhoneCountry.replace("+", "") + inputValue) == infoLogin.hotline) {
                Toast.show({
                    type: 'error',
                    text1: 'Số liên hệ mới không thể trùng với số hiện tại!',
                    position: 'top',
                })
                return;
            }
        } else {
            var regEmail = /^(\w+@[a-zA-Z]+\.[a-zA-Z]{2,})$/;
            if (!inputValue.match(regEmail)) {
                Toast.show({
                    type: 'error',
                    text1: 'Email cần đúng định dạng!\nVí dụ: abc@def.xyz',
                    position: 'top',
                })
                return;
            }
        }
        Toast.show({
            type: 'alert',
            position: 'top',
            text1: 'Xác nhận thay đổi ' + infoTypes[route.params.infoType] + '?',
            autoHide: false,
            props: {
                confirm: () => onUpdateAccount(),
                cancel: () => {
                    Toast.hide();
                }
            }
        })
    }

    async function onUpdateAccount() {
        Toast.show({
            type: 'loading',
            text1: "Đang cập nhật " + infoTypes[route.params.infoType] + "...",
            autoHide: false,
            position: 'top'
        });
        if (route.params.infoType == 0) {
            const response = await onSendOTPbyPhoneNumber(inputPhoneCountry + inputValue);
            if (response != undefined && response.success) {
                setTimeout(() => {
                    onNavigate('ConfirmOTP', { function: () => updatePhoneNumber(), typeVerify: 'phoneNumber', valueVerify: inputPhoneCountry + inputValue, authConfirm: response.confirm })
                }, 500)
            } else {
                // setisDisableRequest(false);
            }
        } else {
            let res = await onAxiosPut('shop/updateAccount', { typeInfo: infoKeys[route.params.infoType], valueUpdate: inputValue }, 'json', true);
            if (res != undefined && res && res.success) {
                onGoBack();
            }
        }
    }

    React.useEffect(() => {
        if (infoLogin) {
            switch (route.params.infoType) {
                case 0:
                    setoldValueDisplay("+" + infoLogin?.hotline);
                    break;
                case 1:
                    setoldValueDisplay(infoLogin?.email);
                    if (infoLogin?.email == "Chưa thiết lập") {
                        setisChangeAccount(true);
                    }
                    break;

                default:
                    break;
            }
            setisLoader(false);
        }
    }, [infoLogin]);

    React.useEffect(() => {
        if (cdSendAgain > 0) {
            setTimeout(() => {
                var cd = cdSendAgain - 1;
                setcdSendAgain(cd);
            }, 1000)
        }
    }, [cdSendAgain]);

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            // setisLoader(true);

            // return navigation.remove();
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <HeaderTitle nav={navigation} titleHeader={"Chỉnh sửa " + infoTypes[route.params.infoType]}
                colorHeader={"#FEF6E4"} />
            {
                (isLoader)
                    ?
                    <View style={{ paddingHorizontal: 20, paddingTop: 15 }}>
                        <View style={styles.itemEditInfo}>
                            <ShimmerPlaceHolder
                                shimmerStyle={[styles.titleItemEditInfo, { height: 22, width: '35%', borderRadius: 5 }]} />
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                <Text style={[styles.textItemEditInfo, { fontSize: 18 }]}>{'> '}</Text>
                                <ShimmerPlaceHolder
                                    shimmerStyle={[styles.textItemEditInfo, { height: 17, width: '30%', borderRadius: 5, marginLeft: 8 }]} />
                            </View>
                        </View>
                        <View style={styles.itemEditInfo}>
                            <ShimmerPlaceHolder
                                shimmerStyle={[styles.titleItemEditInfo, { height: 22, width: '35%', borderRadius: 5 }]} />
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                <Text style={[styles.textItemEditInfo, { fontSize: 18 }]}>{'>'}</Text>
                                <ShimmerPlaceHolder
                                    shimmerStyle={{ height: 20, width: '93%', borderRadius: 15, marginTop: 3, marginLeft: 10 }} />
                            </View>
                        </View>
                        <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginTop: 25 }}>
                            <ShimmerPlaceHolder
                                shimmerStyle={{ height: 27, width: 80, borderRadius: 10, marginLeft: 10 }} />
                            <ShimmerPlaceHolder
                                shimmerStyle={{ height: 27, width: 80, borderRadius: 10, marginLeft: 10 }} />
                        </View>
                    </View>
                    : <Pressable style={{ flex: 1, paddingTop: 15 }}
                        onPress={() => {
                            setisShowPhoneSelect(false);
                        }}>
                        {
                            (infoLogin != undefined)
                                ? <View style={{ paddingHorizontal: 20, marginTop: 5 }}>
                                    <View style={styles.itemEditInfo}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.titleItemEditInfo}>
                                                {infoNames[route.params.infoType]} hiện tại:
                                            </Text>
                                            <View>
                                                <View style={styles.titleItemVerify}>
                                                    <Ionicons name='checkmark-circle' color={'#55B938'} size={13} />
                                                    <Text style={[styles.textItemEditInfo, { marginLeft: 2, marginTop: 0, fontSize: 13, color: '#55B938' }]}>
                                                        Đã xác minh
                                                    </Text>
                                                </View>
                                            </View>
                                            {/* {
                                                (route?.params?.infoType == 0)
                                                    ? <View style={styles.titleItemVerify}>
                                                        <Ionicons name='checkmark-circle' color={'#55B938'} size={13} />
                                                        <Text style={[styles.textItemEditInfo, { marginLeft: 2, marginTop: 0, fontSize: 13, color: '#55B938' }]}>
                                                            Đã xác minh
                                                        </Text>
                                                    </View>
                                                    : <View>
                                                        {
                                                            (infoLogin?.isVerifyEmail == 0)
                                                                ? <View style={styles.titleItemVerify}>
                                                                    <Ionicons name='checkmark-circle' color={'#55B938'} size={13} />
                                                                    <Text style={[styles.textItemEditInfo, { marginLeft: 2, marginTop: 0, fontSize: 13, color: '#55B938' }]}>
                                                                        Đã xác minh
                                                                    </Text>
                                                                </View>
                                                                : <View style={styles.titleItemVerify}>
                                                                    <Ionicons name='close-circle' color={'#D65745'} size={13} />
                                                                    <Text style={[styles.textItemEditInfo, { marginLeft: 2, marginTop: 0, fontSize: 13, color: '#D65745' }]}>
                                                                        Chưa xác minh
                                                                    </Text>
                                                                </View>
                                                        }
                                                    </View>
                                            } */}
                                        </View>
                                        <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                            <Text style={[styles.textItemEditInfo, { fontSize: 18 }]}>{'> '}</Text>
                                            <Text style={[styles.textItemEditInfo, { marginLeft: 8 }]}>
                                                {oldValueDisplay}
                                            </Text>
                                        </View>
                                    </View>

                                    {
                                        (isChangeAccount)
                                            ?
                                            <>
                                                <View style={styles.itemEditInfo}>
                                                    <View style={styles.flexRow}>
                                                        <Text style={styles.titleItemEditInfo}>
                                                            {infoNames[route.params.infoType]} mới:
                                                        </Text>
                                                        {
                                                            (isVerified)
                                                                ? <View>
                                                                    <View style={styles.titleItemVerify}>
                                                                        <Ionicons name='checkmark-circle' color={'#55B938'} size={13} />
                                                                        <Text style={[styles.textItemEditInfo, { marginLeft: 2, marginTop: 0, fontSize: 13, color: '#55B938' }]}>
                                                                            Đã xác minh
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                                : ""
                                                        }
                                                    </View>
                                                    {
                                                        (route.params.infoType == 0)
                                                            ? <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', top: -8, }}>
                                                                <Text style={[styles.textItemEditInfo, { fontSize: 18 }]}>{'>'}</Text>
                                                                <View>
                                                                    <View style={styles.inputPhoneEditInfo}
                                                                        onLayout={onLayoutPhoneSelect}>
                                                                        <Pressable onPress={() => {
                                                                            setisShowPhoneSelect(true);
                                                                        }}>
                                                                            <TextInput style={styles.inputPhoneCountryInfo}
                                                                                value={inputPhoneCountry}
                                                                                editable={false} />
                                                                        </Pressable>
                                                                        <TextInput style={styles.inputPhoneValueInfo} placeholder='Nhập dữ liệu...'
                                                                            placeholderTextColor={'#A0A0A0'}
                                                                            keyboardType='number-pad' value={inputValue}
                                                                            onChangeText={onChangeInputValue}
                                                                        />
                                                                        <FontAwesome name='sort-down' style={styles.dropdownSelect}
                                                                            color={'#00185880'} size={13} />
                                                                    </View>
                                                                    <PhoneSelect isShow={isShowPhoneSelect} callBack={onInputPhoneCountry}
                                                                        width={widthPhoneSelect} />
                                                                </View>
                                                            </View>
                                                            : <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                                                <Text style={[styles.textItemEditInfo, { fontSize: 18 }]}>{'>'}</Text>
                                                                <TextInput style={styles.inputEditInfo} placeholder='Nhập dữ liệu...'
                                                                    placeholderTextColor={'#A0A0A0'}
                                                                    value={inputValue} onChangeText={onChangeInputValue}
                                                                    inputMode={(route.params.infoType == 0) ? 'numeric' : 'email'}
                                                                    onLayout={onLayoutPhoneSelect} editable={!isVerified} />
                                                            </View>
                                                    }
                                                </View>
                                                {
                                                    (route.params.infoType == 0)
                                                        ? ""
                                                        :
                                                        <View style={styles.itemEditInfo}>
                                                            <View style={styles.flexRow}>
                                                                <Text style={styles.titleItemEditInfo}>
                                                                    Mã xác minh:
                                                                </Text>
                                                                {
                                                                    (isVerified)
                                                                        ? ""
                                                                        :
                                                                        <TouchableOpacity onPress={onSendVerify} disabled={(cdSendAgain == 0) ? false : true}
                                                                            style={{ marginLeft: 10, marginTop: 4 }}>
                                                                            <Text style={[styles.textDetailFormRed, { fontSize: 15, margin: 0, color: '#4285F4', }]}>
                                                                                <Text style={{ textDecorationLine: 'underline' }}>Gửi mã?</Text> {(cdSendAgain == 0) ? "" : "(" + cdSendAgain + ")"}
                                                                            </Text>
                                                                        </TouchableOpacity>
                                                                }
                                                            </View>
                                                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                                                <Text style={[styles.textItemEditInfo, { fontSize: 18 }]}>{'>'}</Text>
                                                                <TextInput style={styles.inputEditInfo} placeholder='Nhập mã...'
                                                                    value={inputOTP} onChangeText={setinputOTP}
                                                                    inputMode={'numeric'} maxLength={6} editable={!isVerified} />
                                                                {
                                                                    (isVerified)
                                                                        ? ""
                                                                        : <TouchableOpacity onPress={onVerifyCode} disabled={(cdSendAgain == 0) ? false : true}
                                                                            style={{ position: 'absolute', right: '7%', top: '20%', backgroundColor: '#4285F4', borderRadius: 5, borderWidth: 1, paddingHorizontal: 5, paddingVertical: 3, zIndex: 10, }}>
                                                                            <Text style={[styles.textDetailFormRed, { fontSize: 15, margin: 0, color: yellowWhite }]}>
                                                                                Xác minh
                                                                            </Text>
                                                                        </TouchableOpacity>
                                                                }
                                                            </View>
                                                        </View>
                                                }
                                                <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginTop: 25 }}>
                                                    <TouchableHighlight style={[styles.buttonFormSmall, { backgroundColor: '#8E8E8E' }]}
                                                        activeOpacity={0.5} underlayColor="#6D6D6D"
                                                        onPress={onGoBack}>
                                                        <Text style={[styles.textButtonFormSmall, { fontSize: 13 }]}>Quay lại</Text>
                                                    </TouchableHighlight>
                                                    <TouchableHighlight style={[styles.buttonFormSmall, { backgroundColor: '#F582AE' }]}
                                                        activeOpacity={0.5} underlayColor="#DC749C"
                                                        onPress={onShowAlert}>
                                                        <Text style={[styles.textButtonFormSmall, { fontSize: 13 }]}>Xác nhận</Text>
                                                    </TouchableHighlight>
                                                </View>
                                            </>
                                            :
                                            <>
                                                {
                                                    (route.params.infoType == 0)
                                                        ? <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#F582AE' }]}
                                                            activeOpacity={0.5} underlayColor="#DC749C"
                                                            onPress={onChangeAccount}>
                                                            <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#001858', fontWeight: 'normal' }]}>
                                                                Thay đổi số điện thoại mới
                                                            </Text>
                                                        </TouchableHighlight>
                                                        :
                                                        <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#F582AE' }]}
                                                            activeOpacity={0.5} underlayColor="#DC749C"
                                                            onPress={onChangeAccount}>
                                                            <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#001858', fontWeight: 'normal' }]}>
                                                                Thay đổi địa chỉ email mới
                                                            </Text>
                                                        </TouchableHighlight>
                                                }
                                            </>
                                    }
                                </View>
                                : ""
                        }
                    </Pressable>
            }
        </View>
    );
}


export default memo(EditAccount);