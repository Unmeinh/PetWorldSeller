import React, { useState } from 'react';
import {
    Text, View,
    Image, ScrollView
} from 'react-native';
import styles, { WindowWidth, darkBlue, yellowWhite } from '../../styles/all.style';
import { memo } from 'react';
import HeaderTitle from '../../components/header/HeaderTitle';
import { getDateTimeDefault } from '../../utils/functionSupport';

const DetailProduct = ({ route }) => {
    let item = route.params.product;
    const [srcImage, setsrcImage] = useState(require('../../assets/images/loading.png'))

    function setErrorImage() {
        setsrcImage(require('../../assets/images/error.png'));
    }

    React.useEffect(() => {
        if (item.arrProduct != undefined) {
            if (item.arrProduct.length > 0 && srcImage == require('../../assets/images/loading.png')) {
                setsrcImage({ uri: String(item.arrProduct[0]) });
            }
        }
    }, [item])

    return (
        <View style={styles.container}>
            <HeaderTitle colorHeader={yellowWhite} titleHeader={"Chi tiết sản phẩm"} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 15 }}>
                    <View style={[styles.flexRow, { width: "100%", paddingBottom: 20 }]}>
                        <Image
                            source={srcImage} onError={setErrorImage}
                            style={{ width: 90, height: 90, borderRadius: 10 }} />
                        <View style={{ width: WindowWidth - 125, marginLeft: 10 }}>
                            <Text style={styles.titleDetail}>Tên thú cưng: </Text>
                            <Text
                                numberOfLines={3}
                                style={[styles.textDarkBlue, {
                                    fontSize: 16, fontWeight: 'bold',
                                    width: '100%',
                                }]}>
                                {item?.nameProduct ? item?.nameProduct : "Lỗi dữ liệu"}
                            </Text>
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
                                    {(item?.priceProduct != undefined) ? Number(item?.priceProduct).toLocaleString() + " đồng" : "Lỗi dữ liệu"}
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
                    </View><View style={{ paddingBottom: 20 }}>
                        <View style={[styles.flexRow, styles.justifyBetween]}>
                            <View style={{ width: '47%', }}>
                                <Text style={styles.titleDetail}>Số lượng: </Text>
                                <Text
                                    numberOfLines={2}
                                    style={[styles.textDarkBlue, {
                                        fontSize: 16, fontWeight: 'bold',
                                        width: '100%',
                                    }]}>
                                    {(item?.amountProduct != undefined) ? item?.amountProduct : "Lỗi dữ liệu"}
                                </Text>
                            </View>
                            <View style={{ width: '47%', }}>
                                <Text style={styles.titleDetail}>Thể loại: </Text>
                                <Text
                                    numberOfLines={2}
                                    style={[styles.textDarkBlue, {
                                        fontSize: 16, fontWeight: 'bold',
                                        width: '100%',
                                    }]}>
                                    {item?.idCategoryPr?.nameCategory ? item?.idCategoryPr?.nameCategory : "Lỗi dữ liệu"}
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
                                <Text style={styles.titleDetail}>Trạng thái: </Text>
                                <Text
                                    numberOfLines={2}
                                    style={[styles.textDarkBlue, {
                                        fontSize: 16, fontWeight: 'bold',
                                        width: '100%',
                                    }]}>
                                    {(item?.status != undefined) ? (item?.status == 0) ? "Đang bán" : "Đang ẩn" : "Lỗi dữ liệu"}
                                </Text>
                            </View>
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
                                    {item?.detailProduct ? item?.detailProduct : "Lỗi dữ liệu"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default memo(DetailProduct);