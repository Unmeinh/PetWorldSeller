import React, { useState } from 'react';
import {
    Text, View
} from 'react-native';
import styles, { WindowWidth, darkBlue, yellowWhite } from '../../styles/all.style';
import HeaderLogo from '../../components/header/HeaderLogo';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import RevenueStatistics from './RevenueStatistics';
import ProductStatistics from './ProductStatistics';
import { memo } from 'react';

const HomeScreen = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'revenue', title: 'Doanh thu' },
        { key: 'product', title: 'Sản phẩm' },
    ]);

    const renderScene = SceneMap({
        revenue: RevenueStatistics,
        product: ProductStatistics,
    });

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            pressColor='#F8ECD1'
            indicatorStyle={{ backgroundColor: '#F582AE' }}
            style={{ backgroundColor: '#FEF6E4' }}
            renderLabel={({ route, focused, color }) => (
                <Text
                    style={{
                        color: focused ? darkBlue : 'rgba(0, 24, 88, 0.50)',
                        fontFamily: 'ProductSans',
                        fontWeight: 'bold',
                    }} >
                    {route.title}
                </Text>
            )}
        />
    );

    return (
        <View style={styles.container}>
            <HeaderLogo colorHeader={yellowWhite} />
            <TabView
                style={{ top: -5 }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
            />
        </View>
    );
}


export default memo(HomeScreen);