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

const ItemBill = (row) => {
    const [srcImage, setsrcImage] = useState(require('../../assets/images/loading.png'))
    let item = row.item;

    function setErrorImage() {
        setsrcImage(require('../../assets/images/error.png'));
    }

    function onOpenDetailBill() {
        onNavigate('DetailBill', { bill: item });
    }

    function onShowAlert() {
        Toast.show({
            type: 'alert',
            text1: 'Xác nhận xóa thú cưng?',
            position: 'top',
            props: {
                confirm: () => { },
                cancel: () => Toast.hide()
            },
            autoHide: false
        })
    }

    React.useEffect(() => {
        if (item.products) {
            if (item?.products.length > 0
                && item?.products[0]?.idProduct?.arrProduct.length > 0
                && srcImage == require('../../assets/images/loading.png')) {
                setsrcImage({ uri: String(item?.products[0]?.idProduct?.arrProduct[0]) });
            }
        }
    }, [item])

    return (
        <>
            <View style={{ padding: 15 }}>
                <View style={[styles.flexRow, styles.itemsCenter, styles.justifyBetween, { width: '100%', }]}>
                    <View style={[styles.flexRow, styles.itemsCenter, { width: '65%' }]}>
                        <Image source={{ uri: String(item?.idUser?.avatarUser) }}
                            style={{ height: 20, width: 20, borderRadius: 20 }} />
                        <Text style={[styles.textDarkBlue, { fontSize: 17, marginLeft: 5 }]}
                            numberOfLines={1} ellipsizeMode='tail'>
                            {item?.idUser?.fullName}
                        </Text>
                    </View>
                    <View style={[{ width: '30%', }]}>
                        <Text style={[styles.textDarkBlue,
                        { fontSize: 15, textAlign: 'right', fontWeight: 'bold', color: String(item?.colorStatus) }]} numberOfLines={1}>
                            {item?.nameStatus}
                        </Text>
                    </View>
                </View>
                <View
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
                            {item?.products[0]?.idProduct?.nameProduct}
                        </Text>
                        <View>
                            <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                <Text style={{ fontWeight: 'bold' }}>{Number(item?.products[0]?.price - (item?.products[0]?.price * item?.products[0]?.discount / 100)).toLocaleString()}{" đồng"}</Text>
                                {" | "}
                                <Text style={{ color: '#656565' }}>
                                    <Text style={{ textDecorationLine: 'line-through' }}
                                    >{Number(item?.products[0]?.price).toLocaleString()}</Text> đồng</Text>
                            </Text>
                            <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                Số lượng: {item?.products[0]?.amount}{" | "}{getDateDefault(item?.createdAt)}
                            </Text>
                        </View>
                    </View>
                </View>
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
                                    onPress={() => { }}>
                                    <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#F85555', fontWeight: 'bold' }]}>
                                        Hủy nhận
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#55B938', backgroundColor: yellowWhite }]}
                                    activeOpacity={0.5} underlayColor="#67CA4A"
                                    onPress={() => { }}>
                                    <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#001858', fontWeight: 'bold' }]}>
                                        Xác nhận
                                    </Text>
                                </TouchableHighlight>
                            </View>
                            : <>
                                {
                                    (item?.deliveryStatus == 1)
                                        ? <View style={[styles.flexRow, styles.justifyFlexend]}>
                                            <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#F85555' }]}
                                                activeOpacity={0.5} underlayColor="#EE3F3F"
                                                onPress={() => { }}>
                                                <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#001858', fontWeight: 'bold' }]}>
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
    )
}

export default memo(ItemBill);