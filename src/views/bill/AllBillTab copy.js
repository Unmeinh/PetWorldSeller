import React, { memo, useState } from 'react';
import {
    Text, View,
    ScrollView
} from 'react-native';
import styles from '../../styles/all.style';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBills } from '../../redux/reducers/bill/billReducer';
import { selectAllBills } from '../../redux/selectors/selector';
import ItemBill from '../../components/items/ItemBill';
import ItemBillLoading from '../../components/items/ItemBillLoading';

const AllBillTab = (route) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const bills = useSelector(selectAllBills);
    const [extraBills, setextraBills] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    async function onGetBills() {
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
        }
    }, [bills]);

    React.useEffect(() => {
        if (route?.tabIndex == 0) {
            if (bills.length <= 0) {
                setisLoading(true);
            }
            onGetBills();
        }
    }, [route]);

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            if (bills.length <= 0 && route?.tabIndex == 0) {
                onGetBills();
            }
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    return (
        <View style={styles.container}>
            {
                (isLoading)
                    ? <ScrollView showsVerticalScrollIndicator={false}>
                        <ItemBillLoading />
                        <ItemBillLoading />
                        <ItemBillLoading />
                    </ScrollView>
                    : <>
                        {
                            (bills.length > 0)
                                ? <FlatList
                                    data={bills}
                                    extraData={extraBills}
                                    renderItem={({ item, index }) =>
                                        <ItemBill key={index} item={item}
                                            index={index} fetchBills={onGetBills}/>}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()} />
                                : <View style={styles.viewOther}>
                                    <FontAwesome6 name='boxes-stacked' size={70} color={'rgba(0, 0, 0, 0.5)'} />
                                    <Text style={styles.textHint}>Danh sách đơn hàng trống..</Text>
                                </View>
                        }
                    </>
            }
        </View>
    );
}

export default memo(AllBillTab);