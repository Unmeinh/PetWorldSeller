import { StyleSheet, StatusBar, Dimensions } from 'react-native';
import formStyle from './form.style';
import toastStyle from './toast.style';
import productStyle from './product.style';
import accountStyle from './account.style';
import appointmentStyle from './appointment.style';
export let WindowWidth = Dimensions.get("window").width;
export let WindowHeight = Dimensions.get("window").height;
export let StatusHeight = StatusBar.currentHeight;
export let yellowWhite = '#FEF6E4';
export let lightBrown = '#F3D2C1';
export let lighBlue = '#8BD3DD';
export let pinkLotus = '#F582AE';
export let darkBlue = '#001858';

export default StyleSheet.create({
    //All style
    container: {
        flex: 1,
        backgroundColor: yellowWhite
    },

    textYellowWhite: {
        fontFamily: 'ProductSans',
        color: yellowWhite,
    },

    textLightBrown: {
        fontFamily: 'ProductSans',
        color: lightBrown
    },

    textLighBlue: {
        fontFamily: 'ProductSans',
        color: lighBlue
    },

    textPinkLotus: {
        fontFamily: 'ProductSans',
        color: pinkLotus
    },

    textDarkBlue: {
        fontFamily: 'ProductSans',
        color: darkBlue
    },

    bgYellowWhite: {
        backgroundColor: yellowWhite
    },

    bgLightBrown: {
        backgroundColor: lightBrown
    },

    bgLighBlue: {
        backgroundColor: lighBlue
    },

    bgPinkLotus: {
        backgroundColor: pinkLotus
    },

    bgDarkBlue: {
        backgroundColor: darkBlue
    },

    positionAbsolute: {
        position: 'absolute'
    },

    statusHeight: {
        height: StatusHeight
    },

    windowWidth: {
        width: WindowWidth,
    },

    windowHeight: {
        height: WindowHeight,
    },

    justifyCenter: {
        justifyContent: 'center'
    },

    justifyAround: {
        justifyContent: 'space-around'
    },

    justifyBetween: {
        justifyContent: 'space-between'
    },

    justifyEvenly: {
        justifyContent: 'space-evenly'
    },

    justifyFlexstart: {
        justifyContent: 'flex-start'
    },

    justifyFlexend: {
        justifyContent: 'flex-end'
    },

    itemsCenter: {
        alignItems: 'center'
    },

    itemsFlexStart: {
        alignItems: 'flex-start'
    },

    itemsFlexEnd: {
        alignItems: 'flex-end'
    },

    flexRow: {
        flexDirection: 'row'
    },

    viewEmptyList: {
        flex: 1,
        alignItems: 'center',
    },

    textEmptyList: {
        fontSize: 17,
        fontFamily: 'ProductSans',
        color: 'rgba(0, 0, 0, 0.6)',
        marginTop: 15
    },

    ...formStyle,
    ...toastStyle,
    ...productStyle,
    ...accountStyle,
    ...appointmentStyle
});
