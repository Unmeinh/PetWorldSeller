import React, { useState } from 'react';
import {
    Text, Image,
    View, TouchableOpacity
} from 'react-native';
import styles, { WindowHeight, WindowWidth, darkBlue, lighBlue, pinkLotus } from '../../styles/all.style';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import { onNavigate } from '../../navigation/rootNavigation';
import { storageMMKV } from '../../storage/storageMMKV';
import { useSelector, useDispatch } from "react-redux";
import { listShopSelector, shopSelectStatus } from '../../redux/selectors/selector';
import { fetchMyShops } from '../../redux/reducers/shop/shopReducer';

const AccountScreen = () => {
    var navigation = useNavigation();
    const dispatch = useDispatch();
    const [srcAvatar, setsrcAvatar] = useState(require("../../assets/images/loading.png"))
    const [isShowRevenue, setisShowRevenue] = useState(false);
    const accountShop = useSelector(listShopSelector);

    function onShowRevenue() {
        if (!isShowRevenue) {
            Toast.show({
                type: 'alert',
                text1: 'Xác nhận hiển thị doanh thu tổng?',
                position: 'top',
                autoHide: false,
                props: {
                    confirm: () => {
                        setisShowRevenue(true);
                        Toast.hide();
                    },
                    cancel: () => Toast.hide()
                }
            })
        } else {
            setisShowRevenue(false);
        }
    }

    function onOpenAllBillScreen() {
        onNavigate('BillScreen', {selectedTab: 0});
    }

    function onOpenProcessingBillScreen() {
        onNavigate('BillScreen', {selectedTab: 1});
    }

    function onOpenDeliveringBillScreen() {
        onNavigate('BillScreen', {selectedTab: 2});
    }

    function onOpenDeliveredBillScreen() {
        onNavigate('BillScreen', {selectedTab: 3});
    }

    function onOpenEvaluatedBillScreen() {
        onNavigate('BillScreen', {selectedTab: 4});
    }

    function onOpenAppointmentScreen() {
        onNavigate('AppointmentScreen');
    }

    function onOpenAccountOwner() {
        onNavigate('AccountOwner');
    }

    function onOpenAccountManager() {
        onNavigate('AccountManager');
    }

    function onOpenChangePassword() {
        onNavigate('EditPassword', { shop: accountShop });
    }

    function onLogout() {
        storageMMKV.setValue('login.isLogin', false);
        storageMMKV.setValue('login.token', "");
        navigation.push('LoginScreen')
    }

    React.useEffect(() => {
        if (accountShop.avatarShop != undefined && accountShop.avatarShop != "") {
            setsrcAvatar({ uri: String(accountShop.avatarShop) })
        }
    }, [accountShop]);

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            if (Object.keys(accountShop).length == 0) {
                dispatch(fetchMyShops());
            }
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
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={['#ace1e8', '#f582aecc']} locations={[0.6, 1]} useAngle={true} angle={0}
                style={[styles.bgHeaderAccount, styles.bgLighBlue, styles.positionAbsolute]}>
            </LinearGradient>
            <View style={[styles.viewHeaderAccount, styles.bgYellowWhite, styles.justifyBetween]}>
                <View style={styles.flexRow}>
                    <Image source={srcAvatar} style={styles.avatarHeaderAccount} />
                    <View style={[{ marginLeft: 10, width: (WindowWidth * 90 / 100) - (WindowHeight * 9 / 100) - 30, }, styles.justifyBetween]}>
                        <Text style={[styles.textDarkBlue, { fontSize: 17, fontWeight: 'bold' }]}
                            numberOfLines={2}>
                            {accountShop?.nameShop}
                        </Text>
                        <View style={styles.flexRow}>
                            <Text style={[styles.textDarkBlue, { backgroundColor: '#ECEBF0', paddingVertical: 3, paddingHorizontal: 7, borderRadius: 15 }]}>
                                Cửa hàng
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.flexRow, styles.justifyBetween, { height: WindowHeight * 5 / 100 }]}>
                    <TouchableOpacity style={[styles.viewDetailHeaderAccount, { backgroundColor: "#F7E9A3" }]}
                        onPress={onShowRevenue}>
                        <Text style={{ color: 'rgba(0, 24, 88, 0.65)', fontSize: 13 }}>Doanh thu tổng</Text>
                        {
                            (isShowRevenue)
                                ? <>
                                    <Text style={[styles.textDarkBlue]}>{Number(accountShop?.revenue).toLocaleString()} đồng</Text>
                                    <MaterialCommunityIcons name='eye' color={'rgba(0, 24, 88, 0.80)'} size={15} style={[styles.positionAbsolute, { right: 5, top: 1 }]} />
                                </>
                                : <>
                                    <Text style={[styles.textDarkBlue]}>******* đồng</Text>
                                    <MaterialCommunityIcons name='eye-off' color={'rgba(0, 24, 88, 0.80)'} size={15} style={[styles.positionAbsolute, { right: 5, top: 1 }]} />
                                </>
                        }
                    </TouchableOpacity>
                    <View style={[styles.viewDetailHeaderAccount, { backgroundColor: "#E6DECE", }]}>
                        <Text style={{ color: 'rgba(0, 24, 88, 0.65)', fontSize: 13 }}>Người theo dõi</Text>
                        <Text style={[styles.textDarkBlue]}>{accountShop?.followers} người</Text>
                    </View>
                </View>
            </View>
            <View style={styles.viewContainerAccount}>
                <View style={{ marginBottom: 20 }}>
                    <TouchableOpacity style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, { width: '100%', marginBottom: 10 }]}
                        onPress={onOpenAllBillScreen}>
                        <Text style={[{ fontSize: 17 }, styles.textDarkBlue]}>Quản lý đơn hàng</Text>
                        <MaterialCommunityIcons name='chevron-right' size={25} color={darkBlue} />
                    </TouchableOpacity>
                    <View style={[styles.flexRow, styles.justifyBetween, { width: '100%', }]}>
                        <View style={{ width: '19%', alignItems: 'center' }}>
                            <TouchableOpacity style={[styles.viewItemBill, styles.justifyCenter, styles.itemsCenter]}
                                onPress={onOpenProcessingBillScreen}>
                                <FontAwesome6 name='boxes-packing'
                                    color={pinkLotus} size={25} />
                            </TouchableOpacity>
                            <Text style={styles.textDarkBlue}>Chờ xử lý</Text>
                        </View>
                        <View style={{ width: '19%', alignItems: 'center' }}>
                            <TouchableOpacity style={[styles.viewItemBill, styles.justifyCenter, styles.itemsCenter]}
                                onPress={onOpenDeliveringBillScreen}>
                                <FontAwesome6 name='truck-fast'
                                    color={pinkLotus} size={25} />
                            </TouchableOpacity>
                            <Text style={styles.textDarkBlue}>Đang giao</Text>
                        </View>
                        <View style={{ width: '19%', alignItems: 'center' }}>
                            <TouchableOpacity style={[styles.viewItemBill, styles.justifyCenter, styles.itemsCenter]}
                                onPress={onOpenDeliveredBillScreen}>
                                <FontAwesome6 name='check-to-slot'
                                    color={pinkLotus} size={25} />
                            </TouchableOpacity>
                            <Text style={styles.textDarkBlue}>Đã giao</Text>
                        </View>
                        <View style={{ width: '19%', alignItems: 'center' }}>
                            <TouchableOpacity style={[styles.viewItemBill, styles.justifyCenter, styles.itemsCenter]}
                                onPress={onOpenEvaluatedBillScreen}>
                                <FontAwesome6 name='ranking-star'
                                    color={pinkLotus} size={25} />
                            </TouchableOpacity>
                            <Text style={styles.textDarkBlue}>Đánh giá</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <TouchableOpacity onPress={onOpenAppointmentScreen}
                        style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, { width: '100%' }]}>
                        <Text style={[{ fontSize: 17 }, styles.textDarkBlue]}>Quản lý đặt lịch</Text>
                        <MaterialCommunityIcons name='chevron-right' size={25} color={darkBlue} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, { width: '100%' }]}>
                        <Text style={[{ fontSize: 17 }, styles.textDarkBlue]}>Tài khoản</Text>
                        <MaterialCommunityIcons name='chevron-down' size={25} color={darkBlue} />
                    </View>
                    <View style={{ paddingHorizontal: 10 }}>
                        <View style={{ width: 1, height: '100%', backgroundColor: '#D2D2D2', position: 'absolute' }} />
                        <View>
                            <TouchableOpacity onPress={onOpenAccountOwner}
                                style={[styles.flexRow, styles.itemsCenter, { marginVertical: 9 }]}>
                                <MaterialCommunityIcons name='card-account-details-outline' size={23} color={darkBlue} />
                                <Text style={[{ fontSize: 15.5, marginLeft: 7 }, styles.textDarkBlue]}>Xem thông tin chủ cửa hàng</Text>
                            </TouchableOpacity>
                            <View style={{ height: 1, width: "100%", backgroundColor: '#D2D2D2' }} />
                        </View>
                        <View>
                            <TouchableOpacity onPress={onOpenAccountManager}
                                style={[styles.flexRow, styles.itemsCenter, { marginVertical: 9 }]}>
                                <MaterialCommunityIcons name='account-cog-outline' size={23} color={darkBlue} />
                                <Text style={[{ fontSize: 15.5, marginLeft: 7 }, styles.textDarkBlue]}>Quản lý tài khoản</Text>
                            </TouchableOpacity>
                            <View style={{ height: 1, width: "100%", backgroundColor: '#D2D2D2' }} />
                        </View>
                        <View>
                            <TouchableOpacity onPress={onOpenChangePassword}
                                style={[styles.flexRow, styles.itemsCenter, { marginVertical: 9 }]}>
                                <MaterialCommunityIcons name='form-textbox-password' size={23} color={darkBlue} />
                                <Text style={[{ fontSize: 15.5, marginLeft: 7 }, styles.textDarkBlue]}>Thay đổi mật khẩu</Text>
                            </TouchableOpacity>
                            <View style={{ height: 1, width: "100%", backgroundColor: '#D2D2D2' }} />
                        </View>
                        <View>
                            <TouchableOpacity onPress={onLogout}
                                style={[styles.flexRow, styles.itemsCenter, { marginVertical: 9 }]}>
                                <MaterialCommunityIcons name='exit-to-app' size={23} color={darkBlue} />
                                <Text style={[{ fontSize: 15.5, marginLeft: 7 }, styles.textDarkBlue]}>Đăng xuất</Text>
                            </TouchableOpacity>
                            <View style={{ height: 1, width: "100%", backgroundColor: '#D2D2D2' }} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default AccountScreen;