import React, { useState } from 'react';
import {
    Text, View,
    ScrollView
} from 'react-native';
import styles, { darkBlue, yellowWhite } from '../../styles/all.style';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
// import { fetchNotices } from '../../redux/reducers/notice/noticeReducer';
// import { selectAllNotices } from '../../redux/selectors/selector';
import LottieAnimation from '../../components/layout/LottieAnimation';
import { RefreshControl } from "react-native-gesture-handler";
import HeaderLogo from '../../components/header/HeaderLogo';

const NotifyScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    // const notices = useSelector(selectAllNotices);
    const notices = [];
    const [extraNotices, setextraNotices] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [isRefreshing, setisRefreshing] = useState(false);

    async function onGetNotices() {
        // dispatch(fetchNotices());
    }

    const ItemNotice = (row) => {
        return (
            <View></View>
        )
    }

    // React.useEffect(() => {
    //     if (notices != undefined) {
    //         let clone = [...extraNotices];
    //         clone = notices;
    //         setextraNotices(clone);
    //         if (isLoading) {
    //             setisLoading(false);
    //         }
    //         if (isRefreshing) {
    //             setisRefreshing(false);
    //         }
    //     }
    // }, [notices]);

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            if (notices && notices.length <= 0) {
                onGetNotices();
            }
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    const onReloadData = React.useCallback(() => {
        setisRefreshing(true);
        onGetNotices();
    }, []);

    return (
        <View style={styles.container}>
            <HeaderLogo colorHeader={yellowWhite} />
            {
                (isLoading)
                    ? <ScrollView showsVerticalScrollIndicator={false}>

                    </ScrollView>
                    : <>
                        {
                            (notices && notices.length > 0)
                                ? <FlatList
                                    data={notices}
                                    extraData={extraNotices}
                                    renderItem={({ item, index }) =>
                                        <ItemNotice key={index} item={item}
                                            index={index} fetchNotices={onGetNotices} />}
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item, index) => index.toString()}
                                    refreshControl={
                                        <RefreshControl refreshing={isRefreshing} onRefresh={onReloadData} progressViewOffset={0} />
                                    } />
                                : <ScrollView refreshControl={
                                    <RefreshControl refreshing={isRefreshing} onRefresh={onReloadData} progressViewOffset={0} />
                                }>
                                    <View style={styles.viewEmptyList}>
                                        <LottieAnimation fileJson={require('../../assets/images/jsons/catNotify.json')}
                                            isLoop={true} isAutoPlay={true}
                                            style={{ width: "70%", aspectRatio: 1 }} />
                                        <Text style={styles.textEmptyList}>Không có thông báo nào..</Text>
                                    </View>
                                </ScrollView>
                        }
                    </>
            }
        </View>
    );
}


export default NotifyScreen;