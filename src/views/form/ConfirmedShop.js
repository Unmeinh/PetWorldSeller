import {
    Text, View,
    TouchableHighlight,
    Image
} from 'react-native'
import React, { useState } from 'react'
import styles from '../../styles/all.style';
import { storageMMKV } from '../../storage/storageMMKV';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';

export default function ConfirmedShop() {
    const navigation = useNavigation();

    function onGoToLogin() {
        storageMMKV.setValue('login.token', "");
        storageMMKV.setValue('login.isLogin', false);
        navigation.replace('LoginScreen');
    }

    async function getToken() {
        let token = await messaging().getToken();
        if (token) {
            await sendTokenToFirebase(token);
        } else {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: 'Có lỗi xảy ra trong lúc gửi yêu cầu!\nVui lòng thử lại sau!'
            });
        }
    }

    const sendTokenToFirebase = async (newToken) => {
        try {
            const databaseRef = database().ref('/sellerTokens');
            const tokenData = {
                token: newToken,
            };
            await databaseRef.push(tokenData);
            storageMMKV.setValue('hasSentToken', true);
            storageMMKV.setValue('tokenDevice', newToken);
            if (storageMMKV.getString('login.token')) {
                let res = await onAxiosPost('shop/autoLogin', {
                    tokenDevice: newToken
                }, 'json');
                if (res) {
                    if (res?.data.isApproved == 1) {
                        navigation.replace('NaviTabScreen');
                    }
                    if (res?.data.isApproved == -1) {
                        navigation.replace('DeniedShop');
                    }
                } else {
                    storageMMKV.setValue('login.token', "");
                }
            }
        } catch (error) {
            console.error('Lỗi khi gửi token đến Firebase:', error);
        }
    };

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            const hasSentToken = storageMMKV.getBoolean('hasSentToken');
            const tokenDevice = storageMMKV.getString('tokenDevice');
            if (!hasSentToken) {
                getToken();
            } else {
                if (!tokenDevice) {
                    getToken();
                }
            }
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    return (
        <View style={{ backgroundColor: '#FEF6E4', flex: 1 }}>
            <View style={[styles.container, styles.formContainer]}>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/gifs/catWaiting.gif')}
                        style={{ width: '30%', aspectRatio: 1 / 1 }}
                    />
                </View>

                <Text style={[styles.titleDetailForm, styles.textDarkBlue, { fontWeight: 'bold', marginBottom: 15, marginTop: 0 }]}>
                    Đơn đăng ký của bạn đã được gửi và chờ được phê duyệt.{'\n\n'}
                    Chúng tôi sẽ phản hồi đơn đăng ký của bạn trong thời gian sớm nhất có thể.{'\n\n'}
                    Cảm ơn bạn đã tin tưởng ứng dụng của chúng tôi!
                </Text>

                <TouchableHighlight style={[styles.buttonConfirmFullPink, styles.bgPinkLotus, styles.itemsCenter, { marginTop: 35 }]}
                    activeOpacity={0.5} underlayColor="#DC749C"
                    onPress={onGoToLogin}>
                    <Text style={[styles.textButtonConfirmFullPink, styles.textYellowWhite]}>Trở về đăng nhập</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}