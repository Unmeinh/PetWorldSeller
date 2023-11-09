import React, { useState } from 'react';
import {
    Text, View,
    Image, ScrollView,
    FlatList,
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

const DetailBill = ({ route }) => {
    let item = route.params.bill;
    let productInfo = [...item?.productInfo[0], ...item?.productInfo[0], ...item?.productInfo[0]];
    let petInfo = item?.petInfo[0];
    let userInfo = item?.userInfo[0];
    const [srcAvatar, setsrcAvatar] = useState(require('../../assets/images/loading.png'))

    function setErrorAvatar() {
        setsrcAvatar(require('../../assets/images/error.png'));
    }

    function onContactWithCustomer() {
        Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Tính năng này đang được phát triển!',
        })
    }

    const ItemProduct = (row) => {
        let itemProduct = row.item;
        const [srcImage, setsrcImage] = useState(require('../../assets/images/loading.png'))

        function setErrorImage() {
            setsrcImage(require('../../assets/images/error.png'));
        }

        function onOpenDetailProduct() {
            onNavigate("DetailProduct", { product: itemProduct.idProduct[0] })
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
            onNavigate("DetailPet", { pet: itemPet.idPet[0] })
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
                            {(item?.nameStatus) ? item?.nameStatus : "Không có dữ liệu"}
                        </Text>
                        <Text style={[styles.textDarkBlue, { fontSize: 15, marginTop: 2 }]}>
                            {(item?.descStatus) ? item?.descStatus : "Không có dữ liệu"}
                        </Text>
                    </View>
                    <View style={[{ width: '35%' }, styles.justifyCenter, styles.itemsCenter]}>
                        <MaterialCommunityIcons name={(item?.iconStatus) ? item?.iconStatus : "database-remove-outline"} color={darkBlue}
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
                                {(item?.createdAt) ? getDateTimeDefault(item?.createdAt) : "Không có dữ liệu"}
                            </Text>
                        </View>
                        <View style={[styles.flexRow, { marginTop: 5 }]}>
                            <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                Ngày thanh toán
                            </Text>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                {/* {(item?.paidAt) ? getDateTimeDefault(item?.paidAt) : "Không có dữ liệu"} */}
                                {(item?.purchaseDate) ? getDateTimeDefault(item?.purchaseDate) : "Không có dữ liệu"}
                            </Text>
                        </View>
                        <View style={[styles.flexRow, { marginTop: 5 }]}>
                            <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                Ngày duyệt hàng
                            </Text>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                {(item?.confirmedAt) ? getDateTimeDefault(item?.confirmedAt) : "00/00/0000 00:00 XX"}
                            </Text>
                        </View>
                        <View style={[styles.flexRow, { marginTop: 5 }]}>
                            <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                Ngày gửi hàng
                            </Text>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                {(item?.deliveringAt) ? getDateTimeDefault(item?.deliveringAt) : "00/00/0000 00:00 ??"}
                            </Text>
                        </View>
                        <View style={[styles.flexRow, { marginTop: 5 }]}>
                            <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                Ngày giao hàng
                            </Text>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                {(item?.deliveredAt) ? getDateTimeDefault(item?.deliveredAt) : "??/??/???? ??:?? ??"}
                            </Text>
                        </View>
                        <View style={[styles.flexRow, { marginTop: 5 }]}>
                            <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                Ngày nhận hàng
                            </Text>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                {(item?.receivedAt) ? getDateTimeDefault(item?.receivedAt) : "Lỗi dữ liệu"}
                            </Text>
                        </View>
                        <View style={[styles.flexRow, { marginTop: 5 }]}>
                            <Text style={[styles.textDetailFade, { width: '50%', fontSize: 15 }]} >
                                Ngày đánh giá
                            </Text>
                            <Text style={[styles.textDarkBlue, { width: '50%', fontSize: 15, textAlign: 'right' }]} >
                                {(item?.evaluatedAt) ? getDateTimeDefault(item?.evaluatedAt) : "Không tìm thấy dữ liệu"}
                            </Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: '#D8D7D4', width: '100%', height: 5 }} />
                </>
                <>
                    <View style={{ marginBottom: 15, paddingRight: 15 }}>
                        {
                            (item?.deliveryStatus == 0)
                                ? <View style={[styles.flexRow, styles.justifyFlexend]}>
                                    <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#F85555', backgroundColor: yellowWhite }]}
                                        activeOpacity={0.5} underlayColor="#EE3F3F"
                                        onPress={() => { }}>
                                        <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#F85555', fontWeight: 'bold' }]}>
                                            Hủy nhận
                                        </Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#55B938', backgroundColor: yellowWhite }]}
                                        activeOpacity={0.5} underlayColor="#67CA4A"
                                        onPress={() => { }}>
                                        <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#449E2A', fontWeight: 'bold' }]}>
                                            Xác nhận
                                        </Text>
                                    </TouchableHighlight>
                                </View>
                                : <>
                                    {
                                        (item?.deliveryStatus == 1)
                                            ? <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#F85555' }]}
                                                activeOpacity={0.5} underlayColor="#EE3F3F"
                                                onPress={() => { }}>
                                                <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#001858', fontWeight: 'bold' }]}>
                                                    Hủy đơn
                                                </Text>
                                            </TouchableHighlight>
                                            : ""
                                    }
                                </>
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