import {
  TextInput,
  Text, View,
  TouchableHighlight,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Pressable
} from 'react-native'
import React, { useState } from 'react'
import styles, { WindowWidth } from '../../styles/all.style';
import HeaderTitle from '../../components/header/HeaderTitle';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PhoneSelect from '../../components/modals/PhoneSelect';
import { onSendOTPbyPhoneNumber, onSendOTPbyEmail } from '../../utils/functionSupport';
import { onAxiosPut } from '../../api/axios.function';
import Toast from 'react-native-toast-message';

export default function ForgetPassword({ navigation }) {
  const [inputPhoneCountry, setinputPhoneCountry] = useState('+84');
  const [inputPhoneNumber, setinputPhoneNumber] = useState('');
  const [inputEmail, setinputEmail] = useState('');
  const [isSelectPhone, setisSelectPhone] = useState(false);
  const [isSelectEmail, setisSelectEmail] = useState(false);
  const [isShowPhoneSelect, setisShowPhoneSelect] = useState(false);
  const [widthPhoneSelect, setwidthPhoneSelect] = useState(0);
  const [isDisableRequest, setisDisableRequest] = useState(false);

  function onSelectPhone() {
    if (isSelectPhone == false && isSelectEmail == false) {
      setisSelectPhone(true);
    } else {
      if (isSelectEmail == true) {
        setisSelectPhone(true);
        setisSelectEmail(false);
      }
    }
  }

  function onSelectEmail() {
    if (isSelectPhone == false && isSelectEmail == false) {
      setisSelectEmail(true);
    } else {
      if (isSelectPhone == true) {
        setisSelectEmail(true);
        setisSelectPhone(false);
      }
    }
  }

  function onInputPhoneNumber(input) {
    var phoneNUM = input.replace(/\D/g, '');
    setinputPhoneNumber(phoneNUM);
  }

  function onInputPhoneCountry(input) {
    setinputPhoneCountry(input);
    setisShowPhoneSelect(false);
  }

  async function onContinue() {
    Keyboard.dismiss();
    var regEmail = /^(?=[A-Za-z]).*@[a-zA-Z]+.[a-zA-Z]{2,}$/;
    var regPhone = /^(\+\d{9,})$/;

    if (isSelectPhone == false && isSelectEmail == false) {
      Toast.show({
        type: 'error',
        text1: 'Phương thức xác minh chưa được chọn!',
        position: 'top',
      })
      return;
    }

    if (!(inputPhoneCountry + inputPhoneNumber).match(regPhone) && isSelectPhone == true) {
      Toast.show({
        type: 'error',
        text1: 'Số điện thoại cần đúng định dạng!\nVí dụ: +123456789',
        position: 'top',
      })
      return;
    }

    if (!inputEmail.match(regEmail) && isSelectEmail == true) {
      Toast.show({
        type: 'error',
        text1: 'Email cần đúng định dạng!\nVí dụ: abc@def.xyz',
        position: 'top',
      })
      return;
    }

    Toast.show({
      type: 'loading',
      position: 'top',
      text1: "Đang gửi mã xác minh...",
      autoHide: false
    });
    if (isSelectPhone == true) {
      let res = await onAxiosPut('shop/checkPhoneNumber', { hotline: inputPhoneCountry.substring(1) + inputPhoneNumber }, 'json');
      if (res && res.success) {
        const response = await onSendOTPbyPhoneNumber(inputPhoneCountry + inputPhoneNumber);
        if (response && response.success) {
          setTimeout(() => {
            navigation.replace('ConfirmOTP', { navigate: "ChangePassword", typeVerify: 'phoneNumber', valueVerify: inputPhoneCountry + inputPhoneNumber, authConfirm: (code) => response.confirm.confirm(code) })
          }, 500)
        } 
      } 
    } else {
      let res = await onAxiosPut('shop/checkEmail', { email: inputEmail }, 'json');
      if (res && res.success) {
        const response = await onSendOTPbyEmail(inputEmail);
        if (response) {
          navigation.replace('ConfirmOTP', { navigate: "ChangePassword", typeVerify: 'email', valueVerify: inputEmail, authConfirm: null })
        } 
      }
    }
  }

  const onLayoutPhoneSelect = (event) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    setwidthPhoneSelect(width);
  }

  return (
    <Pressable onPress={() => {
      if (isShowPhoneSelect) {
        setisShowPhoneSelect(false);
      }
    }} style={{ backgroundColor: '#FEF6E4', flex: 1 }}>
      <View style={{ backgroundColor: '#FEF6E4', flex: 1 }}>
        <HeaderTitle titleHeader={'Quên mật khẩu'} colorHeader={'#FEF6E4'} />
        <View style={[styles.container, styles.formContainer]}>
          <Text style={[styles.titleLargeForm, styles.textDarkBlue]}>
            Thay đổi mật khẩu
          </Text>
          <Text style={styles.textDetailForm}>
            Hãy nhập số điện thoại hoặc email{'\n'}của bạn để tiếp tục
          </Text>
          <View>
            <Text style={[{
              color: 'rgba(0, 24, 88, 0.80)',
            }, styles.titleInput]}>Số điện thoại của bạn</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={onSelectPhone}>
                {
                  (isSelectPhone)
                    ?
                    <View>
                      <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                      <FontAwesome name='circle' color={'#53BF2D'} style={styles.isSelectOption} size={11} />
                    </View>
                    : <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                }
              </TouchableOpacity>
              <View style={[styles.viewInputSelectPhone, styles.textDarkBlue, styles.bgLightBrown, styles.flexRow]}
                onLayout={onLayoutPhoneSelect}>
                <Pressable onPress={() => {
                  if (isSelectPhone) {
                    setisShowPhoneSelect(true);
                  }
                }}>
                  <TextInput style={[styles.textInputPhoneCountry, styles.textDarkBlue, styles.bgLightBrown]}
                    value={inputPhoneCountry}
                    editable={false} />
                </Pressable>
                <TextInput style={[styles.textInputPhoneNumber, styles.textDarkBlue, styles.bgLightBrown]}
                  keyboardType='number-pad' value={inputPhoneNumber}
                  onChangeText={(input) => { onInputPhoneNumber(input) }}
                  editable={isSelectPhone} />
                <FontAwesome name='sort-down' style={styles.dropdownSelectPhone}
                  color={'#00185880'} size={13} />
              </View>
              <PhoneSelect isShow={isShowPhoneSelect} callBack={onInputPhoneCountry}
                width={widthPhoneSelect} />
            </View>
          </View>
          <View>
            <Text style={[{
              color: 'rgba(0, 24, 88, 0.80)',
            }, styles.titleInput]}>Email của bạn</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={onSelectEmail}>
                {
                  (isSelectEmail)
                    ?
                    <View>
                      <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                      <FontAwesome name='circle' color={'#53BF2D'} style={styles.isSelectOption} size={11} />
                    </View>
                    : <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                }
              </TouchableOpacity>
              <TextInput style={[styles.textInputSelect, styles.textDarkBlue, styles.bgLightBrown]} value={inputEmail}
                onChangeText={(input) => { setinputEmail(input) }}
                keyboardType='email-address' editable={isSelectEmail} />
            </View>
          </View>
          <TouchableHighlight style={[styles.buttonConfirmFullPink, styles.bgPinkLotus, styles.itemsCenter, { marginTop: 75 }]}
            activeOpacity={0.5} underlayColor="#DC749C"
            onPress={onContinue} disabled={isDisableRequest}>
            <Text style={[styles.textButtonConfirmFullPink, styles.textYellowWhite]}>Tiếp tục</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Pressable>
  )
}