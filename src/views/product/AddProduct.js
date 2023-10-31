import React, { useState } from 'react';
import {
    ScrollView,
    FlatList,
    Text, View,
    TextInput,
    TouchableHighlight,
    TouchableOpacity
} from 'react-native';
import styles, { WindowWidth, darkBlue, yellowWhite } from '../../styles/all.style';
import { memo } from 'react';
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather';
import HeaderTitle from '../../components/header/HeaderTitle';
import { Image } from 'react-native-animatable';
import SelectDropdown from 'react-native-select-dropdown';
import Toast from 'react-native-toast-message';
import { onAxiosGet, onAxiosPost } from '../../api/axios.function';
import { onGoBack } from '../../navigation/rootNavigation';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../redux/reducers/product/productReducer';

const AddProduct = ({ route }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [arr_Image, setarr_Image] = useState([]);
    const [arr_Category, setarr_Category] = useState([]);
    const [selectCategory, setselectCategory] = useState([]);
    const [inputNameProduct, setinputNameProduct] = useState("");
    const [inputCategory, setinputCategory] = useState("");
    const [inputPrice, setinputPrice] = useState("");
    const [inputDiscount, setinputDiscount] = useState("0");
    const [inputAmount, setinputAmount] = useState("");
    const [inputDetail, setinputDetail] = useState("");

    async function onImagePicked() {
        try {
            if (arr_Image.length >= 5) {
                Toast.show({
                    type: 'error',
                    text1: 'Bạn chỉ có thể thêm tối đa 5 ảnh!',
                    position: 'top',
                })
            } else {
                var response = await openPicker({
                    mediaType: 'image',
                    selectedAssets: 'Images',
                    doneTitle: 'Xong',
                    maxSelectedAssets: 5 - arr_Image.length
                });
                setarr_Image([...arr_Image, ...response]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function onChangeInputName(input) {
        if (input.length > 50) {
            Toast.show({
                type: 'error',
                text1: 'Tên sản phẩm không dài quá 50 ký tự!',
                position: 'top'
            })
        } else {
            setinputNameProduct(input);
        }
    }

    function onChangeInputPrice(input) {
        let value = input.replaceAll(/\D/g, '');
        if (value.length > 9) {
            Toast.show({
                type: 'error',
                text1: 'Giá bán không dài quá 9 số!',
                position: 'top'
            })
        } else {
            setinputPrice(Number(value).toLocaleString());
        }
    }

    function onChangeInputDiscount(input) {
        let value = input.replaceAll(/\D/g, '');
        if (value.length > 3) {
            Toast.show({
                type: 'error',
                text1: 'Giảm giá không dài quá 3 số!',
                position: 'top'
            })
        } else {
            setinputDiscount(value);
        }
    }

    function onChangeInputAmount(input) {
        let value = input.replaceAll(/\D/g, '');
        if (value.length > 3) {
            Toast.show({
                type: 'error',
                text1: 'Số lượng thêm không dài quá 3 số!',
                position: 'top'
            })
        } else {
            setinputAmount(value);
        }
    }

    function onChangeInputDetail(input) {
        if (input.length > 300) {
            Toast.show({
                type: 'error',
                text1: 'Mô tả không được dài quá 300 ký tự!',
                position: 'top'
            })
            return false;
        } else {
            setinputDetail(input);
        }
    }

    function checkValidate() {
        if (arr_Image.length <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Cần có tối thiểu 1 ảnh sản phẩm!',
                position: 'top'
            })
            return false;
        }

        if (inputNameProduct.trim() == "") {
            Toast.show({
                type: 'error',
                text1: 'Tên sản phẩm không được trống!',
                position: 'top'
            })
            return false;
        }

        if (inputPrice.trim() == "") {
            Toast.show({
                type: 'error',
                text1: 'Giá bán không được trống!',
                position: 'top'
            })
            return false;
        } else {
            if (inputPrice <= 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Giá bán cần lớn hơn 0!',
                    position: 'top'
                })
                return false;
            }
        }

        if (inputDiscount.trim() == "") {
            Toast.show({
                type: 'error',
                text1: 'Số giảm giá không được trống!',
                position: 'top'
            })
            return false;
        } else {
            if (inputDiscount >= 100) {
                Toast.show({
                    type: 'error',
                    text1: 'Số giảm giá cần nhỏ hơn 100!',
                    position: 'top'
                })
                return false;
            }
        }

        if (inputAmount.trim() == "") {
            Toast.show({
                type: 'error',
                text1: 'Số lượng thêm không được trống!',
                position: 'top'
            })
            return false;
        } else {
            if (inputAmount <= 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Số lượng thêm cần lớn hơn 0!',
                    position: 'top'
                })
                return false;
            }
        }

        if (inputCategory.trim() == "") {
            Toast.show({
                type: 'error',
                text1: 'Thể loại cần được chọn!',
                position: 'top'
            })
            return false;
        }

        if (inputDetail.trim() == "") {
            Toast.show({
                type: 'error',
                text1: 'Mô tả không được trống!',
                position: 'top'
            })
            return false;
        }

        return true;
    }

    function onShowAlert() {
        if (checkValidate() == false) {
            return;
        }

        Toast.show({
            type: 'alert',
            text1: 'Xác nhận thêm sản phẩm?',
            position: 'top',
            props: {
                confirm: () => onAddProduct(),
                cancel: () => Toast.hide()
            },
            autoHide: false
        })
    }

    async function onAddProduct() {
        Toast.show({
            type: 'loading',
            text1: 'Đang thêm sản phẩm...',
            position: 'top',
            autoHide: false
        })

        var formData = new FormData();
        formData.append("nameProduct", inputNameProduct);
        formData.append("price", inputPrice.replaceAll('.', ''));
        formData.append("discount", inputDiscount);
        formData.append("amount", inputAmount);
        formData.append("category", inputCategory);
        formData.append("detail", inputDetail);

        if (arr_Image.length > 0) {
            for (let i = 0; i < arr_Image.length; i++) {
                var dataImage = {
                    uri: Platform.OS === "android" ? arr_Image[i].path : arr_Image[i].path.replaceAll("file://", ""),
                    name: arr_Image[i].fileName,
                    type: "multipart/form-data"
                };
                formData.append('imageUploaded', dataImage);
            }
        }

        let res = await onAxiosPost('product/insert', formData, 'formdata', true);
        if (res) {
            dispatch(addProduct(res.data));
            onGoBack();
        }
    }

    async function onGetCategory() {
        if (arr_Category.length <= 0) {
            let res = await onAxiosGet('product/list/category');
            if (res) {
                setarr_Category(res.data);
            }
        }
    }

    const ImageHorizontal = ({ item, index, callBack }) => {
        function RemoveImage() {
            let i = index;
            let length = arr_Image.length;
            if (length <= 1) {
                let images = [...arr_Image];
                images = []
                setarr_Image(images);
            } else {
                let images = [...arr_Image];
                images.splice(i, 1);
                setarr_Image(images);
            }
        }

        return (
            <View style={{ marginLeft: 10 }}>
                <Image style={{ height: 65, width: 65, borderRadius: 5 }}
                    source={{ uri: (item.path) ? String(item.path) : String(item) }} key={item.index} />
                <View style={styles.viewDeleteImage}>
                    <TouchableOpacity style={styles.buttonDeleteImage}
                        onPress={RemoveImage}>
                        <Feather name='x' size={12} color={'#001858'} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            onGetCategory();
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    React.useEffect(() => {
        if (arr_Category.length > 0) {
            let arr = [];
            for (let i = 0; i < arr_Category.length; i++) {
                const category = arr_Category[i];
                arr.push(category.nameCategory);
            }
            setselectCategory(arr);
        }
    }, [arr_Category]);

    return (
        <View style={styles.container}>
            <HeaderTitle colorHeader={yellowWhite} titleHeader={"Thêm sản phẩm"} />
            <ScrollView style={{ paddingHorizontal: 10 }}>
                <View style={{ paddingBottom: 10 }}>
                    <Text style={[{
                        color: 'rgba(0, 24, 88, 0.80)', marginLeft: 10
                    }, styles.titleInput]}>Ảnh sản phẩm (Tối đa 5 ảnh)</Text>
                    <View style={[styles.flexRow, { height: 75, paddingTop: 10 }]}>
                        <TouchableOpacity onPress={onImagePicked}>
                            <View style={{ backgroundColor: '#F3D2C1', height: '100%', aspectRatio: 1 / 1, justifyContent: 'center', alignItems: 'center', borderRadius: 5, overflow: 'hidden' }}>
                                <Entypo name='camera' size={23} color={'rgba(0, 24, 88, 0.80)'} />
                            </View>
                        </TouchableOpacity>
                        {
                            (arr_Image.length > 0)
                                ? <FlatList
                                    horizontal
                                    data={arr_Image}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) => <ImageHorizontal index={index} item={item} />}
                                />
                                : ""
                        }
                    </View>
                </View>
                <View style={{ paddingBottom: 10 }}>
                    <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', marginTop: 10 }}></View>
                    <View>
                        <Text style={[styles.titleInput, {
                            color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
                        }]}>Tên sản phẩm</Text>
                        <View>
                            <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown]}
                                value={inputNameProduct}
                                onChangeText={onChangeInputName} />
                        </View>
                    </View>
                </View>
                <View style={{ paddingBottom: 10 }}>
                    <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', marginTop: 10 }}></View>
                    <View style={[styles.flexRow, styles.justifyBetween]}>
                        <View style={{ width: '47%', }}>
                            <Text style={[styles.titleInput, {
                                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
                            }]}>Giá bán (vnđ)</Text>
                            <View>
                                <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown]}
                                    value={inputPrice} keyboardType='number-pad'
                                    onChangeText={onChangeInputPrice} />
                            </View>
                        </View>
                        <View style={{ width: '47%', }}>
                            <Text style={[styles.titleInput, {
                                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
                            }]}>Giảm giá (%)</Text>
                            <View>
                                <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown]}
                                    value={inputDiscount} keyboardType='number-pad'
                                    onChangeText={onChangeInputDiscount} />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ paddingBottom: 10 }}>
                    <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', marginTop: 10 }}></View>
                    <View style={[styles.flexRow, styles.justifyBetween]}>
                        <View style={{ width: '47%', }}>
                            <Text style={[styles.titleInput, {
                                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
                            }]}>Số lượng thêm</Text>
                            <View>
                                <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown]}
                                    value={inputAmount} keyboardType='number-pad'
                                    onChangeText={onChangeInputAmount} />
                            </View>
                        </View>
                        <View style={{ width: '47%', }}>
                            <Text style={[styles.titleInput, {
                                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
                            }]}>Thể loại</Text>
                            <View>
                                <SelectDropdown
                                    data={selectCategory}
                                    defaultButtonText='Chọn thể loại'
                                    onFocus={onGetCategory}
                                    buttonStyle={[{ width: '100%' }, styles.textInputLogin, styles.bgLightBrown]}
                                    buttonTextStyle={[styles.textDarkBlue, { fontSize: 17 }]}
                                    onSelect={(selectedItem, index) => {
                                        setinputCategory(arr_Category[index]._id);
                                    }}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return selectedItem
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return item
                                    }}
                                />
                                <Entypo name='triangle-down' color={darkBlue} size={17} style={[styles.positionAbsolute, { right: 5, top: '45%' }]} />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ paddingBottom: 10 }}>
                    <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', marginTop: 10 }}></View>
                    <View>
                        <Text style={[styles.titleInput, {
                            color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
                        }]}>Mô tả sản phẩm</Text>
                        <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown, { textAlignVertical: 'top', maxHeight: 100 }]}
                            multiline={true} numberOfLines={4}
                            value={inputDetail}
                            onChangeText={onChangeInputDetail} />
                    </View>
                </View>
                <TouchableHighlight style={[styles.buttonConfirmFullPink, styles.bgPinkLotus, styles.itemsCenter, { marginTop: 35, marginBottom: 25 }]}
                    activeOpacity={0.5} underlayColor="#DC749C"
                    onPress={onShowAlert}>
                    <Text style={[styles.textButtonConfirmFullPink, styles.textYellowWhite]}>Tiếp tục</Text>
                </TouchableHighlight>
            </ScrollView>
        </View>
    );
}

export default memo(AddProduct);