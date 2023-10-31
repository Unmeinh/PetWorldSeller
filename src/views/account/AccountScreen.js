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
    // const [accountShop, setaccountShop] = useState({
    //     nameShop: "Thế giới mều của Deadpool, đây không phải là một cái tên dài cho một cửa hàng đâu nhé ;)",
    //     email: "khongphaihoanglinh@gmail.com",
    //     locationShop: "khongphaihoanglinh@gmail.com",
    //     userName: "Catworld",
    //     passWord: "$2b$10$MzZeRUyCbqj1kJOb0GbcveEM1Kc/AQvySBDa.Fa6KVDeYPXnL5AlC",
    //     description: "1",
    //     status: 1,
    //     followers: 0,
    //     revenue: 1000000,
    //     hotline: 84382148685,
    //     createdAt: {
    //         "$date": "2023-10-13T15:37:40.171Z"
    //     },
    //     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI5NjQ0NDUwZWFkMGNiMmM1YjhhMTQiLCJ1c2VyTmFtZSI6IkNhdHdvcmxkIiwiaWF0IjoxNjk3MjExNDYwfQ.aXNls5pvcEyqhKFfH2_HBxVKNoVtDL7qiLNpHotZNQk",
    //     avatarShop: "https://res.cloudinary.com/dcf7f43rh/image/upload/v1697211461/images/upload/shop/ACb0CnHfWZ.jpg",
    //     ownerIdentity: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTI5NjQ0NDUwZWFkMGNiMmM1YjhhMTQiLCJvd25lcklkZW50aXR5IjoiN2IyMjZlNjE2ZDY1NDk2NDY1NmU3NDY5NzQ3OTIyM2EyMjMwMzgzMDMxMzAzMTM4MzQ2NjMwMzQzMjM2NjYzOTMzMzQ2MzYxNjQzNjYyMzgzMDM3NjMzNDY1MzE2NDMwMzgzYTM2NjYzNDM5MzkzMjMzNjY2MzY0MzE2MTMwMzAzMjM5NjY2NTM4MzI2NTYzMzczNjY0NjQ2MTM1MzczMjMyMzEzMzY1NjQ2MjMzMzgzODM1NjMzMTM3NjQzOTM5MzEzMTMyMzMzMDM1MzgzNTMwNjM2MjY0MzAzNDY1MzQ2NTM5MjIyYzIyNmU3NTZkNjI2NTcyNDk2NDY1NmU3NDY5NzQ3OTIyM2EyMjMwMzIzNTYyNjQ2MzMyMzEzMzMwMzgzMzM3MzgzNzY1NjE2MTM4MzYzMDM2Mzk2NDYyNjQ2NDM0MzAzODMyNjUzYTY0NjQzNjM2MzMzNjM3MzEzMTMwMzU2NjYzMzEzNTMzNjI2MzY0MzAzMDMxMzIzMjMyNjU2MzYzNjE2MTM2MzAyMjJjMjI2NDYxNzQ2NTQ5NjQ2NTZlNzQ2OTc0NzkyMjNhMjI2NDY0MzMzMDYzMzI2MjM0MzA2NDMxNjY2NjYzMzM2NDM2NjY2NTM2NjQzNjYxMzY2NjMyNjU2NTY1MzgzMTMzM2EzMTM5MzY2MTMyMzU2NTMyMzI2MzY2MzYzMTMyMzYzNjMwMzc2NTMzNjYzNDY1NjIzODYyMzczODM5MzAzNTY2MjIyYzIyNjk2ZDYxNjc2NTQ5NjQ2NTZlNzQ2OTc0NzkyMjNhNWIyMjM0NjEzODMzMzkzMTM3Mzg2NTM3MzUzOTMxMzkzODMzNjIzODM2MzU2MTYxMzYzNjY1NjQ2MjMwMzIzMjM4MzIzYTMyNjEzOTYyNjYzNjM3MzkzMTMxMzU2NjM4NjQzNjM0Mzc2MzM5MzQ2MTM1MzkzNzMzMzkzOTM1MzE2MjY2NjQzNjYyNjMzMjY1NjEzODYzMzc2NDYxNjIzMDY0MzQzMDM2MzQzNjY1MzU2MTM0Mzg2MTYzMzY2NTY1MzUzNDMxMzgzMjM0MzAzNjY2NjIzODM5MzgzMzM0NjIzODM3MzIzODY1MzEzMjYyNjM2NDMzMzg2NDMwNjYzMTYxNjIzMTMxMzIzODM2NjMzMTM0NjQzOTM1NjQzMjY1NjU2NjM5MzQzMjMzNjY2NDY1MzIzOTMxMzMzNjYyNjU2NjMwMzkzNDM0MzE2MjM2MzUzNDM4MzI2NjYzMzYzMTY2NjU2MzM2MzkzNjY0NjM2MTM4MzQzMjMxMzA2MTMyMzg2MjYyMzQzMTYyNjM2NjYzNjU2NTM5NjMzNzYxMzAzNjM4MzUzODY0MzUzMDY0NjIzMDYyMzE2NDM1NjYzMDM1MzYzODIyMmMyMjMxMzQzNjM5MzEzNzM4MzIzNzM2NjIzODM5MzU2MjMxMzYzNjM4MzkzNjY0NjIzNTYzNjEzODYzMzgzODY2MzMzYTMwMzU2MzM5MzIzMDYxNjU2MzM1MzYzNjMzMzA2NTMxMzMzNjMyMzI2MzM5MzI2NDYyMzI2MjY1NjU2MTMwNjYzMjMxMzQ2NTM4MzUzMDYzMzM2NTM5NjE2NjYxMzgzNzM2MzYzNjMwMzQ2MjM5NjI2MjY0NjU2NjMwNjYzNDYyMzY2NDMwMzYzNDM4MzYzODYxMzc2NDYyNjMzOTM4NjI2NDY1MzEzMzMzNjY2MzM5MzI2NDYxMzU2MjM5MzczMzM3MzA2NDM5NjEzMjMyMzEzNjM1MzczMjM2NjUzNzM5MzQ2MTYxNjU2MTM0MzEzMjMzMzE2NjM4MzkzMjMyMzAzMTMwMzA2NTM3MzkzMTMxMzAzMzMzMzQ2MTY0NjM2MTM0NjQ2NDMwMzc2MTYzNjQzNDY0NjEzMjYzNjY2MjM2MzkzNDM0Mzc2NDM1NjI2NTY1Mzk2MjM2Mzc2MzY1MzAzMDM2MzMzOTM2MzUzMTY0NjYzODM1MzQ2MjM0MzkzMjIyNWQ3ZCIsImlhdCI6MTY5NzIxMTQ2N30._dT_SnBlL6ZdBi-KTdG9mRdcBe7ODQ_7_HWdnQmJpyo",
    //     __v: 0,
    //     online: 0
    // });

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
        onNavigate('LoginScreen');
    }

    React.useEffect(() => {
        if (accountShop.avatarShop != undefined && accountShop.avatarShop != "") {
            setsrcAvatar({ uri: String(accountShop.avatarShop) })
        }
    }, [accountShop]);

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            if (accountShop.nameShop == undefined) {
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
            {/* <View style={[styles.bgHeaderAccount, styles.bgLighBlue, styles.positionAbsolute]} >
                <View style={[styles.bgLighBlue, { backgroundColor: '#ACE1E840', height: '30%', width: '50%', }]} />
            </View> */}
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
                    {/* <View style={[styles.viewDetailHeaderAccount]}>
                        <Text style={{color: 'rgba(0, 24, 88, 0.65)', fontSize: 13}}>Hotline</Text>
                        <Text style={[styles.textDarkBlue]}>+{accountShop?.hotline}</Text>
                    </View> */}
                </View>
            </View>
            <View style={styles.viewContainerAccount}>
                <View style={{ marginBottom: 20 }}>
                    <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, { width: '100%', marginBottom: 10 }]}>
                        <Text style={[{ fontSize: 17 }, styles.textDarkBlue]}>Quản lý đơn hàng</Text>
                        <MaterialCommunityIcons name='chevron-right' size={25} color={darkBlue} />
                    </View>
                    <View style={[styles.flexRow, styles.justifyBetween, { width: '100%', }]}>
                        <View style={{ width: '19%', alignItems: 'center' }}>
                            <View style={[styles.viewItemBill, styles.justifyCenter, styles.itemsCenter]}>
                                <FontAwesome6 name='boxes-packing'
                                    color={pinkLotus} size={25} />
                            </View>
                            <Text style={styles.textDarkBlue}>Đang xử lý</Text>
                        </View>
                        <View style={{ width: '19%', alignItems: 'center' }}>
                            <View style={[styles.viewItemBill, styles.justifyCenter, styles.itemsCenter]}>
                                <FontAwesome6 name='truck-fast'
                                    color={pinkLotus} size={25} />
                            </View>
                            <Text style={styles.textDarkBlue}>Đang giao</Text>
                        </View>
                        <View style={{ width: '19%', alignItems: 'center' }}>
                            <View style={[styles.viewItemBill, styles.justifyCenter, styles.itemsCenter]}>
                                <FontAwesome6 name='check-to-slot'
                                    color={pinkLotus} size={25} />
                            </View>
                            <Text style={styles.textDarkBlue}>Đã giao</Text>
                        </View>
                        <View style={{ width: '19%', alignItems: 'center' }}>
                            <View style={[styles.viewItemBill, styles.justifyCenter, styles.itemsCenter]}>
                                <FontAwesome6 name='ranking-star'
                                    color={pinkLotus} size={25} />
                            </View>
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