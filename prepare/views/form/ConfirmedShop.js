import {
    Text, View,
    TouchableHighlight,
    Image
} from 'react-native'
import React, { useState } from 'react'
import styles from '../../styles/form.style';
import { onNavigate } from '../../navigation/rootNavigation';

export default function ConfirmedShop({ route }) {

    function onGoToLogin() {
        onNavigate('LoginScreen');
    }

    return (
        <View style={{ backgroundColor: '#FEF6E4', flex: 1 }}>
            <View style={styles.container}>
                <View style={{width: '100%', alignItems: 'center'}}>
                    <Image
                        source={require('../../assets/images/gifs/catWaiting.gif')}
                        style={{ width: '30%', aspectRatio: 1 / 1 }}
                    />
                </View>

                <Text style={[styles.titleDetailFull, { fontWeight: 'bold', marginBottom: 15, marginTop: 0 }]}>
                    Đơn đăng ký của bạn đã được gửi và chờ được phê duyệt.{'\n\n'}
                    Chúng tôi sẽ phản hồi đơn đăng ký của bạn trong thời gian sớm nhất có thể.{'\n\n'}
                    Cảm ơn bạn đã tin tưởng ứng dụng của chúng tôi!
                </Text>

                <TouchableHighlight style={[styles.buttonConfirm, { marginTop: 35 }]}
                    activeOpacity={0.5} underlayColor="#DC749C"
                    onPress={onGoToLogin}>
                    <Text style={styles.textButtonConfirm}>Trở về đăng nhập</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}