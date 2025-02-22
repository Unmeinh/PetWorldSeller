import {
  Text, View,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  ToastAndroid
} from 'react-native'
import React, { useState } from 'react'
import styles from '../../styles/all.style';
import HeaderTitle from '../../components/header/HeaderTitle';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { onAxiosPut } from '../../api/axios.function';

export default function ChangePassword({ route }) {
  const navigation = useNavigation();
  const [passToggle, setpassToggle] = useState(true);
  const inputTypeVerify = route.params.typeVerify;
  const inputValueVerify = route.params.valueVerify;
  const [confirmPassToggle, setconfirmPassToggle] = useState(true);
  const [inputNewPassword, setinputNewPassword] = useState('');
  const [inputConfirmPassword, setinputConfirmPassword] = useState('');

  function onChangePassToggle() {
    if (passToggle == true) {
      setpassToggle(false);
    } else {
      setpassToggle(true);
    }
  }

  function onChangeConfirmPassToggle() {
    if (confirmPassToggle == true) {
      setconfirmPassToggle(false);
    } else {
      setconfirmPassToggle(true);
    }
  }

  function checkValidate() {
    var regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}/;

    Toast.show({
      type: 'error',
      position: 'top',
      text1: "Đang cập nhật lại mật khẩu...",
      bottomOffset: 20,
    });
    if (!inputNewPassword.match(regPass)) {
      Toast.show({
        type: 'error',
        text1: 'Mật khẩu cần dài ít nhất 8 ký tự và chứa ít nhất một số, một chữ viết thường và một chữ viết hoa!',
        position: 'top',
        props: {
          isTextLong: true
        }
      })
      return false;
    }

    if (inputNewPassword != inputConfirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Mật khẩu nhập lại không chính xác!',
        position: 'top'
      })
      return false;
    }

    return true;
  }

  async function onChangePass() {
    if (checkValidate() == false) {
      return;
    }

    let objData = {
      typeUpdate: inputTypeVerify,
      valueUpdate: inputValueVerify,
      newPassword: inputNewPassword
    }

    Toast.show({
      type: 'loading',
      position: 'top',
      text1: "Đang cập nhật lại mật khẩu...",
      bottomOffset: 20,
      autoHide: false
    });
    var response = await onAxiosPut('/shop/changePassword', objData, 'json', true);
    if (response && response.success) {
      setTimeout(() =>
        navigation.replace('LoginScreen'), 1000)
    }
  }

  return (
    <View style={{ backgroundColor: '#FEF6E4', flex: 1 }}>
      <HeaderTitle nav={navigation} titleHeader={'Quên mật khẩu'} colorHeader={'#FEF6E4'} />
      <View style={[styles.container, styles.formContainer]}>
        <Text style={[styles.titleLargeForm, styles.textDarkBlue]}>
          Thiết lập mật khẩu mới
        </Text>
        <Text style={styles.textDetailForm}>
          Hãy nhập mật khẩu mới của bạn.{'\n'}
          Mật khẩu cần dài ít nhất 8 ký tự. {'\n'}
          Bao gồm tối thiểu 1 số,{'\n'}
          1 chữ thường và 1 viết hoa.
        </Text>

        <View style={{ marginTop: 15 }}>
          <Text style={[{
            color: 'rgba(0, 24, 88, 0.80)',
          }, styles.titleInput]}>Mật khẩu mới</Text>
          <View>
            <TextInput style={[styles.textInputPass, styles.bgLightBrown, styles.textDarkBlue]}
              secureTextEntry={passToggle} value={inputNewPassword}
              onChangeText={(input) => { setinputNewPassword(input) }} />
            {
              (passToggle)
                ?
                <TouchableOpacity style={styles.togglePassword}
                  onPress={onChangePassToggle}>
                  <Entypo name='eye' color={'#001858'} size={22} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.togglePassword}
                  onPress={onChangePassToggle}>
                  <Entypo name='eye-with-line' color={'#001858'} size={22} />
                </TouchableOpacity>
            }
          </View>
        </View>

        <View>
          <Text style={[{
            color: 'rgba(0, 24, 88, 0.80)',
          }, styles.titleInput]}>Nhập lại mật khẩu mới</Text>
          <View>
            <TextInput style={[styles.textInputPass, styles.bgLightBrown, styles.textDarkBlue]}
              secureTextEntry={confirmPassToggle} value={inputConfirmPassword}
              onChangeText={(input) => { setinputConfirmPassword(input) }} />
            {
              (confirmPassToggle)
                ?
                <TouchableOpacity style={styles.togglePassword}
                  onPress={onChangeConfirmPassToggle}>
                  <Entypo name='eye' color={'#001858'} size={22} />
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.togglePassword}
                  onPress={onChangeConfirmPassToggle}>
                  <Entypo name='eye-with-line' color={'#001858'} size={22} />
                </TouchableOpacity>
            }
          </View>
        </View>

        <TouchableHighlight style={[styles.buttonConfirmFullPink, styles.bgPinkLotus, styles.itemsCenter, { marginTop: 75 }]}
          activeOpacity={0.5} underlayColor="#DC749C"
          onPress={onChangePass}>
          <Text style={[styles.textButtonConfirmFullPink, styles.textYellowWhite]}>Xác nhận</Text>
        </TouchableHighlight>
      </View>
    </View>
  )
}