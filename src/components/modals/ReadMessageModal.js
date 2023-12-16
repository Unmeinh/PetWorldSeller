import {
    Text, Pressable,
    View, TouchableOpacity,
} from "react-native";
import React, { useState, useRef, memo } from "react";
import Modal from 'react-native-modal';
import styles from "../../styles/all.style";
import Toast from "react-native-toast-message";

const ReadMessageModal = (route) => {
    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            animationOutTiming={350}
            animationInTiming={350}
            isVisible={route.isShow}
            backdropColor="rgba(0, 0, 0, 0.5)"
            onBackdropPress={route.callBackHide}
            onBackButtonPress={route.callBackHide}>
            <View style={styles.modalMenuContainer} >
                <View style={styles.menuAppointment}>
                    {/* View control */}
                    <Pressable>
                        <View style={{ width: '100%', paddingVertical: 15, paddingHorizontal: 20 }}>
                            <Text style={[styles.textDarkBlue, { fontSize: 17, fontWeight: 'bold', lineHeight: 25 }]}>
                                Cho phép OurPet Seller đọc tin nhắn bên dưới và tự động điền mã xác minh?
                            </Text>
                            <Text style={[styles.textDarkBlue, { fontSize: 16, color: 'rgba(0, 0, 0, 0.60)', marginTop: 13 }]}>
                                {route?.massage}
                            </Text>
                            <View style={[styles.flexRow, styles.justifyFlexend, styles.itemsCenter, { width: '100%', marginTop: 20 }]}>
                                <TouchableOpacity style={[{ backgroundColor: '#F2F2F2', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginRight: 20 }]}
                                    onPress={route?.onDeny}>
                                    <Text style={[styles.textPinkLotus, { fontSize: 17, fontWeight: 'bold' }]}>Từ chối</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.bgPinkLotus, { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5 }]}
                                    onPress={route?.onAllow}>
                                    <Text style={[styles.textYellowWhite, { fontSize: 17, fontWeight: 'bold' }]}>Đồng ý</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Pressable>
                </View>
            </View>
        </Modal >
    );
};

export default memo(ReadMessageModal);