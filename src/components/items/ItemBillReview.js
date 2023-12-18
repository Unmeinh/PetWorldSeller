import React, { memo, useState } from 'react';
import {
    Text, View,
    Image, Keyboard,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';
import styles, { WindowWidth, darkBlue, yellowWhite } from '../../styles/all.style';
import { getDateDefault } from '../../utils/functionSupport';
import DetailReviewModal from '../modals/DetailReviewModal';

const ItemBill = (row) => {
    const [srcImage, setsrcImage] = useState(require('../../assets/images/loading.png'))
    const [srcAvatar, setsrcAvatar] = useState(require('../../assets/images/loading.png'))
    const [item, setitem] = useState(row.item)
    const [product, setproduct] = useState({});
    const [pet, setpet] = useState({})
    const [user, setuser] = useState({});
    const [isShowReview, setisShowReview] = useState(false);

    function setErrorImage() {
        setsrcImage(require('../../assets/images/error.png'));
    }

    function setErrorAvatar() {
        setsrcAvatar(require('../../assets/images/error.png'));
    }

    function onOpenDetailReview() {
        setisShowReview(!isShowReview);
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
        <TouchableHighlight disabled
            activeOpacity={0.5} underlayColor="#0000001A" >
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
                            {
                                (item?.statusReview)
                                    ? <Text style={[styles.textDarkBlue,
                                    { fontSize: 15, textAlign: 'right', fontWeight: 'bold', color: "#009A62" }]}
                                        numberOfLines={1}>
                                        Đã đánh giá
                                    </Text>
                                    : <Text style={[styles.textDarkBlue,
                                    { fontSize: 15, textAlign: 'right', fontWeight: 'bold', color: "#FD3F3F" }]}
                                        numberOfLines={1}>
                                        Chưa đánh giá
                                    </Text>
                            }
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
                                <TouchableOpacity disabled>
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
                                            <Text style={{ fontWeight: 'bold' }}>{Number(product?.price - (product?.price * product?.discount / 100)).toLocaleString()}{" ₫"}</Text>
                                            {" | "}
                                            <Text style={{ color: '#656565' }}>
                                                <Text style={{ textDecorationLine: 'line-through' }}
                                                >{Number(product?.price).toLocaleString()}</Text> ₫</Text>
                                        </Text>
                                        <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                            Số lượng: {product?.amount}{" | "}{getDateDefault(item?.purchaseDate)}
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
                                <TouchableOpacity disabled>
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
                                            <Text style={{ fontWeight: 'bold' }}>{Number(pet?.price - (pet?.price * pet?.discount / 100)).toLocaleString()}{" ₫"}</Text>
                                            {" | "}
                                            <Text style={{ color: '#656565' }}>
                                                <Text style={{ textDecorationLine: 'line-through' }}
                                                >{Number(pet?.price).toLocaleString()}</Text> ₫</Text>
                                        </Text>
                                        <Text style={[styles.textDarkBlue, { fontSize: 15 }]} numberOfLines={1}>
                                            Số lượng: {pet?.amount}{" | "}{getDateDefault(item?.purchaseDate)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                    }
                    <View style={[styles.justifyFlexend]}>
                        <Text style={[styles.textDarkBlue,
                        { fontSize: 17, textAlign: 'right', fontWeight: 'bold' }]} numberOfLines={1}>
                            Tổng tiền:
                            <Text style={{ color: '#FD3F3F' }}> {Number(item.total).toLocaleString()} ₫</Text>
                        </Text>
                        {
                            (item?.statusReview)
                                ? <View style={[styles.flexRow, styles.justifyFlexend]}>
                                    <TouchableHighlight style={[styles.buttonEditAccount, { borderColor: '#F582AE', backgroundColor: yellowWhite }]}
                                        activeOpacity={0.5} underlayColor="#E974A1"
                                        onPress={onOpenDetailReview}>
                                        <Text style={[styles.textButtonFormSmall, { fontSize: 16, color: '#F582AE', fontWeight: 'bold' }]}>
                                            Xem đánh giá
                                        </Text>
                                    </TouchableHighlight>
                                </View>
                                : <></>
                        }
                    </View>
                </View>
                <View style={{ backgroundColor: '#D8D7D4', width: '100%', height: 5 }} />
                {isShowReview &&
                    <DetailReviewModal isShow={isShowReview} onCallbackHide={onOpenDetailReview} idBill={item?._id} user={user}/>
                }
            </>
        </TouchableHighlight>
    )
}

export default memo(ItemBill);