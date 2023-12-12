import {
    Text, Pressable,
    View, TouchableOpacity,
} from "react-native";
import React, { useState, useRef, memo } from "react";
import { useNavigation } from "@react-navigation/native";
import Modal from 'react-native-modal';
import styles from "../../styles/all.style";
import { onAxiosDelete, onAxiosPut } from "../../api/axios.function";
import Toast from "react-native-toast-message";

const MenuAppointment = (route) => {
    const navigation = useNavigation();
    const [canAccept, setcanAccept] = useState(false);
    const [canConfirm, setcanConfirm] = useState(false);
    const [canCancel, setcanCancel] = useState(false);

    React.useEffect(() => {
        if (route.status != undefined) {
            switch (String(route.status)) {
                case "-1":
                    setcanAccept(true)
                    setcanConfirm(false)
                    setcanCancel(false)
                    break;
                case "0":
                    setcanAccept(false)
                    setcanConfirm(true)
                    setcanCancel(true)
                    break;
                case "1":
                    setcanAccept(false)
                    setcanConfirm(false)
                    setcanCancel(false)
                    break;
                case "2":
                    setcanAccept(false)
                    setcanConfirm(false)
                    setcanCancel(false)
                    break;
                case "3":
                    setcanAccept(false)
                    setcanConfirm(false)
                    setcanCancel(false)
                    break;
                default:
                    break;
            }
        }
    }, [route.status]);

    function onOpenPet() {
        let pet = { ...route.pet };
        pet.idShop = route.shop;
        navigation.push('DetailPet', { idPet: pet._id });
    }

    function onMessagingCustomer() {
        route.callBackHide();
        Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Tính năng này đang được phát triển!'
        })
    }

    function onShowAlertAccept() {
        route.callBackHide();
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
        route.callBackHide();
        if (canAccept) {
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
        route.callBackHide();
        if (new Date(route?.appointmentDate) > new Date()) {
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
        if (canAccept) {
            Toast.show({
                type: 'loading',
                position: 'top',
                text1: "Đang xác nhận lịch hẹn...",
                autoHide: false
            })
            let res = await onAxiosPut('shop/appointment/update',
                {
                    idAppt: route.idAppt,
                    status: 0,
                }, 'json', true)
            if (res && res.success) {
                setcanAccept(false);
                setcanConfirm(true);
                setcanCancel(true);
                route.onCallbackUpdate('rgba(0, 24, 88, 0.55)');
            }
        }
    }

    async function onCancel() {
        if (canAccept) {
            Toast.show({
                type: 'loading',
                position: 'top',
                text1: "Đang hủy nhận hẹn...",
                autoHide: false
            })
            let res = await onAxiosPut('shop/appointment/update',
                {
                    idAppt: route.idAppt,
                    status: 3
                }, 'json', true)
            if (res && res.success) {
                setcanAccept(false);
                setcanConfirm(false);
                setcanCancel(false);
                route.onCallbackUpdate('rgba(0, 24, 88, 0.55)');
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
                    idAppt: route.idAppt,
                    status: 3
                }, 'json', true)
            if (res && res.success) {
                setcanAccept(false);
                setcanConfirm(false);
                setcanCancel(false);
                route.onCallbackUpdate('rgba(0, 24, 88, 0.55)');
            }
        }
    }

    async function onConfirm() {
        if (canConfirm) {
            Toast.show({
                type: 'loading',
                position: 'top',
                text1: "Đang xác nhận đã hẹn...",
                autoHide: false
            })
            let res = await onAxiosPut('shop/appointment/update',
                {
                    idAppt: route.idAppt,
                    status: 1,
                }, 'json', true)
            if (res && res.success) {
                setcanConfirm(false);
                setcanCancel(false);
                route.onCallbackUpdate('#009A62');
            }
        }
    }

    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            animationOutTiming={350}
            animationInTiming={350}
            isVisible={route.isShow}
            swipeDirection="down"
            propagateSwipe={true}
            backdropColor="rgba(0, 0, 0, 0.5)"
            onSwipeComplete={route.callBackHide}
            onBackdropPress={route.callBackHide}
            onBackButtonPress={route.callBackHide}>
            <View style={styles.modalMenuContainer} >
                <View style={styles.menuAppointment}>
                    {/* View control */}
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={styles.swipeControlModal} />
                    </View>
                    <Pressable>
                        <TouchableOpacity style={{ width: '100%', alignItems: 'center', borderBottomColor: '#D9D9D9', borderBottomWidth: 1 }}
                            onPress={onOpenPet}>
                            <Text style={styles.textOptionMenu}>Xem thú cưng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: '100%', alignItems: 'center', borderBottomColor: '#D9D9D9', borderBottomWidth: 1 }}
                            onPress={onMessagingCustomer}>
                            <Text style={styles.textOptionMenu}>Nhắn tin cho khách hàng</Text>
                        </TouchableOpacity>
                        {
                            (canAccept)
                                ? <>
                                    <TouchableOpacity style={{ width: '100%', alignItems: 'center', borderBottomColor: '#D9D9D9', borderBottomWidth: 1 }}
                                        onPress={onShowAlertAccept}>
                                        <Text style={[styles.textOptionMenu, { color: '#009A62' }]}>Xác nhận lịch hẹn</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ width: '100%', alignItems: 'center' }}
                                        onPress={onShowAlertCancel}>
                                        <Text style={[styles.textOptionMenu, { color: '#EE3333' }]}>Hủy nhận lịch hẹn</Text>
                                    </TouchableOpacity>
                                </>
                                : ""
                        }
                        {
                            (canConfirm)
                                ?
                                <TouchableOpacity style={{ width: '100%', alignItems: 'center', borderBottomColor: '#D9D9D9', borderBottomWidth: 1 }}
                                    onPress={onShowAlertConfirm}>
                                    <Text style={[styles.textOptionMenu, { color: '#009A62' }]}>Xác nhận đã hẹn</Text>
                                </TouchableOpacity>
                                : ""
                        }
                        {
                            (canCancel)
                                ?
                                <TouchableOpacity style={{ width: '100%', alignItems: 'center' }}
                                    onPress={onShowAlertCancel}>
                                    <Text style={[styles.textOptionMenu, { color: '#EE3333' }]}>Hủy lịch hẹn</Text>
                                </TouchableOpacity>
                                : ""
                        }
                    </Pressable>
                </View>
            </View>
        </Modal >
    );
};

export default memo(MenuAppointment);