import React, { useState } from 'react';
import {
    Text, View,
    Image, TouchableOpacity
} from 'react-native';
import styles, { yellowWhite } from '../../styles/all.style';
import { memo } from 'react';
import HeaderTitle from '../../components/header/HeaderTitle';
import { getDateTimeDefault } from '../../utils/functionSupport';
import { onAxiosGet } from '../../api/axios.function';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../../components/layout/ShimmerPlaceHolder';

const AccountOwner = ({ route }) => {
    let idShop = route?.params?.idShop;
    const navigation = useNavigation();
    const [owner, setowner] = useState({});
    const [isLoading, setisLoading] = useState(true);
    const [isShowFrontCard, setisShowFrontCard] = useState(false);
    const [isShowBehindCard, setisShowBehindCard] = useState(false);

    function setErrorImage(type) {
        if (type == "FrontCard") {
            setsrcFrontCard(require('../../assets/images/error.png'));
        }
        if (type == "BehindCard") {
            setsrcBehindCard(require('../../assets/images/error.png'));
        }
    }

    async function fetchDetailOwner() {
        let res = await onAxiosGet('/shop/detailOwner');
        if (res) {
            setowner(res.data);
        }
    }

    function onAlertShowCard(type) {
        if (type == "FrontCard") {
            if (!isShowFrontCard) {
                Toast.show({
                    type: 'alert',
                    position: 'top',
                    text1: 'Xác nhận hiển thị mặt trước ảnh?',
                    autoHide: false,
                    props: {
                        confirm: () => {
                            Toast.hide();
                            setisShowFrontCard(true);
                        },
                        cancel: () => Toast.hide()
                    }
                })
            } else {
                setisShowFrontCard(false);
            }
        }
        if (type == "BehindCard") {
            if (!isShowBehindCard) {
                Toast.show({
                    type: 'alert',
                    position: 'top',
                    text1: 'Xác nhận hiển thị mặt sau ảnh?',
                    autoHide: false,
                    props: {
                        confirm: () => {
                            Toast.hide();
                            setisShowBehindCard(true);
                        },
                        cancel: () => Toast.hide()
                    }
                })
            } else {
                setisShowBehindCard(false);
            }
        }
    }

    React.useEffect(() => {
        if (idShop != undefined) {
            fetchDetailOwner();
        }
    }, [idShop])

    React.useEffect(() => {
        if (owner != undefined && Object.keys(owner).length > 0) {
            setisLoading(false);
            if (owner.imageIdentity != undefined) {
                if (owner.imageIdentity.length > 0 && owner.imageIdentity[0] != undefined) {
                    setsrcFrontCard({ uri: String(owner.imageIdentity[0]) });
                }
                if (owner.imageIdentity.length > 1 && owner.imageIdentity[1] != undefined) {
                    setsrcBehindCard({ uri: String(owner.imageIdentity[1]) });
                }
            }
        }
    }, [owner])

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            fetchDetailOwner();
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <HeaderTitle colorHeader={yellowWhite} titleHeader={"Thông tin chủ cửa hàng"} />
            <View style={{ padding: 15 }}>
                <View style={{ paddingBottom: 20 }}>
                    <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', }}></View>
                    <Text style={[styles.titleDetailForm, styles.textDarkBlue, { fontWeight: 'bold', fontSize: 20, marginBottom: 10 }]}>
                        Thông tin cá nhân
                    </Text>
                    <View style={[styles.flexRow, styles.justifyBetween]}>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Họ và tên: </Text>
                            {
                                (isLoading)
                                    ? <ShimmerPlaceHolder
                                        shimmerStyle={[styles.textDarkBlue, {
                                            height: 20, borderRadius: 5,
                                            width: '70%', marginTop: 3
                                        }]} />
                                    : <Text
                                        numberOfLines={2}
                                        style={[styles.textDarkBlue, {
                                            fontSize: 16, fontWeight: 'bold',
                                            width: '100%',
                                        }]}>
                                        {(owner?.nameIdentity != undefined) ? owner?.nameIdentity : "Lỗi dữ liệu"}
                                    </Text>
                            }
                        </View>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Ngày sinh: </Text>
                            {
                                (isLoading)
                                    ? <ShimmerPlaceHolder
                                        shimmerStyle={[styles.textDarkBlue, {
                                            height: 20, borderRadius: 5,
                                            width: '70%', marginTop: 3
                                        }]} />
                                    : <Text
                                        numberOfLines={2}
                                        style={[styles.textDarkBlue, {
                                            fontSize: 16, fontWeight: 'bold',
                                            width: '100%',
                                        }]}>
                                        {(owner?.dateIdentity != undefined) ? owner?.dateIdentity : "Lỗi dữ liệu"}
                                    </Text>
                            }
                        </View>
                    </View>
                </View>
                <View style={{ paddingBottom: 20 }}>
                    <View style={[styles.flexRow, styles.justifyBetween]}>
                        <View style={{ width: "47%", }}>
                            <Text style={styles.titleDetail}>Số căn cước: </Text>
                            {
                                (isLoading)
                                    ? <ShimmerPlaceHolder
                                        shimmerStyle={[styles.textDarkBlue, {
                                            height: 20, borderRadius: 5,
                                            width: '70%', marginTop: 3
                                        }]} />
                                    : <Text
                                        style={[styles.textDarkBlue, {
                                            fontSize: 16, fontWeight: 'bold',
                                            width: '100%',
                                        }]}>
                                        {owner?.numberIdentity ? owner?.numberIdentity : "Lỗi dữ liệu"}
                                    </Text>
                            }
                        </View>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Ngày tham gia: </Text>
                            {
                                (isLoading)
                                    ? <ShimmerPlaceHolder
                                        shimmerStyle={[styles.textDarkBlue, {
                                            height: 20, borderRadius: 5,
                                            width: '70%', marginTop: 3
                                        }]} />
                                    : <Text
                                        numberOfLines={2}
                                        style={[styles.textDarkBlue, {
                                            fontSize: 16, fontWeight: 'bold',
                                            width: '100%',
                                        }]}>
                                        {(owner?.createdAt != undefined) ? owner?.createdAt : "Lỗi dữ liệu"}
                                    </Text>
                            }
                        </View>
                    </View>
                </View>
                <View style={{ paddingBottom: 20 }}>
                    <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', }}></View>
                    <Text style={[styles.titleDetailForm, styles.textDarkBlue, { fontWeight: 'bold', fontSize: 20, marginBottom: 10 }]}>
                        Thông tin thanh toán
                    </Text>
                    <View style={[styles.flexRow, styles.justifyBetween]}>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Phương thức thanh toán: </Text>
                            {
                                (isLoading)
                                    ? <ShimmerPlaceHolder
                                        shimmerStyle={[styles.textDarkBlue, {
                                            height: 20, borderRadius: 5,
                                            width: '70%', marginTop: 3
                                        }]} />
                                    : <Text
                                        numberOfLines={2}
                                        style={[styles.textDarkBlue, {
                                            fontSize: 16, fontWeight: 'bold',
                                            width: '100%',
                                        }]}>
                                        {(owner?.paymentMethod != undefined) ? owner?.paymentMethod : "Lỗi dữ liệu"}
                                    </Text>
                            }
                        </View>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Số tài khoản: </Text>
                            {
                                (isLoading)
                                    ? <ShimmerPlaceHolder
                                        shimmerStyle={[styles.textDarkBlue, {
                                            height: 20, borderRadius: 5,
                                            width: '70%', marginTop: 3
                                        }]} />
                                    : <Text
                                        numberOfLines={2}
                                        style={[styles.textDarkBlue, {
                                            fontSize: 16, fontWeight: 'bold',
                                            width: '100%',
                                        }]}>
                                        {(owner?.stkPayment != undefined) ? owner?.stkPayment : "Lỗi dữ liệu"}
                                    </Text>
                            }
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default memo(AccountOwner);