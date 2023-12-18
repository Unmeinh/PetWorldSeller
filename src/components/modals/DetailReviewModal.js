import {
    Text, Pressable,
    View, FlatList,
    TouchableHighlight,
    Image
} from "react-native";
import React, { useState, useRef, memo } from "react";
import Modal from 'react-native-modal';
import styles, { WindowWidth, darkBlue } from "../../styles/all.style";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ShimmerPlaceHolder from "../layout/ShimmerPlaceHolder";
import { getDateTimeVietnamese } from "../../utils/functionSupport";
import BlogImageSlider from "../slider/BlogImageSlider";
import { onAxiosGet } from "../../api/axios.function";
const widthModal = WindowWidth * 0.95;
const DetailReviewModal = (route) => {
    const [isLoading, setisLoading] = useState(true);
    const [reviews, setreviews] = useState([]);

    async function getReview(idBill) {
        let res = await onAxiosGet('shop/bill/review/' + idBill);
        if (res) {
            setreviews(res.data);
            setisLoading(false);
        } else {
            setisLoading(false);
        }
    }

    const ItemReview = (row) => {
        const [stars, setstars] = useState([]);
        const [images, setimages] = useState([]);

        React.useEffect(() => {
            setstars(row?.review?.stars);
            setimages(row?.review?.imageReview);
        }, [row?.review])

        return (
            <>
                <View style={{ flexDirection: 'row', width: widthModal - 30 }}>
                    <Image source={(route?.user?.avatarUser) ? { uri: route?.user?.avatarUser } : require('../../assets/images/error.png')}
                        style={{ width: '20%', aspectRatio: 1, borderRadius: 100 }} />
                    <View style={{ marginLeft: 10, width: '85%', }}>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <View style={{ flexDirection: 'row' }}>
                                {
                                    (stars)
                                        ? stars.map((item, index, arr) =>
                                            <Ionicons key={index} name={item?.nameIcon} color={item?.colorIcon} size={17} style={{ marginRight: 2 }} />)
                                        : <></>
                                }
                            </View>
                            <View style={{ flexDirection: 'row', width: '80%' }}>
                                <Text style={[styles.textTime, { top: '0.9%', width: '77%', }]} numberOfLines={2}>
                                    {"• "}{row?.review?.createdAt ? getDateTimeVietnamese(row?.review?.createdAt) : ""}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.textDarkBlue, { fontSize: 16, fontWeight: 'bold', marginTop: 5 }]}>{(route?.user?.fullName) ? route?.user?.fullName : "Lỗi dữ liệu"}</Text>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <Text style={[styles.textDarkBlue, { fontSize: 15, width: '97%', }]}>{row?.review?.contentReview}</Text>
                        </View>
                    </View>
                </View>
                {
                    (images && images.length > 0)
                        ?
                        <Pressable style={{ width: '100%', marginTop: 10 }}>
                            <FlatList
                                horizontal
                                pagingEnabled
                                snapToAlignment="center"
                                showsHorizontalScrollIndicator={false}
                                data={images}
                                renderItem={({ item }) =>
                                    <Pressable>
                                        <Image source={{ uri: String(item) }} style={{ width: WindowWidth * 0.475 - 30, marginHorizontal: 7.5, aspectRatio: 1, borderRadius: 10 }} />
                                    </Pressable>}
                            />
                        </Pressable>
                        : <></>
                }
                <View style={{ marginTop: 10, padding: 3, backgroundColor: '#CECECE', borderRadius: 5, flexDirection: 'row' }}>
                    <Image source={{ uri: (row?.review?.idProduct?.imagesPet) ? String(row?.review?.idProduct?.imagesPet[0]) : String(row?.review?.idProduct?.arrProduct[0]) }}
                        style={{ width: '10%', aspectRatio: 1, borderRadius: 5 }} />
                    <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                        <Text style={[styles.textDarkBlue, { width: '95%' },]} numberOfLines={2}>
                            {(row?.review?.idProduct?.namePet) ? String(row?.review?.idProduct?.namePet) : String(row?.review?.idProduct?.nameProduct)}
                        </Text>
                    </View>
                </View>
                <View style={{ width: '100%', height: 1.5, marginVertical: 10, backgroundColor: '#B5B5B5' }}></View>
            </>
        )
    }

    const ItemReviewLoading = () => {
        return (
            <>
                <View style={{ flexDirection: 'row', width: widthModal - 30 }}>
                    <ShimmerPlaceHolder
                        shimmerStyle={{ width: '20%', aspectRatio: 1, borderRadius: 100 }} />
                    <View style={{ marginLeft: 10, width: '85%', }}>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <ShimmerPlaceHolder shimmerStyle={{ marginRight: 2, width: 17, height: 17, borderRadius: 5 }} />
                                <ShimmerPlaceHolder shimmerStyle={{ marginRight: 2, width: 17, height: 17, borderRadius: 5 }} />
                                <ShimmerPlaceHolder shimmerStyle={{ marginRight: 2, width: 17, height: 17, borderRadius: 5 }} />
                                <ShimmerPlaceHolder shimmerStyle={{ marginRight: 2, width: 17, height: 17, borderRadius: 5 }} />
                                <ShimmerPlaceHolder shimmerStyle={{ marginRight: 2, width: 17, height: 17, borderRadius: 5 }} />
                            </View>
                            <View style={{ flexDirection: 'row', width: '80%', alignItems: 'flex-end' }}>
                                <ShimmerPlaceHolder shimmerStyle={{ width: '50%', height: 13, borderRadius: 5, marginLeft: 3 }} />
                            </View>
                        </View>
                        <ShimmerPlaceHolder shimmerStyle={{ width: '30%', height: 16, borderRadius: 5, marginTop: 10 }} />
                        <ShimmerPlaceHolder shimmerStyle={{ width: '70%', height: 15, borderRadius: 5, marginTop: 7 }} />
                    </View>
                </View>
                <Pressable style={{ width: '100%', marginTop: 10, flexDirection: 'row' }}>
                    <ShimmerPlaceHolder shimmerStyle={{ width: WindowWidth * 0.475 - 30, marginHorizontal: 7.5, height: WindowWidth * 0.475 - 30, borderRadius: 10 }} />
                    <ShimmerPlaceHolder shimmerStyle={{ width: WindowWidth * 0.475 - 30, marginHorizontal: 7.5, height: WindowWidth * 0.475 - 30, borderRadius: 10 }} />
                </Pressable>
                <View style={{ marginTop: 10, padding: 3, backgroundColor: '#CECECE', borderRadius: 5, flexDirection: 'row' }}>
                    <ShimmerPlaceHolder
                        shimmerStyle={{ width: WindowWidth * 0.10, height: WindowWidth * 0.10, borderRadius: 5 }} />
                    <View style={{ flexDirection: 'row', marginLeft: 5 }}>
                        <ShimmerPlaceHolder shimmerStyle={[styles.textDarkBlue, { width: '50%', borderRadius: 5, marginVertical: 3 },]} />
                    </View>
                </View>
                <View style={{ width: '100%', height: 1.5, marginVertical: 10, backgroundColor: '#B5B5B5' }}></View>
            </>
        )
    }

    React.useEffect(() => {
        if (route.isShow) {
            setisLoading(true);
            setTimeout(() => {
                if (route?.idBill) {
                    getReview(route?.idBill);
                }
            }, 400);
        }
    }, [route.isShow]);

    return (
        <Modal
            animationIn={'slideInLeft'}
            animationOut={'slideOutRight'}
            animationOutTiming={350}
            animationInTiming={350}
            isVisible={route.isShow}
            swipeDirection="down"
            propagateSwipe={true}
            onSwipeComplete={route?.onCallbackHide}
            onBackdropPress={route?.onCallbackHide}
            onBackButtonPress={route?.onCallbackHide}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }} >
                <View style={{
                    backgroundColor: '#fff', width: widthModal,
                    padding: 10, borderRadius: 10
                }}>
                    <View style={{ width: widthModal - 30, alignItems: 'center' }}>
                        <View style={styles.swipeControlModal} />
                    </View>
                    {
                        (isLoading)
                            ? <Pressable style={{ marginTop: 15, marginBottom: 10, width: widthModal - 30, overflow: 'visible' }}>
                                <ItemReviewLoading />
                            </Pressable>
                            : <Pressable style={{ marginTop: 15, marginBottom: 10, width: widthModal - 30, overflow: 'visible' }}>
                                <FlatList
                                    data={reviews}
                                    renderItem={({ item, index }) =>
                                        <ItemReview review={item} key={index} />}
                                />
                            </Pressable>
                    }
                </View>
                {/* <ToastLayout /> */}
            </View >
        </Modal >
    );
};

export default memo(DetailReviewModal);