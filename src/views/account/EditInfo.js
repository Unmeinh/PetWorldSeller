import React, { useState, memo } from 'react';
import {
    Pressable,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from 'react-native';
import HeaderTitle from '../../components/header/HeaderTitle';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles/all.style';
import { onAxiosPut } from '../../api/axios.function';
import Toast from 'react-native-toast-message';
import ShimmerPlaceHolder from '../../components/layout/ShimmerPlaceHolder';
import { onGoBack } from '../../navigation/rootNavigation';

const infoKeys = ["nameShop", "locationShop", "description"];
const infoTypes = ["tên cửa hàng", "địa chỉ", "giới thiệu"];
const infoNames = ["Tên cửa hàng", "Địa chỉ", "Giới thiệu"];

const EditInfo = ({ route }) => {
    var navigation = useNavigation();
    const infoLogin = route.params.user;
    const [inputValue, setinputValue] = useState("")
    const [oldValueDisplay, setoldValueDisplay] = useState("");
    const [isLoader, setisLoader] = useState(true);

    function onChangeInputValue(input) {
        if (route.params.infoType == 0) {
            if (input.length >= 30) {
                Toast.show({
                    type: 'error',
                    text1: "Tên cửa hàng chỉ dài tối đa 30 ký tự!",
                    position: 'top',
                })
            } else {
                setinputValue(input);
            }
        }
        if (route.params.infoType == 1) {
            setinputValue(input);
        }
        if (route.params.infoType == 2) {
            if (input.length >= 100) {
                Toast.show({
                    type: 'error',
                    text1: "Mô tả chỉ dài tối đa 100 ký tự!",
                    position: 'top',
                })
            } else {
                setinputValue(input);
            }
        }
    }

    function onShowAlert() {
        if (inputValue.trim() == "") {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: infoTypes[route.params.infoNames] + ' không được để trống!',
            })
            return;
        }
        Toast.show({
            type: 'alert',
            position: 'top',
            text1: 'Xác nhận thay đổi ' + infoTypes[route.params.infoType] + '?',
            autoHide: false,
            props: {
                confirm: async () => onSave(),
                cancel: () => {
                    Toast.hide();
                }
            }
        })
    }

    async function onSave() {
        Toast.show({
            type: 'loading',
            text1: "Đang cập nhật " + infoTypes[route.params.infoType] + "...",
            autoHide: false,
            position: 'top'
        });
        let res = await onAxiosPut('shop/updateInfo', { typeInfo: infoKeys[route.params.infoType], valueUpdate: inputValue }, 'json', true);
        if (res && res.success) {
            onGoBack();
        }
    }

    React.useEffect(() => {
        if (infoLogin) {
            switch (route.params.infoType) {
                case 0:
                    setoldValueDisplay(infoLogin.nameShop);
                    break;
                case 1:
                    setoldValueDisplay(infoLogin.locationShop);
                    break;
                case 2:
                    setoldValueDisplay(infoLogin.description);
                    break;

                default:
                    break;
            }
            setisLoader(false);
        }
    }, [infoLogin]);

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            // setisLoader(true);

            // return navigation.remove();
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <HeaderTitle nav={navigation} titleHeader={"Chỉnh sửa " + infoTypes[route.params.infoType]}
                colorHeader={"#FEF6E4"} />
            {
                (isLoader)
                    ?
                    <View style={{ paddingHorizontal: 20, paddingTop: 15 }}>
                        <View style={styles.itemEditInfo}>
                            <ShimmerPlaceHolder
                                shimmerStyle={[styles.titleItemEditInfo, { height: 22, width: '35%', borderRadius: 5 }]} />
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                <Text style={[styles.textItemEditInfo, { fontSize: 18 }]}>{'> '}</Text>
                                <ShimmerPlaceHolder
                                    shimmerStyle={[styles.textItemEditInfo, { height: 17, width: '30%', borderRadius: 5, marginLeft: 8 }]} />
                            </View>
                        </View>
                        <View style={styles.itemEditInfo}>
                            <ShimmerPlaceHolder
                                shimmerStyle={[styles.titleItemEditInfo, { height: 22, width: '35%', borderRadius: 5 }]} />
                            <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                <Text style={[styles.textItemEditInfo, { fontSize: 18 }]}>{'>'}</Text>
                                <ShimmerPlaceHolder
                                    shimmerStyle={{ height: 20, width: '93%', borderRadius: 15, marginTop: 3, marginLeft: 10 }} />
                            </View>
                        </View>
                        <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginTop: 25 }}>
                            <ShimmerPlaceHolder
                                shimmerStyle={{ height: 27, width: 80, borderRadius: 10, marginLeft: 10 }} />
                            <ShimmerPlaceHolder
                                shimmerStyle={{ height: 27, width: 80, borderRadius: 10, marginLeft: 10 }} />
                        </View>
                    </View>
                    : <View style={{ flex: 1, paddingTop: 15 }}>
                        {
                            (infoLogin != undefined)
                                ? <View style={{ paddingHorizontal: 20, marginTop: 5 }}>
                                    <View style={styles.itemEditInfo}>
                                        <Text style={styles.titleItemEditInfo}>
                                            {infoNames[route.params.infoType]} hiện tại:
                                        </Text>
                                        <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                            <Text style={[styles.textItemEditInfo, { fontSize: 18 }]}>{'> '}</Text>
                                            <Text style={[styles.textItemEditInfo, { marginLeft: 8 }]}>
                                                {oldValueDisplay}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.itemEditInfo}>
                                        <Text style={styles.titleItemEditInfo}>
                                            {infoNames[route.params.infoType]} mới:
                                        </Text>
                                        <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center' }}>
                                            <Text style={[styles.textItemEditInfo, { fontSize: 18 }]}>{'>'}</Text>
                                            {
                                                (route.params.infoType == 2)
                                                    ?
                                                    <TextInput style={styles.inputEditInfo} placeholder='Nhập dữ liệu...'
                                        placeholderTextColor={'#A0A0A0'}
                                                        value={inputValue} onChangeText={onChangeInputValue}
                                                        multiline={true} textAlignVertical='top' />
                                                    :
                                                    <TextInput style={styles.inputEditInfo} placeholder='Nhập dữ liệu...'
                                        placeholderTextColor={'#A0A0A0'}
                                                        value={inputValue} onChangeText={onChangeInputValue} />
                                            }
                                        </View>
                                    </View>
                                    <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', marginTop: 25 }}>
                                        <TouchableHighlight style={[styles.buttonFormSmall, { backgroundColor: '#8E8E8E' }]}
                                            activeOpacity={0.5} underlayColor="#6D6D6D"
                                            onPress={onGoBack}>
                                            <Text style={[styles.textButtonFormSmall, { fontSize: 13 }]}>Quay lại</Text>
                                        </TouchableHighlight>
                                        <TouchableHighlight style={[styles.buttonFormSmall, { backgroundColor: '#F582AE' }]}
                                            activeOpacity={0.5} underlayColor="#DC749C"
                                            onPress={onShowAlert}>
                                            <Text style={[styles.textButtonFormSmall, { fontSize: 13 }]}>Xác nhận</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                                : ""
                        }
                    </View>
            }
        </View>
    );
}


export default memo(EditInfo);