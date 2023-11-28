import React, { useState } from 'react';
import {
    Text, View
} from 'react-native';
import styles, { WindowHeight, WindowWidth, darkBlue, yellowWhite } from '../../styles/all.style';
import HeaderLogo from '../../components/header/HeaderLogo';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import RevenueStatistics from './RevenueStatistics';
import SoldStatistics from './SoldStatistics';
import { useDispatch } from 'react-redux';
import { onChangeHomeTabIndex } from '../../redux/reducers/layout/layoutReducer';
import { memo } from 'react';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'revenue', title: 'Doanh thu' },
        { key: 'sold', title: 'Đã bán' },
    ]);

    function onChangeTab(ind) {
        dispatch(onChangeHomeTabIndex(ind));
        setIndex(ind);
    }

    const renderScene = SceneMap({
        revenue: RevenueStatistics,
        sold: SoldStatistics,
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
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={onChangeTab}
                renderTabBar={renderTabBar}
            />
        </View>
    );
}


export default memo(HomeScreen);