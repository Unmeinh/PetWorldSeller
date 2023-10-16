import React, { useState } from 'react';
import {
    Text,
    View
} from 'react-native';
import styles, { yellowWhite } from '../../styles/all.style';
import HeaderLogo from '../../components/header/HeaderLogo';
// import ReactApexChart from 'react-apexcharts';

const HomeScreen = () => {

    return (
        <View style={styles.container}>
            <HeaderLogo colorHeader={yellowWhite}/>
            <Text>Hôm</Text>
        </View>
    );
}


export default HomeScreen;