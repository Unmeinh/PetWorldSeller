import React, { memo, useState } from 'react';
import {
    Text, View,
    TouchableHighlight,
    Image, TouchableOpacity
} from 'react-native';
import styles, { darkBlue } from '../../styles/all.style';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDateDefault } from '../../utils/functionSupport';
import { FlatList } from 'react-native';
import { onNavigate } from '../../navigation/rootNavigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPets, updatePet } from '../../redux/reducers/pet/petReducer';
import { listPetSelector } from '../../redux/selectors/selector';
import Toast from 'react-native-toast-message';
import { onAxiosPut } from '../../api/axios.function';
import ShimmerPlaceHolder from '../../components/layout/ShimmerPlaceHolder';

const PetTab = (route) => {
    const dispatch = useDispatch();
    const pets = useSelector(listPetSelector);
    const [extraPets, setextraPets] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    function onOpenAddPet() {
        onNavigate('AddPet');
    }

    async function onGetPets() {
        dispatch(fetchPets());
    }

    const ItemPet = (row) => {
        const [srcImage, setsrcImage] = useState(require('../../assets/images/loading.png'))
        let item = row.item;

        function setErrorImage() {
            setsrcImage(require('../../assets/images/error.png'));
        }

        function onOpenDetailPet() {
            onNavigate('DetailPet', { pet: item });
        }

        function onOpenEditPet() {
            onNavigate('EditPet', { pet: item });
        }

        function onShowAlertUnremove() {
            Toast.show({
                type: 'alert',
                text1: 'Xác nhận đăng thú cưng lên gian hàng của bạn?',
                position: 'top',
                props: {
                    confirm: () => onUnremovePet(),
                    cancel: () => Toast.hide()
                },
                autoHide: false
            })
        }

        async function onUnremovePet() {
            Toast.show({
                type: 'loading',
                text1: 'Đang đăng thú cưng...',
                position: 'top',
            })
            let res = await onAxiosPut("pet/unremove",  { idPet: item._id }, 'json', true);
            if (res) {
                dispatch(updatePet([item._id, res.data]));
            }
        }

        function onShowAlertRemove() {
            Toast.show({
                type: 'alert',
                text1: 'Xác nhận gỡ thú cưng khỏi gian hàng của bạn?',
                position: 'top',
                props: {
                    confirm: () => onRemovePet(),
                    cancel: () => Toast.hide()
                },
                autoHide: false
            })
        }

        async function onRemovePet() {
            Toast.show({
                type: 'loading',
                text1: 'Đang gỡ thú cưng...',
                position: 'top',
            })
            let res = await onAxiosPut("pet/remove", { idPet: item._id }, 'json', true);
            if (res) {
                dispatch(updatePet([item._id, res.data]));
            }
        }

        React.useEffect(() => {
            if (item.imagesPet != undefined) {
                if (item.imagesPet.length > 0 && srcImage == require('../../assets/images/loading.png')) {
                    setsrcImage({ uri: String(item.imagesPet[0]) });
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
                    <TouchableOpacity onPress={onOpenDetailPet}>
                        <Image
                            source={srcImage} onError={setErrorImage}
                            style={{ width: 90, height: 90, borderRadius: 10 }} />
                    </TouchableOpacity>

                    <View style={{ marginLeft: 10 }}>
                        <View style={[styles.flexRow, { width: '100%', marginTop: 3, }]}>
                            <View style={[styles.flexRow, { width: '75%' }]}>
                                <TouchableOpacity style={[styles.flexRow, { width: '100%' }]}
                                    onPress={onOpenDetailPet}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.textDarkBlue, {
                                            fontSize: 16, fontWeight: 'bold',
                                        }]}>
                                        {item?.namePet ? item?.namePet : "Lỗi dữ liệu"} {item?.namePet} {item?.namePet} {item?.namePet} {item?.namePet}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.flexRow, styles.itemsCenter]}>
                                <TouchableOpacity onPress={onOpenEditPet}>
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
                            Đơn giá: {item?.pricePet ? Number(item?.pricePet).toLocaleString() + " đồng" : "Lỗi dữ liệu"}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={[styles.textDarkBlue, {
                                fontSize: 14, marginBottom: 3
                            }]}>
                            Số lượng còn lại: {item?.amountPet ? item?.amountPet : "Lỗi dữ liệu"}
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
        if (pets != undefined) {
            let clone = [...extraPets];
            clone = pets;
            setextraPets(clone);
            if (isLoading) {
                setisLoading(false);
            }
        }
    }, [pets]);

    React.useEffect(() => {
        if (route?.tabIndex == 0) {
            setisLoading(true);
            onGetPets();
        }
    }, [route]);

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
                    activeOpacity={0.5} underlayColor="#DC749C" onPress={onOpenAddPet}>
                    <View style={[styles.flexRow, styles.itemsCenter]}>
                        <Entypo name="plus" color={'#FEF6E4'} size={13} />
                        <Text style={[styles.textButtonSmallPink, { color: '#FEF6E4' }]}>Thêm mới</Text>
                    </View>
                </TouchableHighlight>
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
                        {
                            (pets.length > 0)
                                ?
                                <FlatList
                                    data={pets}
                                    extraData={extraPets}
                                    renderItem={({ item, index }) =>
                                        <ItemPet key={index} item={item}
                                            index={index} />}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()} />
                                : ""
                        }
                    </>
            }
        </View>
    );
}

export default memo(PetTab);