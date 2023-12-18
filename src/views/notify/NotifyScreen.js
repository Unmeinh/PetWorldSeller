import React, { useState } from 'react';
import {
    Text, View,
    TouchableOpacity
} from 'react-native';
import styles, { WindowHeight, WindowWidth, darkBlue, yellowWhite } from '../../styles/all.style';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NotifyAll from './NotifyAll';
import NotifyRemind from './NotifyRemind';
import NotifyRead from './NotifyRead';
import NotifyUnRead from './NotifyUnRead';
import HeaderLogo from '../../components/header/HeaderLogo';
import { useIsFocused } from '@react-navigation/native';

const NotifyScreen = () => {
    const isFocused = useIsFocused();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: '1', title: 'Tất cả' },
        { key: '2', title: 'Nhắc nhở' },
        { key: '3', title: 'Đã đọc' },
        { key: '4', title: 'Chưa đọc' },
    ]);
    const renderScene = SceneMap({
        1: () => <NotifyAll index={index} isFocused={isFocused} />,
        2: () => <NotifyRemind index={index} isFocused={isFocused} />,
        3: () => <NotifyRead index={index} isFocused={isFocused} />,
        4: () => <NotifyUnRead index={index} isFocused={isFocused} />,
    });
    const renderTabBar = props => (
        <TabBar
            {...props}
            pressColor="transparent"
            indicatorStyle={{ backgroundColor: '#F582AE' }}
            style={{ backgroundColor: '#FEF6E4' }}
            renderLabel={({ route, focused, color }) => (
                <Text
                    style={{
                        color: focused ? '#001858' : '#001858',
                        fontSize: 16,
                        fontFamily: 'ProductSans',
                        fontWeight: 'bold',
                    }}>
                    {route.title}
                </Text>
            )}
        />
    );

    return (
        <View style={styles.container}>
            <HeaderLogo colorHeader={yellowWhite}
            // addonComponent={<View style={{position: 'absolute', top: '25%', right: 0,}}>
            //     <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
            //         <TouchableOpacity onPress={() => {}}>
            //             <Ionicons name='checkmark-done' size={24} color={'#001858'} style={{ marginRight: 5 }} />
            //         </TouchableOpacity>
            //         <TouchableOpacity onPress={() => {}}>
            //             <Ionicons name='settings-outline' size={24} color={'#001858'} style={{ marginLeft: 5 }} />
            //         </TouchableOpacity>
            //     </View>
            // </View>} 
            />
            <TabView
                style={{ marginBottom: 50 }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
            />
            {/* <View style={{ flex: 1, marginBottom: 50 }}>
                <NotifyAll index={0} isFocused={true} />
            </View> */}
        </View>
    );
}


export default NotifyScreen;