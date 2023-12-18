import {
    Text, View,
    TouchableHighlight,
    Image
} from 'react-native'
import React, { useState } from 'react'
import styles from '../../styles/all.style';
import { storageMMKV } from '../../storage/storageMMKV';
import { useNavigation } from '@react-navigation/native';

export default function DeniedShop() {
    const navigation = useNavigation();

    function onGoToLogin() {
        storageMMKV.setValue('login.token', "");
        storageMMKV.setValue('login.isLogin', false);
        navigation.replace('LoginScreen');
    }

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
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
                        source={require('../../assets/images/gifs/sad_cat.gif')}
                        style={{ width: '30%', aspectRatio: 1 / 1 }}
                    />
                </View>

                <Text style={[styles.titleDetailForm, styles.textDarkBlue, { fontWeight: 'bold', marginBottom: 15, marginTop: 0 }]}>
                    Đơn đăng ký của bạn đã bị từ chối.{'\n\n'}
                    Chúng tôi rất tiếc nhưng có một số lí do khiến chúng tôi từ chối đơn của bạn.{'\n\n'}
                    Mong bạn thông cảm cho chúng tôi!
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