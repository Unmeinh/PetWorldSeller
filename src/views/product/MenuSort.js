import {
    Text, Pressable,
    View, TouchableOpacity,
} from "react-native";
import React, { useState, useRef, memo } from "react";
import { useNavigation } from "@react-navigation/native";
import Modal from 'react-native-modal';
import styles from "../../styles/all.style";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const MenuSort = (route) => {
    const navigation = useNavigation();
    const [canAccept, setcanAccept] = useState(false);
    const [canConfirm, setcanConfirm] = useState(false);
    const [canCancel, setcanCancel] = useState(false);

    function onSelectType() {

    }

    React.useEffect(() => {

    }, [route.status]);

    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            animationOutTiming={350}
            animationInTiming={350}
            isVisible={route.isShow}
            swipeDirection="down"
            propagateSwipe={true}
            backdropColor="rgba(0, 0, 0, 0.5)"
            onSwipeComplete={route.callBackHide}
            onBackdropPress={route.callBackHide}
            onBackButtonPress={route.callBackHide}>
            <View style={styles.modalMenuContainer} >
                <View style={styles.menuAppointment}>
                    {/* View control */}
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={styles.swipeControlModal} />
                    </View>
                    <Pressable>
                        <View style={[styles.flexRow, styles.itemsCenter, styles.justifyBetween]}>
                            <View style={[styles.flexRow, styles.itemsCenter, styles.justifyCenter, { width: '50%', }]}>
                                <TouchableOpacity onPress={onSelectType}>
                                    {
                                        (true)
                                            ?
                                            <View>
                                                <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                                                <FontAwesome name='circle' color={'#53BF2D'} style={styles.isSelectOption} size={11} />
                                            </View>
                                            : <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                                    }
                                </TouchableOpacity>
                                <Text style={[styles.textOptionMenu, {marginLeft: '3%'}]}>Ngày tạo</Text>
                            </View>
                            <View style={[styles.flexRow, styles.itemsCenter, styles.justifyCenter, { width: '50%', }]}>
                                <TouchableOpacity onPress={onSelectType}>
                                    {
                                        (true)
                                            ?
                                            <View>
                                                <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                                                <FontAwesome name='circle' color={'#53BF2D'} style={styles.isSelectOption} size={11} />
                                            </View>
                                            : <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                                    }
                                </TouchableOpacity>
                                <Text style={[styles.textOptionMenu, {marginLeft: '3%'}]}>Cao đến thấp</Text>
                            </View>
                        </View>
                    </Pressable>
                </View>
            </View>
        </Modal >
    );
};

export default memo(MenuSort);