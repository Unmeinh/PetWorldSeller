import React, { useState } from 'react';
import {
    Text, View,
    Image, TouchableOpacity
} from 'react-native';
import styles, { WindowWidth, darkBlue, yellowWhite } from '../../styles/all.style';
import { memo } from 'react';
import HeaderTitle from '../../components/header/HeaderTitle';
import { getDateTimeDefault } from '../../utils/functionSupport';
import { onAxiosGet } from '../../api/axios.function';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const AccountOwner = ({ route }) => {
    let idShop = route?.params?.idShop;
    const [owner, setowner] = useState({
        nameIdentity: "V* ***** ***** ***h",
        numberIdentity: "03********87",
        dateIdentity: "25/10/2003",
        imageIdentity: ["https://i.ebayimg.com/images/g/b4oAAOSwrqlZgldr/s-l1200.webp", "https://product-images.tcgplayer.com/fit-in/437x437/113956.jpg"],
        nameCard: "V* ***** ***** ***H",
        numberCard: "**** **** **** *278",
        nameBank: "MBBank",
        expirationDate: "**/**",
        createdAt: new Date('2023-10-25').toISOString()
    });
    const [srcFrontCard, setsrcFrontCard] = useState(require('../../assets/images/loading.png'))
    const [srcBehindCard, setsrcBehindCard] = useState(require('../../assets/images/loading.png'))
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
        if (owner != undefined) {
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
                            <Text
                                numberOfLines={2}
                                style={[styles.textDarkBlue, {
                                    fontSize: 16, fontWeight: 'bold',
                                    width: '100%',
                                }]}>
                                {(owner?.nameIdentity != undefined) ? owner?.nameIdentity : "Lỗi dữ liệu"}
                            </Text>
                        </View>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Ngày sinh: </Text>
                            <Text
                                numberOfLines={2}
                                style={[styles.textDarkBlue, {
                                    fontSize: 16, fontWeight: 'bold',
                                    width: '100%',
                                }]}>
                                {(owner?.dateIdentity != undefined) ? owner?.dateIdentity : "Lỗi dữ liệu"}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ paddingBottom: 20 }}>
                    <View style={[styles.flexRow, styles.justifyBetween]}>
                        <View style={{ width: "47%", }}>
                            <Text style={styles.titleDetail}>Số căn cước: </Text>
                            <Text
                                style={[styles.textDarkBlue, {
                                    fontSize: 16, fontWeight: 'bold',
                                    width: '100%',
                                }]}>
                                {owner?.numberIdentity ? owner?.numberIdentity : "Lỗi dữ liệu"}
                            </Text>
                        </View>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Ngày tham gia: </Text>
                            <Text
                                numberOfLines={2}
                                style={[styles.textDarkBlue, {
                                    fontSize: 16, fontWeight: 'bold',
                                    width: '100%',
                                }]}>
                                {(owner?.createdAt != undefined) ? getDateTimeDefault(owner?.createdAt) : "Lỗi dữ liệu"}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ paddingBottom: 20 }}>
                    <View style={[styles.flexRow, styles.justifyBetween]}>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Mặt trước: </Text>
                            <TouchableOpacity style={{ width: '100%', aspectRatio: 3 / 2, borderRadius: 5, overflow: 'hidden' }}
                            onPress={() => onAlertShowCard("FrontCard")}>
                                {
                                    (isShowFrontCard)
                                        ? <Image blurRadius={20}
                                            source={srcFrontCard} onError={() => setErrorImage("FrontCard")}
                                            style={{ width: "100%", height: "100%", borderRadius: 10 }} />
                                        : <>
                                            <Image blurRadius={15}
                                                source={srcFrontCard} onError={() => setErrorImage("FrontCard")}
                                                style={{ width: "100%", height: "100%", borderRadius: 10 }} />
                                            <View style={[styles.positionAbsolute, styles.itemsCenter, { top: '30%', left: '36%' }]}>
                                                <MaterialCommunityIcons name='eye' color={'#fff'} size={25} />
                                                <Text style={{ color: '#fff' }}>Hiển thị</Text>
                                            </View>
                                        </>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Mặt sau: </Text>
                            <TouchableOpacity style={{ width: '100%', aspectRatio: 3 / 2, borderRadius: 5, overflow: 'hidden' }}
                            onPress={() => onAlertShowCard("BehindCard")}>
                                {
                                    (isShowBehindCard)
                                        ? <Image blurRadius={0}
                                            source={srcBehindCard} onError={() => setErrorImage("BehindCard")}
                                            style={{ width: "100%", height: "100%", borderRadius: 10 }} />
                                        : <>
                                            <Image blurRadius={15}
                                                source={srcBehindCard} onError={() => setErrorImage("BehindCard")}
                                                style={{ width: "100%", height: "100%", borderRadius: 10 }} />
                                            <View style={[styles.positionAbsolute, styles.itemsCenter, { top: '30%', left: '36%' }]}>
                                                <MaterialCommunityIcons name='eye' color={'#fff'} size={25} />
                                                <Text style={{ color: '#fff' }}>Hiển thị</Text>
                                            </View>
                                        </>
                                }
                            </TouchableOpacity>
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
                            <Text style={styles.titleDetail}>Tên trên thẻ: </Text>
                            <Text
                                numberOfLines={2}
                                style={[styles.textDarkBlue, {
                                    fontSize: 16, fontWeight: 'bold',
                                    width: '100%',
                                }]}>
                                {(owner?.nameCard != undefined) ? owner?.nameCard : "Lỗi dữ liệu"}
                            </Text>
                        </View>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Số thẻ: </Text>
                            <Text
                                numberOfLines={2}
                                style={[styles.textDarkBlue, {
                                    fontSize: 16, fontWeight: 'bold',
                                    width: '100%',
                                }]}>
                                {(owner?.numberCard != undefined) ? owner?.numberCard : "Lỗi dữ liệu"}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ paddingBottom: 20 }}>
                    <View style={[styles.flexRow, styles.justifyBetween]}>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Tên ngân hàng: </Text>
                            <Text
                                numberOfLines={2}
                                style={[styles.textDarkBlue, {
                                    fontSize: 16, fontWeight: 'bold',
                                    width: '100%',
                                }]}>
                                {(owner?.nameBank != undefined) ? owner?.nameBank : "Lỗi dữ liệu"}
                            </Text>
                        </View>
                        <View style={{ width: '47%', }}>
                            <Text style={styles.titleDetail}>Ngày hết hạn: </Text>
                            <Text
                                numberOfLines={2}
                                style={[styles.textDarkBlue, {
                                    fontSize: 16, fontWeight: 'bold',
                                    width: '100%',
                                }]}>
                                {(owner?.expirationDate != undefined) ? owner?.expirationDate : "Lỗi dữ liệu"}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default memo(AccountOwner);