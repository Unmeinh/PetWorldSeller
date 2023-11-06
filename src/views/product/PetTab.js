import React, { memo, useState } from 'react';
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
import { fetchPets, removePet } from '../../redux/reducers/pet/petReducer';
import { listPetSelector } from '../../redux/selectors/selector';
import Toast from 'react-native-toast-message';
import { onAxiosDelete } from '../../api/axios.function';

const PetTab = () => {
    const navigation = useNavigation();
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

        function onShowAlert() {
            Toast.show({
                type: 'alert',
                text1: 'Xác nhận xóa thú cưng?',
                position: 'top',
                props: {
                    confirm: () => onDeletePet(),
                    cancel: () => Toast.hide()
                },
                autoHide: false
            })
        }
    
        async function onDeletePet() {
            Toast.show({
                type: 'loading',
                text1: 'Đang xóa thú cưng...',
                position: 'top',
            })
            let res = await onAxiosDelete("pet/delete/" + item._id, true);
            if (res) {
                dispatch(removePet(item._id));
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
                            <TouchableOpacity style={{ width: '75%', paddingRight: 7.5 }}
                                onPress={onOpenDetailPet}>
                                <Text
                                    numberOfLines={1}
                                    style={[styles.textDarkBlue, {
                                        fontSize: 16, fontWeight: 'bold',
                                    }]}>
                                    {item?.namePet ? item?.namePet : "Lỗi dữ liệu"}
                                </Text>
                            </TouchableOpacity>
                            <View style={[styles.flexRow, styles.itemsCenter]}>
                                <TouchableOpacity onPress={onOpenEditPet}>
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
        const unsub = navigation.addListener('focus', () => {
            if (pets.length <= 0) {
                onGetPets();
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
                    activeOpacity={0.5} underlayColor="#DC749C" onPress={onOpenAddPet}>
                    <View style={[styles.flexRow, styles.itemsCenter]}>
                        <Entypo name="plus" color={'#FEF6E4'} size={13} />
                        <Text style={[styles.textButtonSmallPink, { color: '#FEF6E4' }]}>Thêm mới</Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View style={{ height: 3, width: '100%', backgroundColor: '#CCCCCC80' }}></View>
            <FlatList
                data={pets}
                extraData={extraPets}
                renderItem={({ item, index }) =>
                    <ItemPet key={index} item={item}
                        index={index} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()} />
        </View>
    );
}


export default memo(PetTab);