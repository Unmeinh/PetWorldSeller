import React, { useState, memo } from 'react';
import {
    Text, Dimensions,
    TouchableOpacity,
    View, Image,
} from 'react-native';
import HeaderTitle from '../../components/header/HeaderTitle';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles, { WindowWidth } from '../../styles/all.style';
import { useSelector, useDispatch } from "react-redux";
import { listShopSelector, shopSelectStatus } from '../../redux/selectors/selector';
import { fetchMyShops } from '../../redux/reducers/shop/shopReducer';
import { onAxiosPut } from '../../api/axios.function';
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../../components/layout/ShimmerPlaceHolder';

const AccountManager = () => {
    var navigation = useNavigation();
    const dispatch = useDispatch();
    const infoLogin = useSelector(listShopSelector);
    const selectStatus = useSelector(shopSelectStatus);
    const [pickedImage, setpickedImage] = useState(null);
    const [srcAvatar, setsrcAvatar] = useState(require('../../assets/images/loading.png'))
    const [isLoader, setisLoader] = useState(true);

    async function onAvatarPicked() {
        try {
            var response = await openPicker({
                mediaType: 'image',
                selectedAssets: 'Images',
                doneTitle: 'Xong',
                isCrop: true,
                isCropCircle: true,
                singleSelectedMode: true
            });
            if (response.crop) {
                let cropPath = "file://" + response.crop.path;
                response.crop.path = cropPath;
                response.crop.fileName = response.fileName;
                setpickedImage(response.crop);
                setsrcAvatar({ uri: cropPath });
            } else {
                if (response?.path.indexOf('file://') < 0 && response?.path.indexOf('content://') < 0) {
                    response.path = 'file://' + res.path;
                }
                setpickedImage(response);
                setsrcAvatar({ uri: response.path });
            }
        } catch (error) {
            console.log(error);
        }
    }

    function OpenEditInfo(type) {
        navigation.navigate('EditInfo', { infoType: type, user: infoLogin });
    }

    function OpenEditAccount(type) {
        navigation.navigate('EditAccount', { infoType: type, shop: infoLogin });
    }

    function setErrorImage() {
        setsrcImage(require('../../assets/images/error.png'));
    }

    async function onUpdateAvatar() {
        Toast.show({
            type: 'loading',
            text1: "Đang cập nhật ảnh đại diện...",
            autoHide: false,
            position: 'top'
        });
        var dataImage = {
            uri: Platform.OS === "android" ? pickedImage.path : pickedImage.path.replace("file://", ""),
            name: pickedImage.fileName,
            type: "multipart/form-data"
        };
        let formData = new FormData();
        formData.append('uploadImages', dataImage);
        let res = await onAxiosPut('shop/updateAvatar', formData, 'formdata', true);
        if (res) {
            setpickedImage(null);
            dispatch(fetchMyShops());
        } else {
            setpickedImage(null);
            setsrcAvatar({ uri: String(infoLogin?.avatarShop) });
        }
    }

    //Use effect    
    React.useEffect(() => {
        if (selectStatus == "being idle") {
            setisLoader(false);
            if (infoLogin.avatarShop != undefined) {
                setsrcAvatar({ uri: String(infoLogin?.avatarShop) });
            }
        }
    }, [selectStatus]);

    React.useEffect(() => {
        if (pickedImage != null) {
            Toast.show({
                type: 'alert',
                position: 'top',
                text1: 'Xác nhận thay đổi ảnh đại diện?',
                autoHide: false,
                props: {
                    confirm: async () => await onUpdateAvatar(),
                    cancel: () => {
                        Toast.hide();
                        setpickedImage(null);
                        setsrcAvatar({ uri: String(infoLogin?.avatarShop) });
                    }
                }
            })
        }
    }, [pickedImage]);

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            dispatch(fetchMyShops());
            // setisLoader(true);

            // return navigation.remove();
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    // console.log(styles);
    // console.log(
    //     Object.keys(styles).length,
    //     Object.values(styles).length,
    //     Object.entries(styles).length
    // )

    return (
        <View style={styles.container}>
            <HeaderTitle nav={navigation} titleHeader={"Chỉnh sửa thông tin"}
                colorHeader={"#FEF6E4"} />
            {
                (isLoader)
                    ?
                    <View style={{ paddingTop: 15 }}>
                        <View style={styles.viewItemManager}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: '90%' }}>
                                <ShimmerPlaceHolder
                                    shimmerStyle={{ width: 23, height: 23, borderRadius: 5 }} />
                                <View style={{ marginLeft: 8 }}>
                                    <ShimmerPlaceHolder
                                        shimmerStyle={[styles.titleItemManager, { width: '40%', height: 18, borderRadius: 5 }]} />
                                    <ShimmerPlaceHolder
                                        shimmerStyle={[styles.textItemManager, { width: '60%', height: 15, borderRadius: 5, marginTop: 7 }]} />
                                </View>
                            </View>
                            <ShimmerPlaceHolder
                                shimmerStyle={{ width: 20, height: 22, borderRadius: 5 }} />
                        </View>
                        <View style={styles.viewItemManager}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: '90%' }}>
                                <ShimmerPlaceHolder
                                    shimmerStyle={{ width: 23, height: 23, borderRadius: 5 }} />
                                <View style={{ marginLeft: 8 }}>
                                    <ShimmerPlaceHolder
                                        shimmerStyle={[styles.titleItemManager, { width: '40%', height: 18, borderRadius: 5 }]} />
                                    <ShimmerPlaceHolder
                                        shimmerStyle={[styles.textItemManager, { width: '60%', height: 15, borderRadius: 5, marginTop: 7 }]} />
                                </View>
                            </View>
                            <ShimmerPlaceHolder
                                shimmerStyle={{ width: 20, height: 22, borderRadius: 5 }} />
                        </View>
                        <View style={styles.viewItemManager}>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: '90%' }}>
                                <ShimmerPlaceHolder
                                    shimmerStyle={{ width: 23, height: 23, borderRadius: 5 }} />
                                <View style={{ marginLeft: 8 }}>
                                    <ShimmerPlaceHolder
                                        shimmerStyle={[styles.titleItemManager, { width: '40%', height: 18, borderRadius: 5 }]} />
                                    <ShimmerPlaceHolder
                                        shimmerStyle={[styles.textItemManager, { width: '60%', height: 15, borderRadius: 5, marginTop: 7 }]} />
                                </View>
                            </View>
                            <ShimmerPlaceHolder
                                shimmerStyle={{ width: 20, height: 22, borderRadius: 5 }} />
                        </View>
                    </View>
                    : <View style={{ flex: 1, paddingTop: 15 }}>
                        {
                            (infoLogin != undefined)
                                ? <View>
                                    <View style={{ alignSelf: 'center' }}>
                                        <Image source={srcAvatar} onError={setErrorImage}
                                            style={{ width: WindowWidth * 35 / 100, height: WindowWidth * 35 / 100, borderRadius: WindowWidth * 35 / 100 }} />
                                        <TouchableOpacity style={styles.buttonChangeImage}
                                            onPress={onAvatarPicked}>
                                            <MaterialCommunityIcons name='pencil-outline'
                                                size={16} color={'#fff'} />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={[styles.viewItemManager, { borderTopColor: '#D9D9D9', borderTopWidth: 1, marginTop: 15 }]}
                                        onPress={() => OpenEditInfo(0)}>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: '90%' }}>
                                            <MaterialCommunityIcons name='card-account-details-outline' color={'#001858'} size={23} />
                                            <View style={{ marginLeft: 8 }}>
                                                <Text style={styles.titleItemManager}>Tên cửa hàng</Text>
                                                <Text style={styles.textItemManager} numberOfLines={1}>
                                                    {(infoLogin?.nameShop != undefined) ? infoLogin?.nameShop : "Không có dữ liệu"}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => OpenEditInfo(0)}>
                                            <MaterialCommunityIcons name='chevron-right' color={'#001858'} size={27} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.viewItemManager}
                                        onPress={() => OpenEditInfo(1)}>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: '90%' }}>
                                            <MaterialIcons name='drive-file-rename-outline' color={'#001858'} size={23} />
                                            <View style={{ marginLeft: 8 }}>
                                                <Text style={styles.titleItemManager}>Địa chỉ cửa hàng</Text>
                                                <Text style={styles.textItemManager} numberOfLines={1}>
                                                    {(infoLogin?.locationShop != undefined) ? infoLogin?.locationShop : "Không có dữ liệu"}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => OpenEditInfo(1)}>
                                            <MaterialCommunityIcons name='chevron-right' color={'#001858'} size={27} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.viewItemManager}
                                        onPress={() => OpenEditInfo(2)}>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: '90%' }}>
                                            <MaterialCommunityIcons name='cake' color={'#001858'} size={23} />
                                            <View style={{ marginLeft: 8 }}>
                                                <Text style={styles.titleItemManager}>Mô tả cửa hàng</Text>
                                                <Text style={styles.textItemManager} numberOfLines={1}>
                                                    {(infoLogin?.description != undefined) ? infoLogin?.description : "Không có dữ liệu"}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => OpenEditInfo(2)}>
                                            <MaterialCommunityIcons name='chevron-right' color={'#001858'} size={27} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.viewItemManager}
                                        onPress={() => OpenEditAccount(0)}>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: '90%' }}>
                                            <MaterialCommunityIcons name='phone-outline' color={'#001858'} size={23} />
                                            <View style={{ marginLeft: 8 }}>
                                                <Text style={styles.titleItemManager}>Số liên hệ</Text>
                                                <Text style={styles.textItemManager} numberOfLines={1}>
                                                    {(infoLogin?.hotline != undefined) ? "+" + infoLogin?.hotline : "Không có dữ liệu"}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => OpenEditAccount(0)}>
                                            <MaterialCommunityIcons name='chevron-right' color={'#001858'} size={27} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.viewItemManager}
                                        onPress={() => OpenEditAccount(1)}>
                                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', width: '90%' }}>
                                            <MaterialCommunityIcons name='email-outline' color={'#001858'} size={23} />
                                            <View style={{ marginLeft: 8 }}>
                                                <Text style={styles.titleItemManager}>Email</Text>
                                                <Text style={styles.textItemManager} numberOfLines={1}>
                                                    {(infoLogin?.email != undefined) ? infoLogin?.email : "Không có dữ liệu"}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => OpenEditAccount(1)}>
                                            <MaterialCommunityIcons name='chevron-right' color={'#001858'} size={27} />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                </View>
                                : ""
                        }
                    </View>
            }
        </View>
    );
}


export default memo(AccountManager);