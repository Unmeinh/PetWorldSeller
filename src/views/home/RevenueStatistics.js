import React, { useState, memo } from 'react';
import {
    ScrollView,
    Text,
    View
} from 'react-native';
import styles, { WindowWidth, darkBlue, lighBlue, pinkLotus } from '../../styles/all.style';
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { onAxiosGet } from '../../api/axios.function';
import ShimmerPlaceHolder from '../../components/layout/ShimmerPlaceHolder';
import { indexHomeTabSelector } from '../../redux/selectors/selector';
import { RefreshControl } from "react-native-gesture-handler";

const RevenueStatistics = () => {
    const navigation = useNavigation();
    const selectIndex = useSelector(indexHomeTabSelector);
    const [chartMonths, setchartMonths] = useState([]);
    const [totals6Month, settotals6Month] = useState([]);
    const [totals, settotals] = useState([]);
    const [fullTotal, setfullTotal] = useState(0);
    const [isRefreshing, setisRefreshing] = useState(false);
    const [isLoadingChart, setisLoadingChart] = useState(true);
    const [isLoadingList, setisLoadingList] = useState(true);
    const chartConfig = {
        backgroundGradientFrom: lighBlue,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: darkBlue,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(245, 130, 174, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 24, 88, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: '#fff'
        },
        propsForBackgroundLines: {
            color: "#0018584D",
            stroke: "#0018584D",
            // strokeDasharray: ""
        },
        useShadowColorFromDataset: true
    };

    async function onGetChartRevenue() {
        let res = await onAxiosGet('shop/statistics/chart/revenue');
        if (res && res.success) {
            setchartMonths(res?.data?.date);
            settotals6Month(res?.data?.value);
            if (isLoadingChart) {
                setisLoadingChart(false);
            }
            if (isRefreshing) {
                setisRefreshing(false);
            }
        }
    }

    async function onGetListRevenue() {
        let res = await onAxiosGet('shop/statistics/year/revenue');
        if (res && res.success) {
            settotals(res?.data?.list);
            setfullTotal(res?.data?.total);
            if (isLoadingList) {
                setisLoadingList(false);
            }
            if (isRefreshing) {
                setisRefreshing(false);
            }
        }
    }

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            onGetChartRevenue();
            onGetListRevenue();
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    React.useEffect(() => {
        if (selectIndex == 0) {
            if (totals6Month <= 0) {
                setisLoadingChart(true);
            }
            if (totals.length <= 0) {
                setisLoadingList(true);
            }
            onGetChartRevenue();
            onGetListRevenue();
        }
    }, [selectIndex])

    const onReloadData = React.useCallback(() => {
        setisRefreshing(true);
        setisLoadingChart(true);
        setisLoadingList(true);
        onGetChartRevenue();
        onGetListRevenue();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onReloadData} progressViewOffset={0} />
                }>
                <View style={[styles.viewChartContainer, { marginBottom: 30 }]}>
                    <View style={[styles.itemsCenter]}>
                        <View style={[styles.itemsCenter, { width: WindowWidth * 0.8, top: -7, marginBottom: 10 }]}>
                            <Text style={[styles.textDarkBlue, { fontWeight: 'bold', fontSize: 16 }]}>
                                Biểu đồ doanh thu 6 tháng gần đây
                            </Text>
                        </View>
                    </View>
                    {
                        (isLoadingChart)
                            ? <View style={[styles.itemsCenter, { marginBottom: 20 }]}>
                                <ShimmerPlaceHolder shimmerStyle={{ height: 250, width: WindowWidth * 0.92, borderRadius: 15 }} />
                            </View>
                            : ""
                    }
                    {
                        (!isLoadingChart && totals6Month.length == 6)
                            ? <LineChart
                                data={{
                                    labels: chartMonths,
                                    datasets: [
                                        {
                                            data: totals6Month,
                                        },
                                        {
                                            data: [0],
                                            withDots: false,
                                        },
                                    ],
                                }}
                                width={WindowWidth + WindowWidth * 0.03} // from react-native
                                height={250}
                                verticalLabelRotation={0}
                                // yAxisLabel="$"
                                formatYLabel={(val) => {
                                    return val.substring(0, val.length - 1);
                                }}
                                yAxisSuffix="tr"
                                yAxisInterval={1} // optional, defaults to 1
                                chartConfig={chartConfig}
                                bezier
                                getDotColor={(dataPoint, dataPointIndex) => {
                                    // console.log('dataPoint ---->', dataPoint);
                                    // console.log('dataPointIndex --->', dataPointIndex);
                                    return pinkLotus;
                                }}
                                style={{
                                    borderRadius: 15,
                                }} />
                            : ""
                    }
                    <View style={{ marginVertical: 10 }}>
                        <View style={[styles.flexRow, styles.justifyBetween]}>
                            <Text style={[styles.textDarkBlue,
                            {
                                fontWeight: '700',
                                borderBottomWidth: 1,
                                borderBottomColor: darkBlue,
                                top: -7, paddingHorizontal: 10
                            }]}>
                                Chi tiết doanh thu theo năm
                            </Text>
                            <View style={[styles.flexRow, styles.itemsCenter, { top: -7, right: 7 }]}>
                                <Text style={styles.textDarkBlue}>2023</Text>
                                <Ionicons name='chevron-down' color={darkBlue} style={{ marginLeft: 3, top: 1 }} />
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 15 }}>
                            {
                                (!isLoadingList && totals?.length > 0)
                                    ? totals?.map((total, index, arr) =>
                                        <Text style={styles.textDarkBlue} key={index}>
                                            {total?.date}{(index + 1 < 10) ? "  " : ""}: {total?.value}
                                        </Text>)
                                    : ""
                            }
                            {
                                (isLoadingList)
                                    ? <>
                                        <ShimmerPlaceHolder shimmerStyle={{ height: 13, width: WindowWidth * 0.4, marginTop: 3.5, borderRadius: 5 }} />
                                        <ShimmerPlaceHolder shimmerStyle={{ height: 13, width: WindowWidth * 0.4, marginTop: 9, borderRadius: 5 }} />
                                        <ShimmerPlaceHolder shimmerStyle={{ height: 13, width: WindowWidth * 0.4, marginTop: 9, borderRadius: 5 }} />
                                        <ShimmerPlaceHolder shimmerStyle={{ height: 13, width: WindowWidth * 0.4, marginTop: 9, borderRadius: 5 }} />
                                        <ShimmerPlaceHolder shimmerStyle={{ height: 13, width: WindowWidth * 0.4, marginTop: 9, marginBottom: 7, borderRadius: 5 }} />
                                    </>
                                    : ""
                            }
                            <View style={{ height: 1, width: '90%', backgroundColor: darkBlue, marginVertical: 5 }}></View>
                            {
                                (!isLoadingList && totals.length > 0)
                                    ? <Text style={[styles.textDarkBlue, { fontWeight: 'bold' }]}>
                                        Tổng doanh thu: {(fullTotal) ? fullTotal : "Lỗi dữ liệu"}
                                    </Text>
                                    : ""
                            }
                            {
                                (isLoadingList)
                                    ? <ShimmerPlaceHolder shimmerStyle={{ height: 15, width: WindowWidth * 0.57, marginTop: 3.5, borderRadius: 5 }} />
                                    : ""
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default memo(RevenueStatistics);