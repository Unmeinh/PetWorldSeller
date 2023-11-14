import React from 'react';
import {
    Text, View,
    TouchableHighlight
} from 'react-native';
import styles, { darkBlue } from '../../styles/all.style';
import { onAxiosPost } from '../../api/axios.function';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../layout/ShimmerPlaceHolder';

const ViewActionBill = (props) => {

    function onShowAlertConfirm() {
        Toast.show({
            type: 'alert',
            text1: 'Xác nhận nhận đơn hàng?',
            position: 'top',
            props: {
                confirm: () => onConfirmAllBill(),
                cancel: () => Toast.hide()
            },
            autoHide: false
        })
    }

    function onShowAlertCancel() {
        Toast.show({
            type: 'alert',
            text1: 'Xác nhận hủy đơn hàng?',
            position: 'top',
            props: {
                confirm: () => onCancelAllBill(),
                cancel: () => Toast.hide()
            },
            autoHide: false
        })
    }

    async function onConfirmAllBill() {
        Toast.show({
            type: 'loading',
            position: 'top',
            autoHide: false,
            text1: 'Đang xác nhận tất cả đơn hàng...'
        })
        let res = await onAxiosPost('shop/bill/confirmAll', { isConfirm: 0 }, 'json', true);
        if (res) {
            props.fetchBills();
        }
    }

    async function onCancelAllBill() {
        Toast.show({
            type: 'loading',
            position: 'top',
            autoHide: false,
            text1: 'Đang hủy nhận tất cả đơn hàng...'
        })
        let res = await onAxiosPost('shop/bill/confirmAll', { isConfirm: 1 }, 'json', true);
        if (res) {
            props.fetchBills();
        }
    }

    return (
        <>
            {
                (props.isLoading)
                    ? <>
                        <View style={[styles.flexRow, styles.justifyFlexend, styles.itemsCenter, { width: '100%', padding: 10, paddingVertical: 13 }]}>
                            <ShimmerPlaceHolder shimmerStyle={{height: 30, width: '27%', borderRadius: 5}}/>
                            <ShimmerPlaceHolder shimmerStyle={{height: 30, width: '27%', borderRadius: 5, marginLeft: 10,}}/>
                        </View>
                        <View style={{ height: 3, width: '100%', backgroundColor: '#CCCCCC80' }}></View>
                    </>
                    : <>
                        {
                            (props.canAction && props.canAction.length > 1 && (props.canAction[0] || props.canAction[1]))
                                ? <>
                                    <View style={[styles.flexRow, styles.justifyFlexend, styles.itemsCenter, { width: '100%', padding: 10, paddingVertical: 13 }]}>
                                        {
                                            (props.canAction[1])
                                                ? <TouchableHighlight style={[styles.buttonSmallPink, styles.bgPinkLotus, { backgroundColor: '#F85555', paddingVertical: 7 }]}
                                                    activeOpacity={0.5} underlayColor="#EE3F3F" onPress={onShowAlertCancel}>
                                                    <View style={[styles.flexRow, styles.itemsCenter]}>
                                                        <Text style={[styles.textButtonSmallPink, { color: '#FEF6E4' }]}>Hủy nhận tất cả</Text>
                                                    </View>
                                                </TouchableHighlight>
                                                : ""
                                        }
                                        {
                                            (props.canAction[0])
                                                ? <TouchableHighlight style={[styles.buttonSmallPink, styles.bgPinkLotus, { backgroundColor: '#55B938', paddingVertical: 7 }]}
                                                    activeOpacity={0.5} underlayColor="#67CA4A" onPress={onShowAlertConfirm}>
                                                    <View style={[styles.flexRow, styles.itemsCenter]}>
                                                        <Text style={[styles.textButtonSmallPink, { color: '#FEF6E4' }]}>Xác nhận tất cả</Text>
                                                    </View>
                                                </TouchableHighlight>
                                                : ""
                                        }
                                    </View>
                                    <View style={{ height: 3, width: '100%', backgroundColor: '#CCCCCC80' }}></View>
                                </>
                                : ""
                        }
                    </>
            }
        </>
    )
}

export default ViewActionBill;