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
    formContainer: {
        paddingHorizontal: 30,
        paddingTop: 15
    },

    viewChartContainer: {
        backgroundColor: "#fff",
        marginTop: 15,
        marginBottom: 10,
        paddingVertical: 10,
        marginHorizontal: 5,
        paddingTop: 20,
        overflow: 'hidden',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#000',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    pawBottomLeft: {
        top: WindowHeight - 87
    },

    pawBottomRight: {
        top: WindowHeight - 107,
        right: 0
    },

    slash: {
        fontSize: 40,
        marginLeft: 3, marginRight: 3
    },

    textEnable: {
        fontSize: 27,
        fontWeight: 'bold',
    },

    textDisableLogin: {
        color: 'rgba(0, 24, 88, 0.35)',
        fontSize: 27,
        fontWeight: 'bold',
    },

    textLeftGreetingLI: {
        color: pinkLotus,
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'ProductSans',
    },

    textLeftGreetingSI: {
        color: '#00A4BB',
        fontSize: 18,
        fontWeight: 'bold',
    },

    textRightGreeting: {
        color: 'rgba(0, 24, 88, 0.80)',
        fontSize: 18,
        fontWeight: '500',
    },

    titleInput: {
        fontSize: 14,
        fontFamily: 'ProductSans',
        marginTop: 15
    },

    dropdownSelectPhone: {
        position: 'absolute',
        top: '35%', left: 5
    },

    textInputLogin: {
        marginTop: 7,
        fontSize: 17,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.50)',
        paddingLeft: 15, paddingRight: 15,
        paddingTop: 9, paddingBottom: 9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    viewInputSelectPhone: {
        marginLeft: 15,
        marginTop: 7,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.50)',
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    textInputPhoneCountry: {
        fontSize: 17,
        width: 68,
        paddingLeft: 15,
        paddingHorizontal: 0,
        paddingVertical: 9,
        borderRightColor: darkBlue,
        borderRightWidth: 1
    },

    textInputPhoneNumber: {
        fontSize: 17,
        width: (WindowWidth - 118) - 53,
        paddingRight: 15,
        paddingVertical: 9
    },

    textInputSelect: {
        marginTop: 7,
        marginLeft: 15,
        width: WindowWidth - 100,
        fontSize: 17,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.50)',
        paddingHorizontal: 15,
        paddingVertical: 9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    textInputPass: {
        marginTop: 7,
        fontSize: 17,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.50)',
        paddingLeft: 15, paddingRight: 45,
        paddingTop: 9, paddingBottom: 9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    togglePassword: {
        position: 'absolute',
        right: 10, top: '35%'
    },

    checkboxRM: {
        marginTop: 15, marginRight: 5
    },

    buttonConfirmFullPink: {
        marginTop: 25,
        width: '100%',
        borderRadius: 10,
        padding: 12,
        elevation: 10,
        shadowColor: "#000000",
    },

    textButtonConfirmFullPink: {
        fontSize: 23,
        fontWeight: 'bold',
    },

    viewInfoShopConfirm: {
        backgroundColor: "#fff",
        marginTop: 15,
        marginBottom: 10,
        paddingTop: 5,
        paddingBottom: 15, 
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#000',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    titleLargeForm: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 5
    },

    titleDetailForm: {
        fontSize: 17,
        marginTop: 10
    },

    textDetailForm: {
        fontSize: 17,
        color: 'rgba(0, 24, 88, 0.69)',
        fontFamily: 'ProductSans',
        margin: 10
    },

    textDetailFormRed: {
        fontSize: 17,
        fontFamily: 'ProductSans',
        margin: 10,
        color: '#EB4335',
        marginLeft: 0,
        fontWeight: '700'
    },

    isSelectOption: {
        position: 'absolute',
        top: 7, left: 8
    },

    inputOTP: {
        fontSize: 30,
        fontWeight: '700',
        // letterSpacing: 35,
        // width: '95%',
        // paddingLeft: 0,
        // marginLeft: 0
        height: 60,
        width: '13.5%',
    },

    underlineOTP: {
        backgroundColor: '#000',
        height: 1, width: '13.5%'
    },

    //Modal phone
    modalPhoneContainer: {
        marginTop: 7,
        backgroundColor: lightBrown,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.50)',
        right: 0, top: 47,
        position: 'absolute',
        height: WindowHeight / 3,
        width: WindowWidth - 100,
        paddingVertical: 4.5,
        zIndex: 100
    },

    itemPhoneSelect: {
        color: darkBlue,
        fontSize: 17,
        fontFamily: 'ProductSans',
        width: 53,
        // paddingHorizontal: 9,
        // paddingVertical: 4.5
    },

    itemCountrySelect: {
        color: darkBlue,
        fontSize: 17,
        fontFamily: 'ProductSans',
        width: (WindowWidth - 118) - 53,
        // paddingHorizontal: 9,
        // paddingVertical: 4.5
    }
});
