import React, { useState } from 'react';
import {
    Text, View,
    Image, ScrollView,
    FlatList, Keyboard,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import styles, { WindowWidth, darkBlue, yellowWhite } from '../../styles/all.style';
import { memo } from 'react';
import HeaderTitle from '../../components/header/HeaderTitle';
import { getDateTimeDefault } from '../../utils/functionSupport';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import { onGoBack, onNavigate } from '../../navigation/rootNavigation';
import { onAxiosPost } from '../../api/axios.function';

const DetailBill = ({ route }) => {
    let item = route.params.bill;
    let productInfo = (item?.productInfo) ? item?.productInfo[0] : null;
    let petInfo = (item?.petInfo) ? item?.petInfo[0] : null;
    let userInfo = (item?.userInfo) ? item?.userInfo[0] : null;
    let shipperInfo = (item?.shipperInfo) ? item?.shipperInfo[0] : null;
    const [statusBill, setstatusBill] = useState(item?.statusBill)
    const [srcAvatar, setsrcAvatar] = useState(require('../../assets/images/loading.png'))
    const [srcAvatarShipper, setsrcAvatarShipper] = useState(require('../../assets/images/loading.png'))

    function setErrorAvatar() {
        setsrcAvatar(require('../../assets/images/error.png'));
    }

    function setErrorAvatarShipper() {
        setsrcAvatarShipper(require('../../assets/images/error.png'));
    }

    function onContactWithCustomer() {
        Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Tính năng này đang được phát triển!',
        })
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
        Keyboard.dismiss();
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
            route.params?.fetchBills();
            setstatusBill(res.data)
        }
    }

    async function onCancelBill() {
        Keyboard.dismiss();
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
            route.params?.fetchBills();
            setstatusBill(res.data)
        }
    }

    const ItemProduct = (row) => {
        let itemProduct = row.item;
        const [srcImage, setsrcImage] = useState(require('../../assets/images/loading.png'))

        function setErrorImage() {
            setsrcImage(require('../../assets/images/error.png'));
        }

        function onOpenDetailProduct() {
            onNavigate("DetailProduct", { idProd: itemProduct.idProduct[0]._id })
        }

        React.useEffect(() => {
            if (itemProduct.idProduct) {
                let arrImage = itemProduct.idProduct[0]?.arrProduct;
                if (arrImage && arrImage.length > 0) {
                    setsrcImage({ uri: String(arrImage[0]) });
                }
            }
        }, [itemProduct])

        return (
            <View style={[styles.flexRow, { marginBottom: 10, paddingHorizontal: 5 }]}>
                <TouchableOpacity onPress={onOpenDetailProduct}>
                    <Image
                        source={srcImage} onError={setErrorImage}
                        style={{ width: 90, height: 90, borderRadius: 10 }} />
                </TouchableOpacity>
                <View style={[styles.justifyBetween, { marginLeft: 10, width: WindowWidth - 130, height: 90 }]}>
                    <Text style={[styles.textDarkBlue, { fontSize: 17 }]}
                        numberOfLines={2}>
                        {(itemProduct?.idProduct) ? itemProduct?.idProduct[0]?.nameProduct : "Không có dữ liệu"}
                    </Text>
                    <View>
                        <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                            <Text style={{ fontWeight: 'bold' }}>{Number(itemProduct?.price - (itemProduct?.price * itemProduct?.discount / 100)).toLocaleString()}{" đồng"}</Text>
                            {" | "}
                            <Text style={{ color: '#656565' }}>
                                <Text style={{ textDecorationLine: 'line-through' }}
                                >{Number(itemProduct?.price).toLocaleString()}</Text> đồng</Text>
                        </Text>
                        <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                            Số lượng mua: {itemProduct?.amount}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    const ItemPet = (row) => {
        let itemPet = row.item;
        const [srcImage, setsrcImage] = useState(require('../../assets/images/loading.png'))

        function setErrorImage() {
            setsrcImage(require('../../assets/images/error.png'));
        }

        function onOpenDetailProduct() {
            onNavigate("DetailPet", { idPet: itemPet.idPet[0]._id })
        }

        React.useEffect(() => {
            if (itemPet.idPet) {
                let arrImage = itemPet.idPet[0]?.imagesPet;
                if (arrImage && arrImage.length > 0) {
                    setsrcImage({ uri: String(arrImage[0]) });
                }
            }
        }, [itemPet])

        return (
            <View style={[styles.flexRow, { marginBottom: 10, paddingHorizontal: 5 }]}>
                <TouchableOpacity onPress={onOpenDetailProduct}>
                    <Image
                        source={srcImage} onError={setErrorImage}
                        style={{ width: 90, height: 90, borderRadius: 10 }} />
                </TouchableOpacity>
                <View style={[styles.justifyBetween, { marginLeft: 10, width: WindowWidth - 130, height: 90 }]}>
                    <Text style={[styles.textDarkBlue, { fontSize: 17 }]}
                        numberOfLines={2}>
                        {(itemPet?.idPet) ? itemPet?.idPet[0]?.namePet : "Không có dữ liệu"}
                    </Text>
                    <View>
                        <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                            <Text style={{ fontWeight: 'bold' }}>{Number(itemPet?.price - (itemPet?.price * itemPet?.discount / 100)).toLocaleString()}{" đồng"}</Text>
                            {" | "}
                            <Text style={{ color: '#656565' }}>
                                <Text style={{ textDecorationLine: 'line-through' }}
                                >{Number(itemPet?.price).toLocaleString()}</Text> đồng</Text>
                        </Text>
                        <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                            Số lượng mua: {itemPet?.amount}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    React.useEffect(() => {
        if (userInfo) {
            if (userInfo?.avatarUser) {
                setsrcAvatar({ uri: String(userInfo?.avatarUser) });
            }
        }
        if (shipperInfo) {
            if (shipperInfo?.avatarShipper) {
                setsrcAvatarShipper({ uri: String(shipperInfo?.avatarShipper) });
            }
        }
    }, [item])

    return (
        <View style={styles.container}>
            <HeaderTitle colorHeader={yellowWhite} titleHeader={"Chi tiết đơn hàng"} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    colors={['#F3D2C159', '#f582aecc']} locations={[0.6, 1]}
                    style={[styles.flexRow, { paddingVertical: 12, paddingHorizontal: 15, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}>
                    <View style={{ width: '65%', }}>
                        <Text style={[styles.textDarkBlue, { fontSize: 20, fontWeight: 'bold' }]}>
                            {(statusBill?.nameStatus) ? statusBill?.nameStatus : "Không có dữ liệu"}
                        </Text>
                        <Text style={[styles.textDarkBlue, { fontSize: 15, marginTop: 2 }]}>
                            {(statusBill?.descStatus) ? statusBill?.descStatus : "Không có dữ liệu"}
                        </Text>
                    </View>
                    <View style={[{ width: '35%' }, styles.justifyCenter, styles.itemsCenter]}>
                        <MaterialCommunityIcons name={(statusBill?.iconStatus) ? statusBill?.iconStatus : "database-remove-outline"} color={darkBlue}
                            size={WindowWidth * 12 / 100} style={{ marginLeft: 15 }} />
                    </View>
                </LinearGradient>
                <>
                    <View style={[{ width: "100%", paddingVertical: 12, paddingHorizontal: 15 }]}>
                        <Text style={[styles.textDarkBlue, { fontSize: 16, fontWeight: 'bold' }]} >
                            Thông tin người nhận
                        </Text>
                        <View style={[styles.flexRow, { marginTop: 5 }]}>
                            <View style={{ width: 20 }}>
                                <MaterialCommunityIcons name='map-marker-account' color={darkBlue}
                                    size={25} style={{ left: -5 }} />
                            </View>
                            <View style={{ width: WindowWidth - 50, }}>
                                <View style={[styles.flexRow, styles.itemsFlexEnd]}>
                                    <Text style={[styles.textDarkBlue, { fontWeight: 'bold', fontSize: 16 }]}
                                        numberOfLines={1}>{item?.locationDetail?.fullName}{" | "}</Text>
                                    <Text style={styles.textDetailFade}
                                        numberOfLines={1}>+{item?.locationDetail?.phoneNumber}</Text>
                                </View>
                                <Text style={styles.textDetailFade}>{item?.locationDetail?.location}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#D8D7D4', width: '100%', height: 5 }} />
                </>
                <>
                    <View style={[{ width: "100%", paddingVertical: 12, paddingHorizontal: 15 }]} >
                        {/* Thông tin thú cưng - sản phẩm */}
                        {
                            (productInfo.length > 0)
                                ? <>
                                    <Text style={[styles.textDarkBlue, { fontSize: 17, fontWeight: 'bold', top: -5, marginBottom: 3 }]}>{(productInfo.length > 1) ? "Các sản phẩm:" : "Sản phẩm:"} </Text>
                                    <FlatList
                                        data={productInfo}
                                        renderItem={({ item, index }) =>
                                            <ItemProduct key={index} item={item}
                                                index={index} />}
                                        scrollEnabled={false}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()} />
                                </>
                                : ""
                        }
                        {
                            (petInfo)
                                ?
                                <>
                                    <Text style={[styles.textDarkBlue, { fontSize: 17, fontWeight: 'bold', top: -5, marginBottom: 3 }]}>Thú cưng: </Text>
                                    <ItemPet item={petInfo} />
                                </>
                                : ""
                        }
                        <View style={{ width: '100%', height: 1, backgroundColor: '#D2D2D2', marginTop: 0 }} />
                        {/* Thông tin khách hàng */}
                        <Text style={[styles.textDarkBlue, { fontSize: 17, fontWeight: 'bold', top: -5, marginBottom: 3, marginTop: 10 }]}>Khách hàng: </Text>
                        <View style={styles.flexRow}>
                            <View style={[{ width: 90, }, styles.itemsCenter]}>
                                <Image
                                    source={srcAvatar} onError={setErrorAvatar}
                                    style={{ width: 75, height: 75, borderRadius: 45 }} />
                            </View>
                            <View style={[styles.justifyBetween, { marginLeft: 10, width: WindowWidth - 130 }]}>
                                <Text style={[styles.textDarkBlue, { fontSize: 17 }]}
                                    numberOfLines={2}>
                                    {(userInfo?.fullName) ? userInfo?.fullName : "Không có dữ liệu"}
                                </Text>
                                <View>
                                    <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                        Số điện thoại: +{(userInfo?.phoneNumber) ? userInfo?.phoneNumber : "Không có dữ liệu"}
                                    </Text>
                                    <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                        Email: {(userInfo?.emailAddress) ? userInfo?.emailAddress : "Không có dữ liệu"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 1, backgroundColor: '#D2D2D2', marginTop: 10 }} />
                        {/* Thông tin người giao hàng */}
                        <Text style={[styles.textDarkBlue, { fontSize: 17, fontWeight: 'bold', top: -5, marginBottom: 3, marginTop: 10 }]}>Người giao hàng: </Text>
                        {
                            (shipperInfo)
                                ? <View style={styles.flexRow}>
                                    <View style={[{ width: 90, }, styles.itemsCenter]}>
                                        <Image
                                            source={srcAvatarShipper} onError={setErrorAvatarShipper}
                                            style={{ width: 75, height: 75, borderRadius: 45 }} />
                                    </View>
                                    <View style={[styles.justifyBetween, { marginLeft: 10, width: WindowWidth - 130 }]}>
                                        <Text style={[styles.textDarkBlue, { fontSize: 17 }]}
                                            numberOfLines={2}>
                                            {(shipperInfo?.fullName) ? shipperInfo?.fullName : "Không có dữ liệu"}
                                        </Text>
                                        <View>
                                            <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                                Số điện thoại: +{(shipperInfo?.phoneNumber) ? shipperInfo?.phoneNumber : "Không có dữ liệu"}
                                            </Text>
                                            <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                                Email: {(shipperInfo?.email) ? shipperInfo?.email : "Không có dữ liệu"}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                : <View style={styles.flexRow}>
                                    <View style={[{ width: 90 }, styles.itemsCenter]}>
                                        <View style={{ backgroundColor: '#d1d1d1', borderRadius: 45, width: 75, overflow: 'hidden'}}>
                                            <MaterialCommunityIcons name='account-question' color={darkBlue}
                                                size={75} />
                                        </View>
                                    </View>
                                    <View style={[styles.justifyBetween, { marginLeft: 10, width: WindowWidth - 130 }]}>
                                        <Text style={[styles.textDarkBlue, { fontSize: 17 }]}
                                            numberOfLines={2}>
                                            Chưa có người giao hàng
                                        </Text>
                                    </View>
                                </View>
                        }
                        {/* Liên hệ */}
                        <View style={{ width: '100%', height: 1, backgroundColor: '#D2D2D2', marginTop: 10 }} />
                        <TouchableOpacity style={[styles.flexRow, styles.itemsCenter, { paddingTop: 10 }]}
                            onPress={onContactWithCustomer}>
                            <MaterialCommunityIcons name='message-arrow-right-outline' color={darkBlue}
                                size={22} />
                            <Text style={[styles.textDarkBlue, { fontSize: 16, marginLeft: 7 }]}>Liên hệ với khách hàng</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: '#D8D7D4', width: '100%', height: 5 }} />
                </>
                <>
                    <View style={[{ width: "100%", paddingVertical: 12, paddingHorizontal: 15 }]} >
                        <Text style={[styles.textDarkBlue, { fontSize: 16, fontWeight: 'bold' }]} >
                            Chi tiết thanh toán
                        </Text>
                        {
                            (productInfo.length > 0)
                                ? <>
                                    <View style={[styles.flexRow, { marginTop: 5 }]}>
                                        <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                            Tổng tiền sản phẩm
                                            {/* ({item?.products[0]?.amount} sp) */}
                                        </Text>
                                        <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                            {Number(item?.totalProduct).toLocaleString()} ₫
                                        </Text>
                                    </View>
                                    <View style={[styles.flexRow, { marginTop: 5 }]}>
                                        <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                            Tổng tiền giảm giá
                                        </Text>
                                        <Text style={[{ width: '50%', color: '#FD3F3F', fontSize: 15, textAlign: 'right' }]} >
                                            -{Number(item?.discountBill).toLocaleString()} ₫
                                        </Text>
                                    </View>
                                </>
                                : ""
                        }
                        {
                            (petInfo)
                                ? <>
                                    <View style={[styles.flexRow, { marginTop: 5 }]}>
                                        <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                            Giá tiền thú cưng
                                        </Text>
                                        <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                            {Number(petInfo?.price * petInfo?.amount).toLocaleString()} ₫
                                        </Text>
                                    </View>
                                    <View style={[styles.flexRow, { marginTop: 5 }]}>
                                        <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                            Số tiền giảm giá ({petInfo?.discount} %)
                                        </Text>
                                        <Text style={[{ width: '50%', color: '#FD3F3F', fontSize: 15, textAlign: 'right' }]} >
                                            -{Number(item?.discountBill).toLocaleString()} ₫
                                        </Text>
                                    </View>
                                </>
                                : ""
                        }
                        {/* <View style={[styles.flexRow, { marginTop: 5 }]}>
                            <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                Phí vận chuyển
                            </Text>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                +{Number(item?.moneyShip).toLocaleString()} ₫
                            </Text>
                        </View> */}
                        <View style={{ width: '100%', height: 1, backgroundColor: '#D2D2D2', marginTop: 5 }} />
                        <View style={[styles.flexRow, { marginTop: 5 }]}>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 16, fontWeight: 'bold' }]} >
                                Tổng cộng
                            </Text>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 16, fontWeight: 'bold', textAlign: 'right' }]} >
                                {Number(item?.total).toLocaleString()} ₫
                            </Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#D8D7D4', width: '100%', height: 5 }} />
                </>
                <>
                    <View style={[{ width: "100%", paddingVertical: 12, paddingHorizontal: 15 }]} >
                        <View style={[styles.flexRow]}>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 16, fontWeight: 'bold' }]} >
                                Phương thức thanh toán
                            </Text>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                {item?.paymentMethods}
                            </Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#D8D7D4', width: '100%', height: 5 }} />
                </>
                <>
                    <View style={[{ width: "100%", paddingVertical: 12, paddingHorizontal: 15 }]} >
                        <Text style={[styles.textDarkBlue, { fontSize: 16, fontWeight: 'bold' }]} >
                            Thông tin đơn hàng
                        </Text>
                        <View style={[styles.flexRow, { marginTop: 5 }]}>
                            <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                Ngày đặt hàng
                            </Text>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                {(item?.purchaseDate) ? getDateTimeDefault(item?.purchaseDate) : "Không có dữ liệu"}
                            </Text>
                        </View>
                        {
                            (item?.billDate?.paidAt)
                                ? <View style={[styles.flexRow, { marginTop: 5 }]}>
                                    <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                        Ngày thanh toán
                                    </Text>
                                    <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                        {(item?.billDate?.paidAt) ? getDateTimeDefault(item?.billDate?.paidAt) : "Không có dữ liệu"}
                                    </Text>
                                </View>
                                : ""
                        }
                        {
                            (item?.billDate?.confirmedAt)
                                ? <View style={[styles.flexRow, { marginTop: 5 }]}>
                                    <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                        Ngày duyệt đơn
                                    </Text>
                                    <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                        {(item?.billDate?.confirmedAt) ? getDateTimeDefault(item?.billDate?.confirmedAt) : "00/00/0000 00:00 XX"}
                                    </Text>
                                </View>
                                : ""
                        }
                        {
                            (item?.billDate?.deliveringAt)
                                ? <View style={[styles.flexRow, { marginTop: 5 }]}>
                                    <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                        Ngày gửi hàng
                                    </Text>
                                    <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                        {(item?.billDate?.deliveringAt) ? getDateTimeDefault(item?.billDate?.deliveringAt) : "00/00/0000 00:00 ??"}
                                    </Text>
                                </View>
                                : ""
                        }
                        {
                            (item?.billDate?.deliveredAt)
                                ? <View style={[styles.flexRow, { marginTop: 5 }]}>
                                    <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                        Ngày giao hàng
                                    </Text>
                                    <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                        {(item?.billDate?.deliveredAt) ? getDateTimeDefault(item?.billDate?.deliveredAt) : "??/??/???? ??:?? ??"}
                                    </Text>
                                </View>
                                : ""
                        }
                        {
                            (item?.billDate?.receivedAt)
                                ? <View style={[styles.flexRow, { marginTop: 5 }]}>
                                    <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                        Ngày nhận hàng
                                    </Text>
                                    <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                        {(item?.billDate?.receivedAt) ? getDateTimeDefault(item?.billDate?.receivedAt) : "Lỗi dữ liệu"}
                                    </Text>
                                </View>
                                : ""
                        }
                        {
                            (item?.billDate?.ratedAt)
                                ? <View style={[styles.flexRow, { marginTop: 5 }]}>
                                    <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                        Ngày đánh giá
                                    </Text>
                                    <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                        {(item?.billDate?.ratedAt) ? getDateTimeDefault(item?.billDate?.ratedAt) : "Không tìm thấy dữ liệu"}
                                    </Text>
                                </View>
                                : ""
                        }
                    </View>
                    <View style={{ backgroundColor: '#D8D7D4', width: '100%', height: 5 }} />
                </>
                <>
                    <View style={{ marginBottom: 15, paddingRight: 15 }}>
                        {
                            (statusBill?.status == 0)
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
                                : <View style={[styles.flexRow, styles.justifyFlexend]}>
                                    {
                                        (statusBill?.status == 1)
                                            ? <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#F85555', backgroundColor: yellowWhite }]}
                                                activeOpacity={0.5} underlayColor="#EE3F3F"
                                                onPress={onShowAlertCancel}>
                                                <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#F85555', fontWeight: 'bold' }]}>
                                                    Hủy đơn
                                                </Text>
                                            </TouchableHighlight>
                                            : ""
                                    }
                                </View>
                        }
                        <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#8E8E8E', backgroundColor: yellowWhite }]}
                            activeOpacity={0.5} underlayColor="#6D6D6D"
                            onPress={onGoBack}>
                            <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#8E8E8E', fontWeight: 'bold' }]}>Quay lại</Text>
                        </TouchableHighlight>
                    </View>
                </>
            </ScrollView>
        </View>
    );
}

export default memo(DetailBill);