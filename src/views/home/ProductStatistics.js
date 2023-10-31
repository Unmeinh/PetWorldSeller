import React, { useState } from 'react';
import {
    Text,
    View, ScrollView
} from 'react-native';
import styles, { WindowWidth, darkBlue, lighBlue, lightBrown, pinkLotus, yellowWhite } from '../../styles/all.style';
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from '@react-navigation/native';
import { getPreviosMonth } from '../../utils/functionSupport';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { memo } from 'react';

const ProductStatistics = () => {
    const navigation = useNavigation();
    const [chartMonths, setchartMonths] = useState([]);
    const [counts6Month, setcounts6Month] = useState([]);
    const [counts, setcounts] = useState([]);
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
        return Math.floor(Math.random() * 100)
    }

    React.useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            if (counts.length <= 0) {
                setchartMonths(getPreviosMonth(6));
                let arr_count = [];
                for (let i = 0; i < 12; i++) {
                    let number = randomInteger();
                    if ((i + 1) % 3 == 0 && number / 3 > 10) {
                        number = Math.floor(number / 3);
                    }
                    arr_count.push(number);
                }
                setcounts(arr_count);
            }
            return () => {
                unsub.remove();
            };
        });

        return unsub;
    }, [navigation]);

    React.useEffect(() => {
        if (counts.length > 0 && counts6Month.length <= 0) {
            let thisMonth = new Date().getMonth() + 1;
            let arr6Month = [];
            for (let i = thisMonth - 6; i < thisMonth; i++) {
                const count = counts[i];
                arr6Month.push(count);
            }
            let clone = [...counts];
            for (let i = thisMonth; i < 12; i++) {
                clone.splice(i, 1, 0);
            }
            setcounts(clone);
            setcounts6Month(arr6Month);
        }
    }, [counts])

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.viewChartContainer}>
                    <View style={[{ width: WindowWidth, top: -7, marginBottom: 10 }, styles.itemsCenter]}>
                        <Text style={[styles.textDarkBlue, { fontWeight: 'bold', fontSize: 16 }]}>
                            Biểu đồ sản phẩm đã bán 6 tháng gần đây
                        </Text>
                    </View>
                    {
                        (counts6Month.length == 6)
                            ? <LineChart
                                data={{
                                    labels: chartMonths,
                                    datasets: [
                                        {
                                            data: counts6Month,
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
                </View>
                <View style={[styles.viewChartContainer, {marginBottom: 70}]}>
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
                                counts.map((count, index, arr) =>
                                    <Text style={styles.textDarkBlue} key={index}>
                                        Tháng {index + 1}{(index + 1 < 10) ? "  " : ""}: {Number(count).toLocaleString()} sản phẩm
                                    </Text>)
                            }
                            <View style={{ height: 1, width: '90%', backgroundColor: darkBlue, marginVertical: 5 }}></View>
                            {
                                (counts.length > 0)
                                    ? <Text style={styles.textDarkBlue}>
                                        Tổng số lượng đã bán: {counts.reduce((accumulator, currentValue) => accumulator + currentValue).toLocaleString()} sản phẩm
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


export default memo(ProductStatistics);