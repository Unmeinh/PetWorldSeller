import React, { memo, useState } from 'react';
import {
    Text, View,
    ScrollView,
} from 'react-native';
import styles, { darkBlue } from '../../styles/all.style';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBills } from '../../redux/reducers/bill/billReducer';
import { selectAllBills, selectCanActionAllBills } from '../../redux/selectors/selector';
import ItemBill from '../../components/items/ItemBill';
import ItemBillLoading from '../../components/items/ItemBillLoading';
import ViewActionBill from '../../components/items/ViewActionBill';
import { RefreshControl } from "react-native-gesture-handler";

const AllBillTab = (route) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const bills = useSelector(selectAllBills);
    const canAction = useSelector(selectCanActionAllBills);
    const [extraBills, setextraBills] = useState([]);
    const [isLoading, setisLoading] = useState(true);
    const [isRefreshing, setisRefreshing] = useState(false);

    async function onGetBills() {
        dispatch(fetchBills());
    }

    async function onLoadingGetBills() {
        setisLoading(true);
        dispatch(fetchBills());
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
        if (route?.tabIndex == 0) {
            onLoadingGetBills();
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
            <ViewActionBill canAction={canAction} isLoading={isLoading} fetchBills={onLoadingGetBills} />
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
                                    <View style={styles.viewOther}>
                                        <FontAwesome6 name='boxes-stacked' size={70} color={'rgba(0, 0, 0, 0.5)'} />
                                        <Text style={styles.textHint}>Danh sách đơn hàng trống..</Text>
                                    </View>
                                </ScrollView>
                        }
                    </>
            }
        </View>
    );
}

export default memo(AllBillTab);