import React, { memo, useState } from 'react';
import {
    Text, View,
    TouchableHighlight,
    Image, TouchableOpacity,
} from 'react-native';
import styles, { WindowWidth, darkBlue, yellowWhite } from '../../styles/all.style';
import { getDateDefault } from '../../utils/functionSupport';
import { onNavigate } from '../../navigation/rootNavigation';
import Toast from 'react-native-toast-message';
import { onAxiosPost } from '../../api/axios.function';

const ItemBill = (row) => {
    const [srcImage, setsrcImage] = useState(require('../../assets/images/loading.png'))
    const [srcAvatar, setsrcAvatar] = useState(require('../../assets/images/loading.png'))
    const [item, setitem] = useState(row.item)
    const [product, setproduct] = useState({});
    const [pet, setpet] = useState({})
    const [user, setuser] = useState({});

    function setErrorImage() {
        setsrcImage(require('../../assets/images/error.png'));
    }

    function setErrorAvatar() {
        setsrcAvatar(require('../../assets/images/error.png'));
    }

    function onOpenDetailBill() {
        onNavigate('DetailBill', { bill: item, fetchBills: () => row.fetchBills() });
    }

    function onShowAlertConfirm() {
        Toast.show({
            type: 'alert',
            text1: 'Xác nhận nhận đơn hàng?',
            position: 'top',
            props: {
                confirm: () => onConfirmBill(),
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
                confirm: () => onCancelBill(),
                cancel: () => Toast.hide()
            },
            autoHide: false
        })
    }

    async function onConfirmBill() {
        Toast.show({
            type: 'loading',
            position: 'top',
            autoHide: false,
            text1: 'Đang xác nhận đơn hàng...'
        })
        let res = await onAxiosPost('shop/bill/confirm', {
            idBill: item._id,
            isConfirm: 0
        }, 'json', true);
        if (res) {
            row.fetchBills();
        }
    }

    async function onCancelBill() {
        Toast.show({
            type: 'loading',
            position: 'top',
            autoHide: false,
            text1: 'Đang hủy nhận đơn hàng...'
        })
        let res = await onAxiosPost('shop/bill/confirm', {
            idBill: item._id,
            isConfirm: 1
        }, 'json', true);
        if (res) {
            row.fetchBills();
        }
    }

    React.useEffect(() => {
        if (item.productInfo) {
            let productInfo = item.productInfo[0];
            setproduct(productInfo[0]);
            if (productInfo) {
                if (productInfo.length > 0
                    && productInfo[0]?.idProduct[0]?.arrProduct.length > 0) {
                    setsrcImage({ uri: String(productInfo[0]?.idProduct[0]?.arrProduct[0]) });
                } else {
                    setErrorImage();
                }
            }
        }
        if (item.petInfo) {
            let petInfo = item.petInfo[0];
            setpet(petInfo);
            if (petInfo) {
                if (petInfo?.idPet.length > 0
                    && petInfo?.idPet[0]?.imagesPet.length > 0) {
                    setsrcImage({ uri: String(petInfo?.idPet[0]?.imagesPet[0]) });
                } else {
                    setErrorImage();
                }
            }
        }
        if (item.userInfo) {
            let user = item.userInfo[0];
            setuser(user);
            if (user && user?.avatarUser) {
                setsrcAvatar({ uri: String(user?.avatarUser) });
            } else {
                setErrorAvatar();
            }
        }
    }, [item])

    React.useEffect(() => {
        setitem(row.item);
    }, [row.item])

    return (
        <TouchableHighlight
            activeOpacity={0.5} underlayColor="#0000001A"
            onPress={onOpenDetailBill}>
            <>
                <View style={{ padding: 15 }}>
                    <View style={[styles.flexRow, styles.itemsCenter, styles.justifyBetween, { width: '100%', }]}>
                        <View style={[styles.flexRow, styles.itemsCenter, { width: '65%' }]}>
                            <Image source={srcAvatar} onError={setErrorAvatar}
                                style={{ height: 20, width: 20, borderRadius: 20 }} />
                            <Text style={[styles.textDarkBlue, { fontSize: 17, marginLeft: 5 }]}
                                numberOfLines={1} ellipsizeMode='tail'>
                                {user?.fullName}
                            </Text>
                        </View>
                        <View style={[{ width: '30%', }]}>
                            <Text style={[styles.textDarkBlue,
                            { fontSize: 15, textAlign: 'right', fontWeight: 'bold', color: (String(item?.statusBill?.colorStatus)) ? String(item?.statusBill?.colorStatus) : "#D2D2D2" }]}
                                numberOfLines={1}>
                                {item?.statusBill?.nameStatus}
                            </Text>
                        </View>
                    </View>
                    {
                        (product)
                            ? <View
                                style={{
                                    marginTop: 9,
                                    marginBottom: 7,
                                    flexDirection: 'row',
                                }}>
                                <TouchableOpacity onPress={onOpenDetailBill}>
                                    <Image
                                        source={srcImage} onError={setErrorImage}
                                        style={{ width: 90, height: 90, borderRadius: 10 }} />
                                </TouchableOpacity>
                                <View style={[styles.justifyBetween, { marginLeft: 10, width: WindowWidth - 130, height: 90 }]}>
                                    <Text style={[styles.textDarkBlue, { fontSize: 17, fontWeight: 'bold' }]}
                                        numberOfLines={2}>
                                        {(product?.idProduct) ? product?.idProduct[0]?.nameProduct : "Không có dữ liệu"}
                                    </Text>
                                    <View>
                                        <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                            <Text style={{ fontWeight: 'bold' }}>{Number(product?.price - (product?.price * product?.discount / 100)).toLocaleString()}{" đồng"}</Text>
                                            {" | "}
                                            <Text style={{ color: '#656565' }}>
                                                <Text style={{ textDecorationLine: 'line-through' }}
                                                >{Number(product?.price).toLocaleString()}</Text> đồng</Text>
                                        </Text>
                                        <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                            Số lượng: {product?.amount}{" | "}{getDateDefault(item?.createdAt)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            : <View
                                style={{
                                    marginTop: 9,
                                    marginBottom: 7,
                                    flexDirection: 'row',
                                }}>
                                <TouchableOpacity onPress={onOpenDetailBill}>
                                    <Image
                                        source={srcImage} onError={setErrorImage}
                                        style={{ width: 90, height: 90, borderRadius: 10 }} />
                                </TouchableOpacity>
                                <View style={[styles.justifyBetween, { marginLeft: 10, width: WindowWidth - 130, height: 90 }]}>
                                    <Text style={[styles.textDarkBlue, { fontSize: 17, fontWeight: 'bold' }]}
                                        numberOfLines={2}>
                                        {(pet?.idPet) ? pet?.idPet[0]?.namePet : "Không có dữ liệu"}
                                    </Text>
                                    <View>
                                        <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                            <Text style={{ fontWeight: 'bold' }}>{Number(pet?.price - (pet?.price * pet?.discount / 100)).toLocaleString()}{" đồng"}</Text>
                                            {" | "}
                                            <Text style={{ color: '#656565' }}>
                                                <Text style={{ textDecorationLine: 'line-through' }}
                                                >{Number(pet?.price).toLocaleString()}</Text> đồng</Text>
                                        </Text>
                                        <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                            Số lượng: {pet?.amount}{" | "}{getDateDefault(item?.createdAt)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                    }
                    <View style={[styles.justifyFlexend]}>
                        <Text style={[styles.textDarkBlue,
                        { fontSize: 17, textAlign: 'right', fontWeight: 'bold' }]} numberOfLines={1}>
                            Tổng tiền:
                            <Text style={{ color: '#FD3F3F' }}> {Number(item.total).toLocaleString()} đồng</Text>
                        </Text>
                        {
                            (item?.deliveryStatus == 0)
                                ? <View style={[styles.flexRow, styles.justifyFlexend]}>
                                    <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#F85555', backgroundColor: yellowWhite }]}
                                        activeOpacity={0.5} underlayColor="#EE3F3F"
                                        onPress={onShowAlertCancel}>
                                        <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#F85555', fontWeight: 'bold' }]}>
                                            Hủy nhận
                                        </Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#55B938', backgroundColor: yellowWhite }]}
                                        activeOpacity={0.5} underlayColor="#67CA4A"
                                        onPress={onShowAlertConfirm}>
                                        <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#449E2A', fontWeight: 'bold' }]}>
                                            Xác nhận
                                        </Text>
                                    </TouchableHighlight>
                                </View>
                                : <>
                                    {
                                        (item?.deliveryStatus == 1)
                                            ? <View style={[styles.flexRow, styles.justifyFlexend]}>
                                                <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#F85555', backgroundColor: yellowWhite }]}
                                                    activeOpacity={0.5} underlayColor="#EE3F3F"
                                                    onPress={onShowAlertCancel}>
                                                    <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#F85555', fontWeight: 'bold' }]}>
                                                        Hủy đơn
                                                    </Text>
                                                </TouchableHighlight>
                                            </View>
                                            : ""
                                    }
                                </>
                        }
                    </View>
                </View>
                <View style={{ backgroundColor: '#D8D7D4', width: '100%', height: 5 }} />
            </>
        </TouchableHighlight>
    )
}

export default memo(ItemBill);