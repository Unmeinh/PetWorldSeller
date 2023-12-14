import React, { useState, memo } from 'react';
import {
    Text, View,
    Image, ScrollView,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';
import styles, { WindowHeight, darkBlue } from '../../styles/all.style';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDateDefault } from '../../utils/functionSupport';
import { FlatList } from 'react-native';
import { onNavigate } from '../../navigation/rootNavigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, removeProduct, unremoveProduct } from '../../redux/reducers/product/productReducer';
import { listProductSelector, listProductHideSelector } from '../../redux/selectors/selector';
import Toast from 'react-native-toast-message';
import { onAxiosPut } from '../../api/axios.function';
import ShimmerPlaceHolder from '../../components/layout/ShimmerPlaceHolder';
import emptyBag from '../../assets/images/jsons/emptyBag.json';
import LottieAnimation from '../../components/layout/LottieAnimation';
import { RefreshControl } from 'react-native-gesture-handler';
import MenuSort from './MenuSort';

const ProductTab = (route) => {
    const dispatch = useDispatch();
    const products = useSelector(listProductSelector);
    const productsHide = useSelector(listProductHideSelector);
    const [extraProducts, setextraProducts] = useState([]);
    const [extraProductsHide, setextraProductsHide] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [isRefreshing, setisRefreshing] = useState(false);
    const [statusProducts, setstatusProducts] = useState(0);

    function onOpenAddProduct() {
        onNavigate('AddProduct');
    }

    function onChangeStatusProducts() {
        setstatusProducts(!statusProducts);
    }

    async function onGetProduct() {
        dispatch(fetchProducts());
    }

    const ItemProduct = (row) => {
        const [srcImage, setsrcImage] = useState(require('../../assets/images/loading.png'))
        let item = row.item;

        function setErrorImage() {
            setsrcImage(require('../../assets/images/error.png'));
        }

        function onOpenDetailProduct() {
            onNavigate('DetailProduct', { idProd: item._id });
        }

        function onOpenEditProduct() {
            onNavigate('EditProduct', { product: item });
        }

        function onShowAlertUnremove() {
            Toast.show({
                type: 'alert',
                text1: 'Xác nhận đăng sản phẩm lên gian hàng của bạn?',
                position: 'top',
                props: {
                    confirm: () => onUnremoveProduct(),
                    cancel: () => Toast.hide()
                },
                autoHide: false
            })
        }

        async function onUnremoveProduct() {
            Toast.show({
                type: 'loading',
                text1: 'Đang đăng sản phẩm...',
                position: 'top',
            })
            let res = await onAxiosPut("product/unremove", { idProduct: item._id }, 'json', true);
            if (res) {
                dispatch(unremoveProduct([item._id, res.data]));
            }
        }

        function onShowAlertRemove() {
            Toast.show({
                type: 'alert',
                text1: 'Xác nhận gỡ sản phẩm khỏi gian hàng của bạn?',
                position: 'top',
                props: {
                    confirm: () => onRemoveProduct(),
                    cancel: () => Toast.hide()
                },
                autoHide: false
            })
        }

        async function onRemoveProduct() {
            Toast.show({
                type: 'loading',
                text1: 'Đang gỡ sản phẩm...',
                position: 'top',
            })
            let res = await onAxiosPut("product/remove", { idProduct: item._id }, 'json', true);
            if (res) {
                dispatch(removeProduct([item._id, res.data]));
            }
        }

        React.useEffect(() => {
            if (item.arrProduct != undefined) {
                if (item.arrProduct.length > 0 && srcImage == require('../../assets/images/loading.png')) {
                    setsrcImage({ uri: String(item.arrProduct[0]) });
                }
            }
        }, [item])

        return (
            <View style={{ marginBottom: (row.index == ((statusProducts) ? productsHide.length - 1 : products.length - 1)) ? WindowHeight * 0.2 : 0 }}>
                <View
                    style={{
                        marginHorizontal: 15,
                        marginTop: 15,
                        marginBottom: 7,
                        flexDirection: 'row',
                    }}>
                    <TouchableOpacity onPress={onOpenDetailProduct}>
                        <Image
                            source={srcImage} onError={setErrorImage}
                            style={{ width: 90, height: 90, borderRadius: 10 }} />
                    </TouchableOpacity>

                    <View style={{ marginLeft: 10 }}>
                        <View style={[styles.flexRow, { width: '100%', marginTop: 3, }]}>
                            <View style={[styles.flexRow, { width: '75%' }]}>
                                <TouchableOpacity style={[styles.flexRow, { width: '100%' }]}
                                    onPress={onOpenDetailProduct}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.textDarkBlue, {
                                            fontSize: 16, fontWeight: 'bold',
                                        }]}>
                                        {item?.nameProduct ? item?.nameProduct : "Lỗi dữ liệu"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.flexRow, styles.itemsCenter]}>
                                <TouchableOpacity onPress={onOpenEditProduct}>
                                    <MaterialCommunityIcons name='square-edit-outline' size={17} color={darkBlue} />
                                </TouchableOpacity>
                                {
                                    (item?.status != undefined)
                                        ? <>
                                            {
                                                (item?.status == 1)
                                                    ?
                                                    <TouchableOpacity onPress={onShowAlertUnremove}>
                                                        <MaterialCommunityIcons name='archive-eye-outline' size={17} color={darkBlue} style={{ marginLeft: 5 }} />
                                                    </TouchableOpacity>
                                                    :
                                                    <TouchableOpacity onPress={onShowAlertRemove}>
                                                        <MaterialCommunityIcons name='archive-remove-outline' size={17} color={darkBlue} style={{ marginLeft: 5 }} />
                                                    </TouchableOpacity>
                                            }
                                        </>
                                        : <TouchableOpacity onPress={onShowAlertRemove}>
                                            <MaterialCommunityIcons name='archive-remove-outline' size={17} color={darkBlue} style={{ marginLeft: 5 }} />
                                        </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <Text
                            numberOfLines={1}
                            style={[styles.textDarkBlue, {
                                fontSize: 14,
                                marginTop: 3, marginBottom: 3
                            }]}>
                            Đơn giá: {item?.priceProduct ? Number(item?.priceProduct).toLocaleString() + " ₫" : "Lỗi dữ liệu"}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={[styles.textDarkBlue, {
                                fontSize: 14, marginBottom: 3
                            }]}>
                            Số lượng còn lại: {item?.amountProduct ? item?.amountProduct : "Lỗi dữ liệu"}
                        </Text>

                        <View style={[styles.flexRow, styles.itemsCenter]}>
                            <MaterialCommunityIcons name="clock-time-four-outline" size={13} color={'rgba(0, 0, 0, 0.65)'} />
                            <Text style={styles.textTime}>
                                {item?.createdAt ? getDateDefault(item?.createdAt) : "Lỗi dữ liệu"}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const ItemLoading = () => {
        return (
            <View>
                <View
                    style={{
                        marginHorizontal: 15,
                        marginTop: 15,
                        marginBottom: 7,
                        flexDirection: 'row',
                    }}>
                    <ShimmerPlaceHolder
                        shimmerStyle={{ width: 90, height: 90, borderRadius: 10 }} />

                    <View style={{ marginLeft: 10 }}>
                        <View style={[styles.flexRow, { width: '100%', marginVertical: 5, }]}>
                            <View style={{ width: '75%' }}>
                                <ShimmerPlaceHolder shimmerStyle={{ width: '75%', height: 17, borderRadius: 5 }} />
                            </View>
                            <View style={[styles.flexRow, styles.itemsCenter, { left: -3 }]}>
                                <ShimmerPlaceHolder shimmerStyle={{ width: 17, height: 17, borderRadius: 5 }} />
                                <ShimmerPlaceHolder shimmerStyle={{ width: 17, height: 17, borderRadius: 5, marginLeft: 7 }} />
                            </View>
                        </View>
                        <ShimmerPlaceHolder shimmerStyle={{ width: '45%', height: 14, marginVertical: 4, borderRadius: 5 }} />
                        <ShimmerPlaceHolder shimmerStyle={{ width: '45%', height: 14, marginVertical: 4, borderRadius: 5 }} />

                        <View style={[styles.flexRow, styles.itemsCenter, { marginTop: 3 }]}>
                            <ShimmerPlaceHolder shimmerStyle={{ width: 13, height: 13, borderRadius: 5 }} />
                            <ShimmerPlaceHolder shimmerStyle={{ width: '30%', height: 13, marginLeft: 3, borderRadius: 5 }} />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    React.useEffect(() => {
        if (products != undefined) {
            let clone = [...extraProducts];
            clone = products;
            setextraProducts(clone);
            if (isLoading) {
                setisLoading(false);
            }
            if (isRefreshing) {
                setisRefreshing(false);
            }
        }
    }, [products]);

    React.useEffect(() => {
        if (productsHide != undefined) {
            let clone = [...extraProductsHide];
            clone = productsHide;
            setextraProductsHide(clone);
            if (isLoading) {
                setisLoading(false);
            }
            if (isRefreshing) {
                setisRefreshing(false);
            }
        }
    }, [productsHide]);

    React.useEffect(() => {
        if (route?.tabIndex == 1) {
            setisLoading(true);
            onGetProduct();
        }
    }, [route]);

    const onReloadData = React.useCallback(() => {
        setisRefreshing(true);
        setisLoading(true);
        onGetProduct();
    }, []);

    return (
        <View style={styles.container}>
            <View style={[styles.flexRow, styles.justifyBetween, styles.itemsCenter, { width: '100%', padding: 10 }]}>
                <View style={{ width: '70%', }}>
                    <View style={[styles.flexRow, styles.itemsCenter]}>
                        <View style={{ width: "35%", }}>
                            <Text style={styles.textDarkBlue}>Trạng thái: </Text>
                        </View>
                        {
                            (statusProducts == 0)
                                ? <TouchableHighlight style={[styles.buttonSortProduct, { backgroundColor: '#8BD3DD80' }]}
                                    activeOpacity={0.5} underlayColor="#8BD3DD" onPress={onChangeStatusProducts}>
                                    <View style={[styles.flexRow, styles.itemsCenter]}>
                                        <Text style={[styles.textButtonSmallPink, { color: darkBlue }]}>Đang bán</Text>
                                        <Entypo name="eye" color={darkBlue} size={13} style={{ marginLeft: 3, top: 1 }} />
                                    </View>
                                </TouchableHighlight>
                                : <TouchableHighlight style={[styles.buttonSortProduct, { backgroundColor: '#F582AE80' }]}
                                    activeOpacity={0.5} underlayColor="#F582AE" onPress={onChangeStatusProducts}>
                                    <View style={[styles.flexRow, styles.itemsCenter]}>
                                        <Text style={[styles.textButtonSmallPink, { color: darkBlue }]}>Đang ẩn</Text>
                                        <Entypo name="eye-with-line" color={darkBlue} size={13} style={{ marginLeft: 3, top: 1 }} />
                                    </View>
                                </TouchableHighlight>
                        }
                    </View>
                    <View style={[styles.flexRow, styles.itemsCenter, { marginTop: 7 }]}>
                        <View style={{ width: "35%", }}>
                            <Text style={styles.textDarkBlue}>Sắp xếp theo: </Text>
                        </View>
                        <TouchableHighlight style={[styles.buttonSortProduct, { backgroundColor: '#CCCCCC80' }]}
                            activeOpacity={0.5} underlayColor="#DC749C">
                            <View style={[styles.flexRow, styles.itemsCenter]}>
                                <Text style={[styles.textButtonSmallPink, { color: darkBlue }]}>Ngày tạo</Text>
                                <Entypo name="arrow-long-down" color={darkBlue} size={12} />
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
                <View>
                    <TouchableHighlight style={[styles.buttonSmallPink, styles.bgPinkLotus]}
                        activeOpacity={0.5} underlayColor="#DC749C" onPress={onOpenAddProduct}>
                        <View style={[styles.flexRow, styles.itemsCenter]}>
                            <Entypo name="plus" color={'#FEF6E4'} size={13} />
                            <Text style={[styles.textButtonSmallPink, { color: '#FEF6E4' }]}>Thêm mới</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
            <View style={{ height: 3, width: '100%', backgroundColor: '#CCCCCC80' }}></View>
            {
                (isLoading)
                    ? <>
                        <ItemLoading />
                        <ItemLoading />
                        <ItemLoading />
                    </>
                    : <>
                        <View style={{ display: (statusProducts) ? 'none' : 'flex' }}>
                            {
                                (products.length > 0)
                                    ?
                                    <FlatList
                                        data={products}
                                        extraData={extraProducts}
                                        renderItem={({ item, index }) =>
                                            <ItemProduct key={index} item={item}
                                                index={index} />}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        refreshControl={
                                            <RefreshControl refreshing={isRefreshing} onRefresh={onReloadData} progressViewOffset={0} />
                                        } />
                                    : <ScrollView
                                        refreshControl={
                                            <RefreshControl refreshing={isRefreshing} onRefresh={onReloadData} progressViewOffset={0} />
                                        } >
                                        <View style={styles.viewEmptyList}>
                                            <LottieAnimation fileJson={emptyBag} isLoop={true} isAutoPlay={true}
                                                style={{ width: "80%", aspectRatio: 1 }} />
                                            <Text style={styles.textEmptyList}>Không có sản phẩm nào..</Text>
                                        </View>
                                    </ScrollView>
                            }
                        </View>
                        <View style={{ display: (statusProducts) ? 'flex' : 'none' }}>
                            {
                                (productsHide.length > 0)
                                    ?
                                    <FlatList
                                        data={productsHide}
                                        extraData={extraProductsHide}
                                        renderItem={({ item, index }) =>
                                            <ItemProduct key={index} item={item}
                                                index={index} />}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        refreshControl={
                                            <RefreshControl refreshing={isRefreshing} onRefresh={onReloadData} progressViewOffset={0} />
                                        } />
                                    : <ScrollView
                                        refreshControl={
                                            <RefreshControl refreshing={isRefreshing} onRefresh={onReloadData} progressViewOffset={0} />
                                        } >
                                        <View style={styles.viewEmptyList}>
                                            <LottieAnimation fileJson={emptyBag} isLoop={true} isAutoPlay={true}
                                                style={{ width: "80%", aspectRatio: 1 }} />
                                            <Text style={styles.textEmptyList}>Không có lịch hẹn nào..</Text>
                                        </View>
                                    </ScrollView>
                            }
                        </View>
                    </>
            }
            <MenuSort isShow={false} />
        </View>
    );
}

export default memo(ProductTab);