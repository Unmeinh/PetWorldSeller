import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    View
} from 'react-native';
import styles, { WindowWidth, darkBlue, lighBlue, lightBrown, pinkLotus, yellowWhite } from '../../styles/all.style';
import HeaderLogo from '../../components/header/HeaderLogo';
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from '@react-navigation/native';
import { getPreviosMonth } from '../../utils/functionSupport';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { memo } from 'react';

const RevenueStatistics = () => {
    const navigation = useNavigation();
    const [chartMonths, setchartMonths] = useState([]);
    const [totals6Month, settotals6Month] = useState([]);
    const [totals, settotals] = useState([]);
    const [isRefresh, setisRefresh] = useState(true);
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

    function randomInteger() {
        return Math.floor(Math.random() * 100000000)
    }

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            if (totals.length <= 0) {
                setchartMonths(getPreviosMonth(6));
                let arr_total = [];
                for (let i = 0; i < 12; i++) {
                    let number = randomInteger();
                    if ((i + 1) % 3 == 0) {
                        number = Math.floor(number / 100);
                    }
                    arr_total.push(number);
                }
                settotals(arr_total);
            }
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    React.useEffect(() => {
        if (totals.length > 0 && totals6Month.length <= 0) {
            let thisMonth = new Date().getMonth() + 1;
            let arr6Month = [];
            for (let i = thisMonth - 6; i < thisMonth; i++) {
                const total = totals[i];
                let totalByMil = total / 1000000;
                arr6Month.push(totalByMil);
            }
            let clone = [...totals];
            for (let i = thisMonth; i < 12; i++) {
                clone.splice(i, 1, 0);
            }
            settotals(clone);
            settotals6Month(arr6Month);
        }
    }, [totals])

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={[styles.viewChartContainer, {marginBottom: 30}]}>
                    <View style={[{ width: WindowWidth, top: -7, marginBottom: 10 }, styles.itemsCenter]}>
                        <Text style={[styles.textDarkBlue, { fontWeight: 'bold', fontSize: 16 }]}>
                            Biểu đồ doanh số 6 tháng gần đây
                        </Text>
                    </View>
                    {
                        (totals6Month.length == 6)
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
                                Chi tiết doanh số theo năm
                            </Text>
                            <View style={[styles.flexRow, styles.itemsCenter, { top: -7, right: 7 }]}>
                                <Text style={styles.textDarkBlue}>2023</Text>
                                <Ionicons name='chevron-down' color={darkBlue} style={{ marginLeft: 3, top: 1 }} />
                            </View>
                        </View>
                        <View style={{ paddingHorizontal: 15 }}>
                            {
                                totals.map((total, index, arr) =>
                                    <Text style={styles.textDarkBlue} key={index}>
                                        Tháng {index + 1}{(index + 1 < 10) ? "  " : ""}: {Number(total).toLocaleString('vi-VN')} đồng
                                    </Text>)
                            }
                            <View style={{ height: 1, width: '90%', backgroundColor: darkBlue, marginVertical: 5 }}></View>
                            {
                                (totals.length > 0)
                                    ? <Text style={styles.textDarkBlue}>
                                        Tổng doanh số: {totals.reduce((accumulator, currentValue) => accumulator + currentValue).toLocaleString('vi-VN')} đồng
                                    </Text>
                                    : ""
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}


export default RevenueStatistics;