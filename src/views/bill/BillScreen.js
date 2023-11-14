import React, { useState } from 'react';
import {
    Text, View
} from 'react-native';
import styles, { darkBlue, yellowWhite } from '../../styles/all.style';
import { TabView, TabBar } from 'react-native-tab-view';
import AllBillTab from './AllBillTab';
import ProcessingTab from './ProcessingTab';
import DeliveringTab from './DeliveringTab';
import DeliveredTab from './DeliveredTab';
import EvaluatedTab from './EvaluatedTab';
import CancelledTab from './CancelledTab';
import { memo } from 'react';
import HeaderTitle from '../../components/header/HeaderTitle';

const BillScreen = ({ route }) => {
    const [index, setIndex] = useState((route?.params?.selectedTab) ? route?.params?.selectedTab : 0);
    const [routes] = useState([
        { key: 'all', title: 'Tất cả' },
        { key: 'processing', title: 'Chờ xử lý' },
        { key: 'delivering', title: 'Đang giao' },
        { key: 'delivered', title: 'Đã giao' },
        { key: 'evaluated', title: 'Đánh giá' },
        { key: 'cancelled', title: 'Đã hủy' },
    ]);

    const renderScene =
        ({ route }) => {
            switch (route.key) {
                case 'all':
                    return <AllBillTab tabIndex={index} />;
                case 'processing':
                    return <ProcessingTab tabIndex={index} />;
                case 'delivering':
                    return <DeliveringTab tabIndex={index} />;
                case 'delivered':
                    return <DeliveredTab tabIndex={index} />;
                case 'evaluated':
                    return <EvaluatedTab tabIndex={index} />;
                case 'cancelled':
                    return <CancelledTab tabIndex={index} />;
                default:
                    return null;
            }
        };

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            pressColor='#F8ECD1'
            indicatorStyle={{ backgroundColor: '#F582AE' }}
            style={{ backgroundColor: '#FEF6E4' }}
            tabStyle={{
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
                borderColor: darkBlue
            }}
            scrollEnabled={true}
            renderLabel={({ route, focused, color }) => (
                <Text
                    style={{
                        color: focused ? darkBlue : 'rgba(0, 24, 88, 0.50)',
                        fontFamily: 'ProductSans',
                        fontWeight: 'bold'
                    }} >
                    {route.title}
                </Text>
            )}
        />
    );

    return (
        <View style={styles.container}>
            <HeaderTitle titleHeader={'Quản lý đơn hàng'} colorHeader={yellowWhite} />
            <TabView
                style={{ top: -5 }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
            />
        </View>
    );
}


export default memo(BillScreen);