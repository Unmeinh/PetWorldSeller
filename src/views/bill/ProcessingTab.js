import React, { memo, useState } from 'react';
import {
    Text, View,
    ScrollView
} from 'react-native';
import styles from '../../styles/all.style';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProcessBills, removeBill } from '../../redux/reducers/bill/billReducer';
import { selectCanActionProcessingBills, selectProcessingBills } from '../../redux/selectors/selector';
import ItemBill from '../../components/items/ItemBill';
import ItemBillLoading from '../../components/items/ItemBillLoading';
import ViewActionBill from '../../components/items/ViewActionBill';
import LottieAnimation from '../../components/layout/LottieAnimation';
import { RefreshControl } from "react-native-gesture-handler";

const ProcessingTab = (route) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const bills = useSelector(selectProcessingBills);
    const canAction = useSelector(selectCanActionProcessingBills);
    const [extraBills, setextraBills] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [isRefreshing, setisRefreshing] = useState(false);

    async function onGetBills() {
        dispatch(fetchProcessBills());
    }

    async function onLoadingGetBills() {
        setisLoading(true);
        dispatch(fetchProcessBills());
    }

    React.useEffect(() => {
        if (bills != undefined) {
            let clone = [...extraBills];
            clone = bills;
            setextraBills(clone);
            if (isLoading) {
                setisLoading(false);
            }
            if (isRefreshing) {
                setisRefreshing(false);
            }
        }
    }, [bills]);

    React.useEffect(() => {
        if (route?.tabIndex == 1) {
            setisLoading(true);
            onGetBills();
        }
    }, [route]);

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            if (bills && bills.length <= 0 && route?.tabIndex == 0) {
                onGetBills();
            }
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    const onReloadData = React.useCallback(() => {
        setisRefreshing(true);
        onLoadingGetBills();
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ position: 'absolute', bottom: 0, zIndex: 50, height: 57}}>
                <ViewActionBill canAction={canAction} isLoading={isLoading} fetchBills={onLoadingGetBills} />
            </View>
            {
                (isLoading)
                    ? <ScrollView showsVerticalScrollIndicator={false}>
                        <ItemBillLoading />
                        <ItemBillLoading />
                        <ItemBillLoading />
                    </ScrollView>
                    : <>
                        {
                            (bills && bills.length > 0)
                                ? <FlatList

                                    data={bills}
                                    extraData={extraBills}
                                    style={{marginBottom: (isLoading || (canAction != undefined && canAction[0])) ? 57 : 0}}
                                    renderItem={({ item, index }) =>
                                        <ItemBill key={index} item={item}
                                            index={index} fetchBills={onGetBills} />}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    refreshControl={
                                        <RefreshControl refreshing={isRefreshing} onRefresh={onReloadData} progressViewOffset={0} />
                                    } />
                                : <ScrollView refreshControl={
                                    <RefreshControl refreshing={isRefreshing} onRefresh={onReloadData} progressViewOffset={0} />
                                }>
                                    <View style={styles.viewEmptyList}>
                                        <LottieAnimation fileJson={require('../../assets/images/jsons/emptyBox.json')}
                                            isLoop={true} isAutoPlay={true}
                                            style={{ width: "70%", aspectRatio: 1 }} />
                                        <Text style={styles.textEmptyList}>Không có đơn hàng chờ xử lý..</Text>
                                    </View>
                                </ScrollView>
                        }
                    </>
            }
        </View>
    );
}

export default memo(ProcessingTab);