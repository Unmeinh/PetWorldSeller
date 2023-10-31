import { StyleSheet, StatusBar, Dimensions } from 'react-native';
let WindowWidth = Dimensions.get("window").width;
let WindowHeight = Dimensions.get("window").height;
let StatusHeight = StatusBar.currentHeight;
let yellowWhite = '#FEF6E4';
let lightBrown = '#F3D2C1';
let lighBlue = '#8BD3DD';
let pinkLotus = '#F582AE';
let darkBlue = '#001858';

export default StyleSheet.create({
    buttonSmallPink: {
        paddingHorizontal: 13,
        paddingVertical: 6,
        borderRadius: 7,
        borderWidth: 0.5,
        borderColor: 'rgba(0, 24, 88, 0.55)',
        marginLeft: 10,
        backgroundColor: yellowWhite,
        shadowColor: "#000",
        elevation: 9,
    },

    textButtonSmallPink: {
        fontSize: 11,
        color: darkBlue,
        fontFamily: 'ProductSans',
        fontWeight: 'bold',
    },

    buttonSortProduct: {
        paddingHorizontal: 13,
        paddingVertical: 6,
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: 'rgba(0, 24, 88, 0.55)',
        marginLeft: 10,
        backgroundColor: yellowWhite,
    },
  
    textTime: {
        fontSize: 13,
        fontFamily: 'ProductSans',
        color: 'rgba(0, 0, 0, 0.65)',
        paddingLeft: 3
    },

    titleDetail: {
        fontSize: 14,
        fontFamily: 'ProductSans',
        color: 'rgba(0, 24, 88, 0.80)',
        marginBottom: 3
    },

    viewDeleteImage: {
        flexDirection: 'row',
        position: 'absolute',
        right: 0
    },

    buttonDeleteImage: {
        backgroundColor: '#fff',
        width: 15, height: 15,
        borderRadius: 15 / 2,
        borderColor: '#000',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
