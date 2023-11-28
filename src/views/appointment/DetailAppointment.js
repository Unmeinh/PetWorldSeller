import React, { useState, memo } from 'react';
import {
    TouchableHighlight,
    Image, TouchableOpacity,
    Text, View
} from 'react-native';
import HeaderTitle from '../../components/header/HeaderTitle';
import styles from '../../styles/all.style';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ShimmerPlaceHolder from '../../components/layout/ShimmerPlaceHolder';
import { getDateDefault } from '../../utils/functionSupport';
import { onAxiosGet, onAxiosDelete, onAxiosPut } from "../../api/axios.function";
import Toast from "react-native-toast-message";
import { onGoBack } from '../../navigation/rootNavigation';
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

const DetailAppointment = ({ route }) => {
    const navigation = useNavigation();
    const [appointment, setappointment] = useState(undefined);
    const [statusApm, setstatusApm] = useState("Đang hẹn");
    const [srcPet, setsrcPet] = useState(require('../../assets/images/loading.png'));
    const [srcAvatar, setsrcAvatar] = useState(require('../../assets/images/loading.png'));
    const [isLoader, setisLoader] = useState(true);
    const [isFocusScreen, setisFocusScreen] = useState(false);

    async function fetchAppointment() {
        let res = await onAxiosGet('shop/appointment/detail/' + route.params.idApm);
        if (res) {
            setappointment(res.data);
        } else {
            setappointment("null");
        }
    }

    function onOpenPet() {
        let type = 0;
        let pet = { ...appointment.idPet };
        pet.idShop = appointment.idShop;
        navigation.push('DetailPet', { idPet: pet._id });
    }

    function onShowAlertAccept() {
        Toast.show({
            type: 'alert',
            position: 'top',
            text1: "Xác nhận nhận lịch hẹn?",
            props: {
                cancel: () => Toast.hide(),
                confirm: onAccept
            },
            autoHide: false
        })
    }

    function onShowAlertCancel() {
        if (appointment?.canAccept) {
            Toast.show({
                type: 'alert',
                position: 'top',
                text1: "Xác nhận hủy nhận hẹn?",
                props: {
                    cancel: () => Toast.hide(),
                    confirm: onCancel
                },
                autoHide: false
            })
        } else {
            Toast.show({
                type: 'alert',
                position: 'top',
                text1: "Xác nhận hủy lịch hẹn?",
                props: {
                    cancel: () => Toast.hide(),
                    confirm: onCancel
                },
                autoHide: false
            })
        }
    }

    function onShowAlertConfirm() {
        if (new Date(appointment?.appointmentDate) > new Date()) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: "Bạn sẽ có thể xác nhận sau ngày hẹn!",
            })
            return;
        }
        Toast.show({
            type: 'alert',
            position: 'top',
            text1: "Xác nhận đã hẹn?",
            props: {
                cancel: () => Toast.hide(),
                confirm: onConfirm
            },
            autoHide: false
        })
    }

    async function onAccept() {
        if (appointment?.canAccept) {
            Toast.show({
                type: 'loading',
                position: 'top',
                text1: "Đang xác nhận đã hẹn...",
                autoHide: false
            })
            let res = await onAxiosPut('shop/appointment/update',
                {
                    idAppt: appointment._id,
                    status: 0,
                }, 'json', true)
            if (res && res.success) {
                setappointment(res.data);
            }
        }
    }

    async function onCancel() {
        if (appointment?.canAccept) {
            Toast.show({
                type: 'loading',
                position: 'top',
                text1: "Đang hủy nhận hẹn...",
                autoHide: false
            })
            let res = await onAxiosPut('shop/appointment/update',
                {
                    idAppt: appointment._id,
                    status: 3
                }, 'json', true)
            if (res && res.success) {
                setappointment(res.data);
            }
        } else {
            Toast.show({
                type: 'loading',
                position: 'top',
                text1: "Đang hủy lịch hẹn...",
                autoHide: false
            })
            let res = await onAxiosPut('shop/appointment/update',
                {
                    idAppt: appointment._id,
                    status: 3
                }, 'json', true)
            if (res && res.success) {
                setappointment(res.data);
            }
        }
    }

    async function onConfirm() {
        if (appointment?.canConfirm) {
            Toast.show({
                type: 'loading',
                position: 'top',
                text1: "Đang xác nhận đã hẹn...",
                autoHide: false
            })
            let res = await onAxiosPut('shop/appointment/update',
                {
                    idAppt: appointment._id,
                    status: 1,
                }, 'json', true)
            if (res && res.success) {
                setappointment(res.data);
            }
        }
    }

    async function onDelete() {
        if (!appointment?.canCancel) {
            Toast.show({
                type: 'loading',
                position: 'top',
                text1: "Đang xóa lịch hẹn...",
                autoHide: false
            })
            let res = await onAxiosDelete('appointment/delete/' + appointment._id, true);
            if (res) {
                if (route.params.onCallbackDelete != undefined) {
                    route.params.onCallbackDelete();
                }
                goBack();
            }
        }
    }

    React.useEffect(() => {
        if (isFocusScreen && appointment != undefined) {
            setisLoader(false);
            if (appointment != "null") {
                setsrcPet({ uri: String(appointment.idPet.imagesPet[0]) })
                setsrcAvatar({ uri: String(appointment?.idUser?.avatarUser) })
            }
        }
    }, [appointment]);

    React.useEffect(() => {
        if (isFocusScreen) {
            if (appointment == undefined) {
                setisLoader(true);
                fetchAppointment();
            }
        }
    }, [isFocusScreen]);

    React.useEffect(() => {
        const unsubFocus = navigation.addListener('focus', () => {
            setisFocusScreen(true);
            return () => {
                unsubFocus.remove();
            };
        });

        const unsubBlur = navigation.addListener('blur', () => {
            setisFocusScreen(false);
            return () => {
                unsubBlur.remove();
            };
        });

        const unsubRemove = navigation.addListener('beforeRemove', () => {
            setisFocusScreen(false);
            return () => {
                unsubRemove.remove();
            };
        });

    }, [navigation]);

    const DetailItem = () => {
        return (
            <>
                {
                    (appointment)
                        ? <View>
                            <View style={{ paddingHorizontal: 20, marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={onOpenPet}>
                                    <Image style={styles.imageItem} source={srcPet}
                                        onError={() => setsrcPet(require('../../assets/images/error.png'))} />
                                    <View style={{ marginLeft: 15 }}>
                                        <Text style={styles.textNamePetItem} numberOfLines={1}>
                                            {appointment.idPet.namePet}
                                        </Text>
                                        <Text style={styles.textPricePet} numberOfLines={1}>
                                            {Number(appointment.idPet.pricePet).toLocaleString()} đồng
                                        </Text>
                                    </View>
                                    <TouchableOpacity onPress={onOpenPet}>
                                        <MaterialCommunityIcons name='chevron-right' color={'#001858'} size={27} />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingHorizontal: 25, marginTop: 10, }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
                                    <MaterialCommunityIcons name='calendar' color={'#001858'} size={17} />
                                    <Text style={{ color: 'rgba(0, 24, 88, 0.80)', marginLeft: 7, fontFamily: 'ProductSans', fontSize: 15 }}>
                                        Ngày hẹn: {(appointment.appointmentDate != undefined)
                                            ? getDateDefault(appointment.appointmentDate) : "Lỗi dữ liệu"}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
                                    <MaterialCommunityIcons name='paw' color={'#001858'} size={17} />
                                    <Text style={{ color: 'rgba(0, 24, 88, 0.80)', marginLeft: 7, marginTop: 4, fontFamily: 'ProductSans', fontSize: 15 }}>
                                        Số lượng: {(appointment.amountPet != undefined)
                                            ? appointment.amountPet : "Lỗi dữ liệu"}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
                                    <View style={{ width: 17, height: 17, left: -1 }}>
                                        <MaterialCommunityIcons name='cash' color={'#001858'} size={20} />
                                    </View>
                                    <Text style={{ color: 'rgba(0, 24, 88, 0.80)', marginLeft: 7, fontFamily: 'ProductSans', fontSize: 15 }}>
                                        Tiền đặt cọc: {(appointment.deposits != undefined)
                                            ? Number(appointment.deposits).toLocaleString() + " đồng" : "Lỗi dữ liệu"}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
                                    <View style={{ width: 17, left: -1 }}>
                                        <MaterialCommunityIcons name='map-marker' color={'#001858'} size={20} />
                                    </View>
                                    <Text style={{ color: 'rgba(0, 24, 88, 0.80)', marginLeft: 7, fontFamily: 'ProductSans', fontSize: 15 }}>
                                        Địa điểm hẹn: {(appointment.location != undefined)
                                            ? appointment.location : "Lỗi dữ liệu"}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
                                    <MaterialCommunityIcons name='progress-question' color={'#001858'} size={17} />
                                    <Text style={{ color: 'rgba(0, 24, 88, 0.80)', marginLeft: 7, fontFamily: 'ProductSans', fontSize: 15 }}>
                                        Trạng thái: {(appointment.nameStatus != undefined)
                                            ? appointment.nameStatus : "Lỗi dữ liệu"}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
                                    <MaterialCommunityIcons name='calendar' color={'#001858'} size={17} />
                                    <Text style={{ color: 'rgba(0, 24, 88, 0.80)', marginLeft: 7, fontFamily: 'ProductSans', fontSize: 15 }}>
                                        Ngày đặt: {(appointment.createdAt != undefined)
                                            ? getDateDefault(appointment.createdAt) : "Lỗi dữ liệu"}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ backgroundColor: 'rgba(204, 204, 204, 0.50)', height: 5, width: '100%', marginTop: 15 }} />
                            <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={styles.imageItem} source={srcAvatar}
                                            onError={() => setsrcAvatar(require('../../assets/images/error.png'))} />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={styles.textNameShop} numberOfLines={1}>
                                                {appointment?.idUser?.fullName}
                                            </Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
                                                <View style={{ width: 12, marginRight: 3 }}>
                                                    <MaterialCommunityIcons name='map-marker' size={13} color={'#656565'} />
                                                </View>
                                                <Text style={styles.textLocationShop} numberOfLines={1}>
                                                    {appointment?.idUser?.locationUser}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={[styles.textInfoShop, styles.textDarkBlue]}>
                                            Số liên hệ: <Text style={{ color: '#F582AE' }}>+{appointment?.idUser?.idAccount?.phoneNumber ? appointment?.idUser?.idAccount?.phoneNumber : "Không có dữ liệu"}</Text>
                                        </Text>
                                        <Text style={[styles.textInfoShop, styles.textDarkBlue]}>
                                            Email: <Text style={{ color: '#F582AE' }}>{appointment?.idUser?.idAccount?.emailAddress ? appointment?.idUser?.idAccount?.emailAddress : "Không có dữ liệu"}</Text>
                                        </Text>
                                    </View>
                                </View>
                                {/* <View>
                                    <TouchableOpacity style={styles.buttonItemShop}
                                        onPress={onOpenShop}>
                                        <Text style={styles.textButtonItemShop}>Xem shop</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonItemShop}
                                        onPress={() => setisShowSetApm(true)}>
                                        <Text style={styles.textButtonItemShop}>Nhắn tin</Text>
                                    </TouchableOpacity>
                                </View> */}
                            </View>
                            <View style={{ backgroundColor: 'rgba(204, 204, 204, 0.50)', height: 5, width: '100%' }} />
                            <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20, paddingRight: 20 }}>
                                {
                                    (appointment?.canAccept)
                                        ? <>
                                            <TouchableHighlight style={[styles.buttonSave, { backgroundColor: '#F85555' }]}
                                                activeOpacity={0.5} underlayColor="#EE3F3F"
                                                onPress={onShowAlertCancel}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={styles.textButtonSave}>Hủy nhận hẹn</Text>
                                                </View>
                                            </TouchableHighlight>
                                            <TouchableHighlight style={[styles.buttonSave, { backgroundColor: '#55B938' }]}
                                                activeOpacity={0.5} underlayColor="#67CA4A"
                                                onPress={onShowAlertAccept}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text style={styles.textButtonSave}>Xác nhận hẹn</Text>
                                                </View>
                                            </TouchableHighlight>
                                        </>
                                        : <>
                                            {
                                                (appointment?.canCancel)
                                                    ? <TouchableHighlight style={[styles.buttonSave, { backgroundColor: '#F85555' }]}
                                                        activeOpacity={0.5} underlayColor="#EE3F3F"
                                                        onPress={onShowAlertCancel}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={styles.textButtonSave}>Hủy lịch hẹn</Text>
                                                        </View>
                                                    </TouchableHighlight>
                                                    : ""
                                            }
                                            {
                                                (appointment?.canConfirm)
                                                    ? <TouchableHighlight style={[styles.buttonSave, { backgroundColor: '#55B938' }]}
                                                        activeOpacity={0.5} underlayColor="#67CA4A"
                                                        onPress={onShowAlertConfirm}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Text style={styles.textButtonSave}>Xác nhận đã hẹn</Text>
                                                        </View>
                                                    </TouchableHighlight>
                                                    : ""
                                            }
                                        </>
                                }
                            </View>
                            <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20, paddingRight: 20 }}>
                                <TouchableHighlight style={[styles.buttonSave, { backgroundColor: '#8E8E8E' }]}
                                    activeOpacity={0.5} underlayColor="#6D6D6D"
                                    onPress={onGoBack}>
                                    <Text style={styles.textButtonSave}> Quay lại  </Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        : ""
                }
            </>
        )
    }

    const DetailLoader = () => {
        return (
            <View>
                <View style={{ paddingHorizontal: 20, marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <ShimmerPlaceHolder
                            shimmerStyle={styles.imageItem} />
                        <View style={{ marginLeft: 15 }}>
                            <ShimmerPlaceHolder
                                shimmerStyle={{ width: '50%', height: 18, borderRadius: 5 }} />
                            <ShimmerPlaceHolder
                                shimmerStyle={{ width: '35%', height: 14, borderRadius: 5, marginTop: 10, marginLeft: 7 }} />
                        </View>
                    </View>
                    <ShimmerPlaceHolder
                        shimmerStyle={{ width: 15, height: 25, borderRadius: 5 }} />
                </View>
                <View style={{ paddingHorizontal: 25, marginTop: 10, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: 17, height: 17, borderRadius: 5 }} />
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: '40%', height: 16, borderRadius: 5, marginLeft: 7 }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: 17, height: 17, borderRadius: 5 }} />
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: '40%', height: 16, borderRadius: 5, marginLeft: 7 }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: 17, height: 17, borderRadius: 5 }} />
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: '40%', height: 16, borderRadius: 5, marginLeft: 7 }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: 17, height: 17, borderRadius: 5 }} />
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: '40%', height: 16, borderRadius: 5, marginLeft: 7 }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: 17, height: 17, borderRadius: 5 }} />
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: '40%', height: 16, borderRadius: 5, marginLeft: 7 }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: 17, height: 17, borderRadius: 5 }} />
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: '40%', height: 16, borderRadius: 5, marginLeft: 7 }} />
                    </View>
                </View>
                <View style={{ backgroundColor: 'rgba(204, 204, 204, 0.50)', height: 5, width: '100%', marginTop: 15 }} />
                <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ShimmerPlaceHolder
                                shimmerStyle={styles.imageItem} />
                            <View style={{ marginLeft: 10 }}>
                                <ShimmerPlaceHolder
                                    shimmerStyle={{ width: '50%', height: 18, borderRadius: 5 }} />
                                <ShimmerPlaceHolder
                                    shimmerStyle={{ width: '75%', height: 14, borderRadius: 5, marginTop: 10, marginLeft: 7 }} />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 13 }}>
                            <ShimmerPlaceHolder
                                shimmerStyle={{ width: '30%', height: 15, borderRadius: 5 }} />
                            <ShimmerPlaceHolder
                                shimmerStyle={{ width: '30%', height: 15, marginLeft: 9, borderRadius: 5 }} />
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: 'rgba(204, 204, 204, 0.50)', height: 5, width: '100%' }} />
                <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginTop: 20, paddingRight: 20 }}>
                    <ShimmerPlaceHolder
                        shimmerStyle={{ width: 95, height: 30, borderRadius: 10, marginLeft: 20 }} />
                    <ShimmerPlaceHolder
                        shimmerStyle={{ width: 95, height: 30, borderRadius: 10, marginLeft: 20 }} />
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <HeaderTitle nav={navigation} titleHeader={"Chi tiết lịch hẹn"} colorHeader={'#FEF6E4'} />
            {
                (isLoader)
                    ? <DetailLoader />
                    : <>
                        {
                            (appointment == "null")
                                ? <View style={styles.viewEmptyList}>
                                    <FontAwesome name='calendar-times-o' size={70} color={'rgba(0, 0, 0, 0.5)'} />
                                    <Text style={styles.textEmptyList}>Không tìm thấy lịch hẹn..</Text>
                                </View>
                                : <>
                                    <DetailItem />
                                </>
                        }
                    </>
            }
        </View>
    );
}


export default memo(DetailAppointment);