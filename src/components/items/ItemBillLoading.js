import React, { memo, useState } from 'react';
import {
    View
} from 'react-native';
import styles, { WindowWidth } from '../../styles/all.style';
import ShimmerPlaceHolder from '../../components/layout/ShimmerPlaceHolder';

const ItemBillLoading = () => {
    return (
        <>
            <View style={{ padding: 15 }}>
                <View style={[styles.flexRow, styles.itemsCenter, styles.justifyBetween, { width: '100%', }]}>
                    <View style={[styles.flexRow, styles.itemsCenter, { width: '65%' }]}>
                        <ShimmerPlaceHolder
                            shimmerStyle={{ height: 20, width: 20, borderRadius: 20 }} />
                        <ShimmerPlaceHolder
                            shimmerStyle={[{ height: 20, marginLeft: 5, borderRadius: 5, width: '50%', }]} />
                    </View>
                    <View style={[{ width: '30%', alignItems: 'flex-end' }]}>
                        <ShimmerPlaceHolder
                            shimmerStyle={[{ height: 17, borderRadius: 5, width: '70%', }]} />
                    </View>
                </View>
                <View
                    style={{
                        marginTop: 9,
                        marginBottom: 7,
                        flexDirection: 'row',
                    }}>
                    <View>
                        <ShimmerPlaceHolder
                            shimmerStyle={{ width: 90, height: 90, borderRadius: 10 }} />
                    </View>
                    <View style={[styles.justifyBetween, { marginLeft: 10, width: WindowWidth - 130, height: 90 }]}>
                        <ShimmerPlaceHolder
                            shimmerStyle={[{ height: 20, borderRadius: 5, width: '50%', }]} />
                        <View>
                            <ShimmerPlaceHolder
                                shimmerStyle={[{ height: 17, borderRadius: 5, width: '50%', }]} />
                            <ShimmerPlaceHolder
                                shimmerStyle={[{ height: 17, borderRadius: 5, width: '50%', marginTop: 5 }]} />
                        </View>
                    </View>
                </View>
                <View style={[styles.justifyFlexend, styles.itemsFlexEnd]}>
                    <ShimmerPlaceHolder
                        shimmerStyle={[{ height: 20, borderRadius: 5, width: '40%' }]} />
                </View>
            </View>
            <View style={{ backgroundColor: '#D8D7D4', width: '100%', height: 5 }} />
        </>
    )
}

export default memo(ItemBillLoading);