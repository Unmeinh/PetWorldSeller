import React, { useState } from 'react';
import {
    Text, View,
    TouchableHighlight,
    Image, TouchableOpacity
} from 'react-native';
import styles, { WindowWidth, darkBlue, yellowWhite } from '../../styles/all.style';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { getDateDefault } from '../../utils/functionSupport';
import { FlatList } from 'react-native';
import { onNavigate } from '../../navigation/rootNavigation';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, removeProduct } from '../../redux/reducers/product/productReducer';
import { listProductSelector } from '../../redux/selectors/selector';
import Toast from 'react-native-toast-message';
import { onAxiosDelete } from '../../api/axios.function';

const ProductTab = () => {
    // const [products, setproducts] = useState([
    //     {
    //         nameProduct: "Delicious milk from big breast in cup 😋",
    //         priceProduct: 999999999,
    //         amountProduct: 1,
    //         createdAt: new Date(),
    //         arrProduct: ["https://cdn.donmai.us/original/aa/b6/__alpaca_suri_kemono_friends_drawn_by_tyamame589__aab6f29848d40a053eec9e899455a415.jpg"]
    //     },
    //     {
    //         nameProduct: "Seia's holy water 😋",
    //         priceProduct: 999999999,
    //         amountProduct: 1,
    //         createdAt: new Date('2023-10-16'),
    //         arrProduct: ["https://cdn.donmai.us/original/18/56/__seia_blue_archive_drawn_by_mitsumine_raimu__1856ca8480fa0373659e4151c5066c2d.jpg"]
    //     },
    //     {
    //         nameProduct: "Mari's holy water 😋",
    //         priceProduct: 999999999,
    //         amountProduct: 1,
    //         createdAt: new Date('2023-10-15'),
    //         arrProduct: ["https://cdn.donmai.us/original/67/0a/__mari_and_mari_blue_archive_drawn_by_shimokirin__670ac259c5efa88e63b0baa0d427deef.jpg"]
    //     },
    // ])
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const products = useSelector(listProductSelector);

    function onOpenAddProduct() {
        onNavigate('AddProduct');
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
            onNavigate('DetailProduct', { product: item });
        }

        function onOpenEditProduct() {
            onNavigate('EditProduct', { product: item });
        }

        function onShowAlert() {
            Toast.show({
                type: 'alert',
                text1: 'Xác nhận xóa sản phẩm?',
                position: 'top',
                props: {
                    confirm: () => onDeleteProduct(),
                    cancel: () => Toast.hide()
                },
                autoHide: false
            })
        }
    
        async function onDeleteProduct() {
            Toast.show({
                type: 'loading',
                text1: 'Đang xóa sản phẩm...',
                position: 'top',
            })
            let res = await onAxiosDelete("product/delete/" + item._id, true);
            if (res) {
                dispatch(removeProduct(item._id));
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
            <View>
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
                            <TouchableOpacity style={{ width: '75%', paddingRight: 7.5 }}
                                onPress={onOpenDetailProduct}>
                                <Text
                                    numberOfLines={1}
                                    style={[styles.textDarkBlue, {
                                        fontSize: 16, fontWeight: 'bold',
                                    }]}>
                                    {item?.nameProduct ? item?.nameProduct : "Lỗi dữ liệu"}
                                </Text>
                            </TouchableOpacity>
                            <View style={[styles.flexRow, styles.itemsCenter]}>
                                <TouchableOpacity onPress={onOpenEditProduct}>
                                    <Feather name='edit' size={15} color={darkBlue} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onShowAlert}>
                                    <Feather name='trash-2' size={15} color={darkBlue} style={{ marginLeft: 7, right: -3, }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text
                            numberOfLines={1}
                            style={[styles.textDarkBlue, {
                                fontSize: 14,
                                marginTop: 3, marginBottom: 3
                            }]}>
                            Đơn giá: {item?.priceProduct ? Number(item?.priceProduct).toLocaleString() + " đồng" : "Lỗi dữ liệu"}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={[styles.textDarkBlue, {
                                fontSize: 14, marginBottom: 3
                            }]}>
                            Số lượng còn lại: {item?.amountProduct ? item?.amountProduct : "Lỗi dữ liệu"}
                        </Text>

                        <View style={[styles.flexRow, styles.itemsCenter]}>
                            <Feather name="clock" size={13} color={'rgba(0, 0, 0, 0.65)'} />
                            <Text style={styles.textTime}>
                                {item?.createdAt ? getDateDefault(item?.createdAt) : "Lỗi dữ liệu"}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            if (products.length <= 0) {
                onGetProduct();
            }
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={[styles.flexRow, styles.justifyBetween, { width: '100%', paddingHorizontal: 10, paddingVertical: 15 }]}>
                <View style={[styles.flexRow, styles.itemsCenter]}>
                    <Text style={styles.textDarkBlue}>Sắp xếp theo: </Text>
                    <TouchableHighlight style={[styles.buttonSortProduct, { backgroundColor: '#CCCCCC80' }]}
                        activeOpacity={0.5} underlayColor="#DC749C">
                        <View style={[styles.flexRow, styles.itemsCenter]}>
                            <Text style={[styles.textButtonSmallPink, { color: darkBlue }]}>Ngày tạo</Text>
                            <Entypo name="arrow-long-down" color={darkBlue} size={12} />
                        </View>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight style={[styles.buttonSmallPink, styles.bgPinkLotus]}
                    activeOpacity={0.5} underlayColor="#DC749C" onPress={onOpenAddProduct}>
                    <View style={[styles.flexRow, styles.itemsCenter]}>
                        <Entypo name="plus" color={'#FEF6E4'} size={13} />
                        <Text style={[styles.textButtonSmallPink, { color: '#FEF6E4' }]}>Thêm mới</Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View style={{ height: 3, width: '100%', backgroundColor: '#CCCCCC80' }}></View>
            <FlatList
                data={products}
                // extraData={extraBlogs}
                renderItem={({ item, index }) =>
                    <ItemProduct key={index} item={item}
                        index={index} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()} />
        </View>
    );
}


export default ProductTab;