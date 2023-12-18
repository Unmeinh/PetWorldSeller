import React, { useState, memo } from 'react';
import {
    Text, ScrollView,
    View, TouchableOpacity
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

const SoldStatistics = () => {
    const navigation = useNavigation();
    const selectIndex = useSelector(indexHomeTabSelector);
    const [chartMonths, setchartMonths] = useState([]);
    const [countsPet6Month, setcountsPet6Month] = useState([]);
    const [countsProduct6Month, setcountsProduct6Month] = useState([]);
    const [countsPet, setcountsPet] = useState([]);
    const [countsProduct, setcountsProduct] = useState([]);
    const [fullCountPet, setfullCountPet] = useState(0);
    const [fullCountProduct, setfullCountProduct] = useState(0);
    const [isRefreshing, setisRefreshing] = useState(false);
    const [isPetChart, setisPetChart] = useState(false);
    const [isProductChart, setisProductChart] = useState(true);
    const [isLoadingPetChart, setisLoadingPetChart] = useState(true);
    const [isLoadingProdChart, setisLoadingProdChart] = useState(true);
    const [isLoadingPetList, setisLoadingPetList] = useState(true);
    const [isLoadingProductList, setisLoadingProductList] = useState(true);
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

    async function onGetChartSold() {
        let res = await onAxiosGet('shop/statistics/chart/sold');
        setisRefreshing(false);
        if (res && res.success) {
            setchartMonths(res?.data?.date);
            setcountsPet6Month(res?.data?.pet);
            setcountsProduct6Month(res?.data?.product);
            if (isProductChart) {
                setisLoadingProdChart(false);
            }
            if (isPetChart) {
                setisLoadingPetChart(false);
            }
        }
    }

    async function onGetListSold() {
        let res = await onAxiosGet('shop/statistics/year/sold');
        setisRefreshing(false);
        if (res && res.success) {
            setcountsPet(res?.data?.pet?.list);
            setfullCountPet(res?.data?.pet?.total);
            setcountsProduct(res?.data?.product?.list);
            setfullCountProduct(res?.data?.product?.total);
            if (isProductChart) {
                setisLoadingProductList(false);
            }
            if (isPetChart) {
                setisLoadingPetList(false);
            }
        }
    }

    function onChangeChart() {
        if (isPetChart) {
            setisPetChart(false);
            setisProductChart(true);
        }
        if (isProductChart) {
            setisPetChart(true);
            setisProductChart(false);
        }
    }

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            onGetChartSold();
            onGetListSold();
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    React.useEffect(() => {
        if (isPetChart) {
            if (countsPet6Month <= 0) {
                setisLoadingPetChart(true);
            }
            if (countsPet.length <= 0) {
                setisLoadingPetList(true);
            }
        }
        if (isProductChart) {
            if (countsProduct6Month <= 0) {
                setisLoadingProdChart(true);
            }
            if (countsProduct.length <= 0) {
                setisLoadingProductList(true);
            }
        }
        onGetChartSold();
        onGetListSold();
    }, [isPetChart, isProductChart]);

    React.useEffect(() => {
        if (selectIndex == 1) {
            if (isPetChart) {
                if (countsPet6Month <= 0) {
                    setisLoadingPetChart(true);
                }
                if (countsPet.length <= 0) {
                    setisLoadingPetList(true);
                }
            }
            if (isProductChart) {
                if (countsProduct6Month <= 0) {
                    setisLoadingProdChart(true);
                }
                if (countsProduct.length <= 0) {
                    setisLoadingProductList(true);
                }
            }
            onGetChartSold();
            onGetListSold();
        }
    }, [selectIndex])

    const onReloadData = React.useCallback(() => {
        setisRefreshing(true);
        setisLoadingPetChart(true);
        setisLoadingPetList(true);
        setisLoadingProdChart(true);
        setisLoadingProductList(true);
        onGetChartSold();
        onGetListSold();
    }, []);

    return (
        <View style={styles.container}>
            {
                (isPetChart)
                    ? <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={onReloadData} progressViewOffset={0} />
                        }>
                        <View style={styles.viewChartContainer}>
                            <View style={[styles.itemsCenter]}>
                                <View style={[styles.itemsCenter, { width: WindowWidth * 0.8, top: -7, right: '-3%', marginBottom: 10 }]}>
                                    <Text style={[styles.textDarkBlue, { fontWeight: 'bold', fontSize: 16 }]}>
                                        Biểu đồ thú cưng đã bán 6 tháng gần đây
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={onChangeChart} disabled={isRefreshing}
                                    style={[styles.positionAbsolute, styles.flexRow, styles.justifyCenter, { left: '2%', top: '-10%', height: WindowWidth * 0.045 }]}>
                                    <View style={{ width: WindowWidth * 0.035, left: '-15%' }}>
                                        <Ionicons name='chevron-back-outline' color={darkBlue} size={WindowWidth * 0.045} />
                                    </View>
                                    <Ionicons name='cube' color={darkBlue} size={WindowWidth * 0.04} />
                                </TouchableOpacity>
                            </View>
                            {
                                (isLoadingPetChart)
                                    ? <View style={[styles.itemsCenter, { marginBottom: 20 }]}>
                                        <ShimmerPlaceHolder shimmerStyle={{ height: 250, width: WindowWidth * 0.92, borderRadius: 15 }} />
                                    </View>
                                    : ""
                            }
                            {
                                (!isLoadingPetChart && countsPet6Month.length == 6)
                                    ? <LineChart
                                        data={{
                                            labels: chartMonths,
                                            datasets: [
                                                {
                                                    data: countsPet6Month,
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
                                            return val.substring(0, val.indexOf('.'));
                                        }}
                                        yAxisSuffix="c"
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
                                        Chi tiết thú cưng đã bán theo năm
                                    </Text>
                                    <View style={[styles.flexRow, styles.itemsCenter, { top: -7, right: 7 }]}>
                                        <Text style={styles.textDarkBlue}>2023</Text>
                                        <Ionicons name='chevron-down' color={darkBlue} style={{ marginLeft: 3, top: 1 }} />
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 15 }}>
                                    {
                                        (!isLoadingPetList && countsPet?.length > 0)
                                            ? countsPet?.map((count, index, arr) =>
                                                <Text style={styles.textDarkBlue} key={index}>
                                                    {count?.date}{(index + 1 < 10) ? "  " : ""}: {count?.value} con
                                                </Text>)
                                            : ""
                                    }
                                    {
                                        (isLoadingPetList)
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
                                        (!isLoadingPetList && countsPet.length > 0)
                                            ? <Text style={[styles.textDarkBlue, { fontWeight: 'bold' }]}>
                                                Tổng thú cưng đã bán: {(fullCountPet) ? fullCountPet + " con" : "0"}
                                            </Text>
                                            : ""
                                    }
                                    {
                                        (isLoadingPetList)
                                            ? <ShimmerPlaceHolder shimmerStyle={{ height: 15, width: WindowWidth * 0.57, marginTop: 3.5, borderRadius: 5 }} />
                                            : ""
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    : ""
            }
            {
                (isProductChart)
                    ? <ScrollView showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={onReloadData} progressViewOffset={0} />
                        }>
                        <View style={[styles.viewChartContainer, { marginBottom: 30 }]}>
                            <View style={[styles.itemsCenter]}>
                                <View style={[styles.itemsCenter, { width: WindowWidth * 0.8, top: -7, left: '-3%', marginBottom: 10 }]}>
                                    <Text style={[styles.textDarkBlue, { fontWeight: 'bold', fontSize: 16 }]}>
                                        Biểu đồ sản phẩm đã bán 6 tháng gần đây
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={onChangeChart} disabled={isRefreshing}
                                    style={[styles.positionAbsolute, styles.flexRow, styles.justifyCenter, { right: '2%', top: '-10%', height: WindowWidth * 0.045 }]}>
                                    <Ionicons name='paw-sharp' color={darkBlue} size={WindowWidth * 0.04} />
                                    <View style={{ width: WindowWidth * 0.035, left: '-15%' }}>
                                        <Ionicons name='chevron-forward-outline' color={darkBlue} size={WindowWidth * 0.045} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {
                                (isLoadingProdChart)
                                    ? <TouchableOpacity style={[styles.itemsCenter, { marginBottom: 20 }]}>
                                        <ShimmerPlaceHolder shimmerStyle={{ height: 250, width: WindowWidth * 0.92, borderRadius: 15 }} />
                                    </TouchableOpacity>
                                    : ""
                            }
                            {
                                (!isLoadingProdChart && countsProduct6Month.length == 6)
                                    ? <LineChart
                                        data={{
                                            labels: chartMonths,
                                            datasets: [
                                                {
                                                    data: countsProduct6Month,
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
                                            return val.substring(0, val.indexOf('.'));
                                        }}
                                        yAxisSuffix="sp"
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
                                        Chi tiết sản phẩm đã bán theo năm
                                    </Text>
                                    <View style={[styles.flexRow, styles.itemsCenter, { top: -7, right: 7 }]}>
                                        <Text style={styles.textDarkBlue}>2023</Text>
                                        <Ionicons name='chevron-down' color={darkBlue} style={{ marginLeft: 3, top: 1 }} />
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 15 }}>
                                    {
                                        (!isLoadingProductList && countsProduct?.length > 0)
                                            ? countsProduct?.map((count, index, arr) =>
                                                <Text style={styles.textDarkBlue} key={index}>
                                                    {count?.date}{(index + 1 < 10) ? "  " : ""}: {count?.value} sản phẩm
                                                </Text>)
                                            : ""
                                    }
                                    {
                                        (isLoadingProductList)
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
                                        (!isLoadingProductList && countsProduct.length > 0)
                                            ? <Text style={[styles.textDarkBlue, { fontWeight: 'bold' }]}>
                                                Tổng số lượng đã bán: {(fullCountProduct) ? fullCountProduct + " sản phẩm" : "0"}
                                            </Text>
                                            : ""
                                    }
                                    {
                                        (isLoadingProductList)
                                            ? <ShimmerPlaceHolder shimmerStyle={{ height: 15, width: WindowWidth * 0.57, marginTop: 3.5, borderRadius: 5 }} />
                                            : ""
                                    }
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    : ""
            }
        </View>
    );
}

export default memo(SoldStatistics);