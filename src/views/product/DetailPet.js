import React, { useState, useRef, memo } from 'react';
import {
    Text, View,
    Image, ScrollView,
    FlatList
} from 'react-native';
import styles, { WindowWidth, yellowWhite } from '../../styles/all.style';
import HeaderTitle from '../../components/header/HeaderTitle';
import { getDateTimeDefault } from '../../utils/functionSupport';
import { useNavigation } from '@react-navigation/native';
import { onAxiosGet } from '../../api/axios.function';
import ShimmerPlaceHolder from '../../components/layout/ShimmerPlaceHolder';

const DetailPet = ({ route }) => {
    const navigation = useNavigation();
    let flatListRef = useRef();
    let timeoutSlideRef = useRef();
    const [item, setitem] = useState({});
    const [indexImage, setindexImage] = useState(1);
    const [onHandleScrollEnd, setonHandleScrollEnd] = useState(false);
    const [isLoading, setisLoading] = useState(true);

    async function getDetailPet() {
        let res = await onAxiosGet('shop/pet/detail/' + route.params.idPet);
        if (res && res.success) {
            setitem(res.data);
            setisLoading(false);
        }
    }

    let onScrollEnd = (event) => {
        const index = Math.floor(
            Math.floor(event.nativeEvent.contentOffset.x) /
            Math.floor(event.nativeEvent.layoutMeasurement.width)
        );
        setindexImage(index);
        setonHandleScrollEnd(true);
    }

    function autoChangeIndex() {
        if (indexImage < item?.imagesPet.length - 1) {
            let i = Number(indexImage) + 1;
            setindexImage(i);
        } else {
            setindexImage(0);
        }
    }

    const ImagesHorizontal = ({ item }) => {
        const [srcImage, setsrcImage] = useState(null)

        function setErrorImage() {
            setsrcImage(require('../../assets/images/error.png'));
        }

        return (
            <Image
                source={(srcImage ? srcImage : {uri: String(item)})} onError={setErrorImage} 
                style={{ width: 90, height: 90, borderRadius: 10 }} />
        )
    }

    React.useEffect(() => {
        if (item?.imagesPet && item?.imagesPet.length > 0) {
            flatListRef?.current?.scrollToIndex({ index: indexImage, animated: true });
            if (!onHandleScrollEnd) {
                timeoutSlideRef.current = setTimeout(() => {
                    autoChangeIndex();
                }, 3000);
            } else {
                clearTimeout(timeoutSlideRef.current)
                setTimeout(() => {
                    setonHandleScrollEnd(false);
                }, 3000);
            }
        }
    }, [indexImage, item?.imagesPet, onHandleScrollEnd]);

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            getDetailPet();
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <HeaderTitle colorHeader={yellowWhite} titleHeader={"Chi tiết thú cưng"} />
            {
                (isLoading)
                    ? <View style={{ padding: 15 }}>
                        <View style={[styles.flexRow, { width: "100%", paddingBottom: 20 }]}>
                            <ShimmerPlaceHolder
                                shimmerStyle={{ width: 90, height: 90, borderRadius: 10 }} />
                            <View style={{ width: WindowWidth - 125, marginLeft: 10 }}>
                                <ShimmerPlaceHolder shimmerStyle={{ height: 12, width: '40%', borderRadius: 5, marginVertical: 5 }} />
                                <ShimmerPlaceHolder shimmerStyle={{ height: 15, width: '60%', borderRadius: 5, marginVertical: 5 }} />
                            </View>
                        </View>
                        <View style={{ paddingBottom: 20 }}>
                            <View style={[styles.flexRow, styles.justifyBetween]}>
                                <View style={{ width: '47%', }}>
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 12, width: '40%', borderRadius: 5, marginVertical: 5 }} />
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 15, width: '60%', borderRadius: 5, marginVertical: 5 }} />
                                </View>
                                <View style={{ width: '47%', }}>
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 12, width: '40%', borderRadius: 5, marginVertical: 5 }} />
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 15, width: '60%', borderRadius: 5, marginVertical: 5 }} />
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingBottom: 20 }}>
                            <View style={[styles.flexRow, styles.justifyBetween]}>
                                <View style={{ width: '47%', }}>
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 12, width: '40%', borderRadius: 5, marginVertical: 5 }} />
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 15, width: '60%', borderRadius: 5, marginVertical: 5 }} />
                                </View>
                                <View style={{ width: '47%', }}>
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 12, width: '40%', borderRadius: 5, marginVertical: 5 }} />
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 15, width: '60%', borderRadius: 5, marginVertical: 5 }} />
                                </View>
                            </View>
                        </View>
                        <View style={{ paddingBottom: 20 }}>
                            <View style={[styles.flexRow, styles.justifyBetween]}>
                                <View style={{ width: '47%', }}>
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 12, width: '40%', borderRadius: 5, marginVertical: 5 }} />
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 15, width: '60%', borderRadius: 5, marginVertical: 5 }} />
                                </View>
                                <View style={{ width: '47%', }}>
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 12, width: '40%', borderRadius: 5, marginVertical: 5 }} />
                                    <ShimmerPlaceHolder shimmerStyle={{ height: 15, width: '60%', borderRadius: 5, marginVertical: 5 }} />
                                </View>
                            </View>
                        </View>
                    </View>
                    :
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ padding: 15 }}>
                            <View style={[styles.flexRow, { width: "100%", paddingBottom: 20 }]}>
                                <>
                                    {
                                        (item?.imagesPet && item?.imagesPet.length > 0)
                                            ? <FlatList
                                                ref={flatListRef}
                                                horizontal
                                                pagingEnabled
                                                data={item?.imagesPet}
                                                onMomentumScrollEnd={onScrollEnd}
                                                showsHorizontalScrollIndicator={false}
                                                renderItem={({ item, index }) =>
                                                    <ImagesHorizontal item={item} />}
                                            />
                                            : <Image
                                                source={require('../../assets/images/error.png')}
                                                style={{ width: 90, height: 90, borderRadius: 10 }} />
                                    }
                                </>
                                <View style={{ width: WindowWidth - 130, marginLeft: 10 }}>
                                    <Text style={styles.titleDetail}>Tên thú cưng: </Text>
                                    <Text
                                        numberOfLines={3}
                                        style={[styles.textDarkBlue, {
                                            fontSize: 16, fontWeight: 'bold',
                                            width: '100%',
                                        }]}>
                                        {item?.namePet ? item?.namePet : "Lỗi dữ liệu"}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ paddingBottom: 20 }}>
                                <View style={[styles.flexRow, styles.justifyBetween]}>
                                    <View style={{ width: '47%', }}>
                                        <Text style={styles.titleDetail}>Cân nặng: </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {(item?.weightPet != undefined) ? item?.weightPet + " kg" : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                    <View style={{ width: '47%', }}>
                                        <Text style={styles.titleDetail}>Chiều cao: </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {(item?.heightPet != undefined) ? item?.heightPet + " cm" : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ paddingBottom: 20 }}>
                                <View style={[styles.flexRow, styles.justifyBetween]}>
                                    <View style={{ width: '47%', }}>
                                        <Text style={styles.titleDetail}>Kích cỡ: </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {(item?.sizePet != undefined) ? item?.sizePet : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                    <View style={{ width: '47%', }}>
                                        <Text style={styles.titleDetail}>Loài: </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {item?.idCategoryP?.nameCategory ? item?.idCategoryP?.nameCategory : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ paddingBottom: 20 }}>
                                <View style={[styles.flexRow, styles.justifyBetween]}>
                                    <View style={{ width: '47%', }}>
                                        <Text style={styles.titleDetail}>Giá bán: </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {(item?.pricePet != undefined) ? Number(item?.pricePet).toLocaleString() + " đồng" : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                    <View style={{ width: '47%', }}>
                                        <Text style={styles.titleDetail}>Giảm giá: </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {(item?.discount != undefined) ? item?.discount + "%" : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ paddingBottom: 20 }}>
                                <View style={[styles.flexRow, styles.justifyBetween]}>
                                    <View style={{ width: '47%', }}>
                                        <Text style={styles.titleDetail}>Số lượng: </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {(item?.amountPet != undefined) ? item?.amountPet : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                    <View style={{ width: '47%', }}>
                                        <Text style={styles.titleDetail}>Trạng thái: </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {(item?.status != undefined) ? item?.status : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ paddingBottom: 20 }}>
                                <View style={[styles.flexRow, styles.justifyBetween]}>
                                    <View style={{ width: '47%', }}>
                                        <Text style={styles.titleDetail}>Đã bán: </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {(item?.quantitySold != undefined) ? item?.quantitySold : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                    <View style={{ width: '47%', }}>
                                        <Text style={styles.titleDetail}>Đánh giá: </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {(item?.rate != undefined) ? item?.rate : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ paddingBottom: 20 }}>
                                <View style={[styles.flexRow, styles.justifyBetween]}>
                                    <View style={{ width: '47%', }}>
                                        <Text style={styles.titleDetail}>Ngày tạo: </Text>
                                        <Text
                                            numberOfLines={2}
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {(item?.createdAt != undefined) ? getDateTimeDefault(item?.createdAt) : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ paddingBottom: 20 }}>
                                <View style={[styles.flexRow, styles.justifyBetween]}>
                                    <View style={{ width: "100%", }}>
                                        <Text style={styles.titleDetail}>Mô tả: </Text>
                                        <Text
                                            style={[styles.textDarkBlue, {
                                                fontSize: 16, fontWeight: 'bold',
                                                width: '100%',
                                            }]}>
                                            {item?.detailPet ? item?.detailPet : "Lỗi dữ liệu"}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
            }
        </View>
    );
}

export default memo(DetailPet);