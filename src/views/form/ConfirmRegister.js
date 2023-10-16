import {
    Text, View,
    TouchableHighlight,
} from 'react-native'
import React, { useState } from 'react'
import styles from '../../styles/all.style';
import HeaderTitle from '../../components/header/HeaderTitle';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { onNavigate } from '../../navigation/rootNavigation';
import { onAxiosPost } from '../../api/axios.function';

export default function ConfirmRegister({ route }) {
    let formData = route.params.formData;
    let objShop = route.params.objShop;
    const navigation = useNavigation();

    async function onRegister() {
        Toast.show({
            type: 'loading',
            text1: 'Đang gửi đơn đăng ký cửa hàng',
            position: 'top',
            autoHide: false
        })
        let res = await onAxiosPost('shop/register', formData, "formdata", true);
        if (res) {
            onNavigate("ConfirmedShop");
        }
    }

    return (
        <View style={{ backgroundColor: '#FEF6E4', flex: 1 }}>
            <HeaderTitle nav={navigation} titleHeader={'Xác nhận đăng ký'} colorHeader={'#FEF6E4'} />
            <View style={[styles.container, styles.formContainer]}>
                <Text style={[styles.titleDetailForm, styles.textDarkBlue, { fontWeight: 'bold', marginBottom: 15, marginTop: 0 }]}>
                    Hãy đọc kỹ các thông tin dưới đây. Bạn sẽ không thể sửa đổi chúng sau khi đăng ký cửa hàng!
                </Text>

                <View style={styles.viewInfoShopConfirm}>
                    <Text style={[styles.titleDetailForm, styles.textDarkBlue]}>
                        Thông tin cửa hàng
                    </Text>
                    <Text style={[styles.titleInput, {
                        color: '#001858', fontSize: 15, marginTop: 5
                    }]}>Tên cửa hàng:</Text>
                    <Text style={[styles.titleInput, {
                        color: '#00185880', fontSize: 13, marginTop: 2
                    }]}>{objShop.nameShop}</Text>
                    <Text style={[styles.titleInput, {
                        color: '#001858', fontSize: 15, marginTop: 5
                    }]}>Số điện thoại liên hệ:</Text>
                    <Text style={[styles.titleInput, {
                        color: '#00185880', fontSize: 13, marginTop: 2
                    }]}>+{objShop.hotline}</Text>
                </View>

                <View style={styles.viewInfoShopConfirm}>
                    <Text style={[styles.titleDetailForm, styles.textDarkBlue]}>
                        Thông tin chủ cửa hàng
                    </Text>
                    <Text style={[styles.titleInput, {
                        color: '#001858', fontSize: 15, marginTop: 5
                    }]}>Họ và tên:</Text>
                    <Text style={[styles.titleInput, {
                        color: '#00185880', fontSize: 13, marginTop: 2
                    }]}>{objShop.fullName}</Text>
                    <Text style={[styles.titleInput, {
                        color: '#001858', fontSize: 15, marginTop: 5
                    }]}>Số căn cước công dân:</Text>
                    <Text style={[styles.titleInput, {
                        color: '#00185880', fontSize: 13, marginTop: 2
                    }]}>{objShop.numberCard}</Text>
                    <Text style={[styles.titleInput, {
                        color: '#001858', fontSize: 15, marginTop: 5
                    }]}>Ngày sinh:</Text>
                    <Text style={[styles.titleInput, {
                        color: '#00185880', fontSize: 13, marginTop: 2
                    }]}>{objShop.dateBirth}</Text>
                </View>

                <TouchableHighlight style={[styles.buttonConfirmFullPink, styles.bgPinkLotus, styles.itemsCenter,{ marginTop: 35 }]}
                    activeOpacity={0.5} underlayColor="#DC749C"
                    onPress={onRegister}>
                    <Text style={[styles.textButtonConfirmFullPink, styles.textYellowWhite]}>Xác nhận</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}