import {
  Text, View,
  TouchableOpacity,
  TextInput, Image,
  TouchableHighlight,
  ToastAndroid,
  ScrollView
} from 'react-native'
import React, { useState } from 'react'
import styles from '../../styles/form.style';
import HeaderTitle from '../../components/header/HeaderTitle';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { axiosJSON } from '../../api/axios.config';
import Toast from 'react-native-toast-message';
import { ToastLayout } from '../../components/layout/ToastLayout';
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';

export default function RegisterShop({ route }) {
  const navigation = useNavigation();
  const [passToggle, setpassToggle] = useState(true);
  const [confirmPassToggle, setconfirmPassToggle] = useState(true);
  const [inputNewPassword, setinputNewPassword] = useState('');
  const [inputConfirmPassword, setinputConfirmPassword] = useState('');
  const [numberCard, setnumberCard] = useState("");
  const [fullNameCard, setfullNameCard] = useState("");
  const [birthCard, setbirthCard] = useState("");
  const [pickedAvatar, setpickedAvatar] = useState(null);
  const [pickedFrontCart, setpickedFrontCart] = useState(null);
  const [pickedBehindCart, setpickedBehindCart] = useState(null);

  async function onAvatarPicked() {
    try {
      var response = await openPicker({
        mediaType: 'image',
        selectedAssets: 'Images',
        doneTitle: 'Xong',
        isCrop: true,
        isCropCircle: true,
        singleSelectedMode: true
      });
      setpickedAvatar(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function onFrontCardPicked() {
    try {
      var response = await openPicker({
        mediaType: 'image',
        selectedAssets: 'Images',
        doneTitle: 'Xong',
        isCrop: true,
        singleSelectedMode: true
      });
      setpickedFrontCart(response);
      const result = await TextRecognition.recognize(response.path);
      let iNumber = result.text.indexOf('No.');
      let iFullName1 = result.text.indexOf('Họ và tên');
      let iFullName2 = result.text.indexOf('Full name:');
      let iBirth1 = result.text.indexOf('Ngày sinh');
      let iBirth2 = result.text.indexOf('Date of birth:');
      let iGender = result.text.indexOf('Giới tính');
      if (iNumber > -1 && iFullName1 > -1) {
        let num = result.text.substring((iNumber + + String('No.').length), iFullName1).trim();
        setnumberCard(num);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Ảnh tải lên không hợp lệ!',
          position: 'top'
        })
      }
      if (iFullName2 > -1 && iBirth1 > -1) {
        let name = result.text.substring((iFullName2 + String('Full name:').length), iBirth1).trim();
        setfullNameCard(name);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Ảnh tải lên không hợp lệ!',
          position: 'top'
        })
      }
      if (iBirth2 > -1 && iGender > -1) {
        let birth = result.text.substring((iBirth2 + String('Date of birth:').length), iGender).trim();
        setbirthCard(birth);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Ảnh tải lên không hợp lệ!',
          position: 'top'
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onBehindCardPicked() {
    try {
      var response = await openPicker({
        mediaType: 'image',
        selectedAssets: 'Images',
        doneTitle: 'Xong',
        isCrop: true,
        singleSelectedMode: true
      });
      setpickedBehindCart(response);
      const result = await TextRecognition.recognize(response.path);
    } catch (error) {
      console.log(error);
    }
  }

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

    if (!inputNewPassword.match(regPass)) {
      ToastAndroid.show('Mật khẩu chưa đúng định dạng!', ToastAndroid.SHORT);
      ToastAndroid.show('Mật khẩu phải dài ít nhất 8 ký tự và chứa ít nhất một số, chữ cái viết thường, chữ viết hoa và ký tự đặc biệt!', ToastAndroid.LONG);
      return false;
    }

    if (inputNewPassword != inputConfirmPassword) {
      ToastAndroid.show('Mật khẩu nhập lại không trùng!', ToastAndroid.SHORT);
      return false;
    }

    return true;
  }

  async function onChangePass() {
    if (checkValidate() == false) {
      return;
    }

    let objData = {};
    objData = route.params.objShop;
    objData.passWord = inputNewPassword;

    Toast.show({
      type: 'loading',
      position: 'top',
      text1: "Đang đăng ký tài khoản...",
      bottomOffset: 20,
      autoHide: false
    });

    var response = await axiosJSON.post('/user/register', objData)
      .catch((e) => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: String(e.response.data.message),
          bottomOffset: 20
        });

      });
    if (response != undefined) {
      if (response.status == 201) {
        var data = response.data;
        try {
          if (data.success) {
            Toast.show({
              type: 'success',
              position: 'top',
              text1: String(data.message),
              bottomOffset: 20
            });
            setTimeout(() =>
              navigation.navigate('LoginScreen'), 1000)
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        var data = response.data;
        try {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: String(data.message),
            bottomOffset: 20
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  return (
    <View style={{ backgroundColor: '#FEF6E4', flex: 1 }}>
      <HeaderTitle nav={navigation} titleHeader={'Đăng ký thông tin'} colorHeader={'#FEF6E4'} />
      <ScrollView>
        <View style={styles.container}>
          <Text style={[styles.titleDetailFull, { fontWeight: 'bold', marginBottom: 15, marginTop: 0 }]}>
            Hãy bắt đầu tạo cửa hàng của bạn
          </Text>

          <View>
            <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', }}></View>
            <Text style={[{
              color: 'rgba(0, 24, 88, 0.80)',
            }, styles.titleInput]}>Ảnh đại diện cửa hàng</Text>
            <View style={{ paddingVertical: 10 }}>
              <TouchableOpacity onPress={onAvatarPicked}>
                {
                  (pickedAvatar != null)
                    ? <Image style={{ height: 65, width: 65, borderRadius: 50 }} source={{ uri: String(pickedAvatar.path) }} />
                    : <View style={{ height: 65, width: 65, borderRadius: 35, backgroundColor: '#F3D2C1', justifyContent: 'center', alignItems: 'center' }}>
                      <Entypo name='plus' size={23} color={'rgba(0, 24, 88, 0.80)'} />
                    </View>
                }
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', }}></View>
            <Text style={styles.titleDetailFull}>
              Thông tin chủ cửa hàng
            </Text>
            <Text style={[{
              color: 'rgba(0, 24, 88, 0.80)',
            }, styles.titleInput]}>Thẻ căn cước</Text>
            <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
              <Image style={{ width: '25%', aspectRatio: 3 / 2 }} source={{ uri: 'https://congdankhuyenhoc.qltns.mediacdn.vn/449484899827462144/2022/7/19/tich-hop-giay-phep-vao-cccd-16582037485611165393960.jpg' }} />
              <TouchableOpacity style={{ width: '25%', aspectRatio: 3 / 2, borderRadius: 5, marginHorizontal: 10, overflow: 'hidden' }}
                onPress={onFrontCardPicked}>
                {
                  (pickedFrontCart != null)
                    ?
                    <Image style={{ aspectRatio: 3 / 2, borderRadius: 5 }} source={{ uri: String(pickedFrontCart.path) }} />
                    :
                    <View style={{ backgroundColor: '#F3D2C1', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                      <Entypo name='plus' size={23} color={'rgba(0, 24, 88, 0.80)'} />
                      <Text style={{ color: 'rgba(0, 24, 88, 0.80)', fontSize: 10 }}>Mặt trước</Text>
                    </View>
                }
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', aspectRatio: 3 / 2, borderRadius: 5, overflow: 'hidden' }}
                onPress={onBehindCardPicked}>
                {
                  (pickedBehindCart != null)
                    ?
                    <Image style={{ aspectRatio: 3 / 2, borderRadius: 5 }} source={{ uri: String(pickedBehindCart.path) }} />
                    :
                    <View style={{ backgroundColor: '#F3D2C1', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                      <Entypo name='plus' size={23} color={'rgba(0, 24, 88, 0.80)'} />
                      <Text style={{ color: 'rgba(0, 24, 88, 0.80)', fontSize: 10 }}>Mặt sau</Text>
                    </View>
                }
              </TouchableOpacity>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 5
              }]}>Họ và tên</Text>
              <View>
                <TextInput style={styles.textInputPass} value={fullNameCard}
                  onChangeText={(input) => { setinputConfirmPassword(input) }} />
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Số thẻ căn cước</Text>
              <View>
                <TextInput style={styles.textInputPass} value={numberCard}
                  onChangeText={(input) => { setinputConfirmPassword(input) }} />
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Ngày sinh</Text>
              <View>
                <TextInput style={styles.textInputPass} value={birthCard}
                  onChangeText={(input) => { setinputConfirmPassword(input) }} />
              </View>
            </View>
          </View>

          <View>
            <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', marginTop: 20 }}></View>
            <Text style={styles.titleDetailFull}>
              Thông tin liên hệ
            </Text>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Số điện thoại</Text>
              <View>
                <TextInput style={[styles.textInputPass, { color: 'rgba(0, 24, 88, 0.80)' }]}
                  value={(route.params.objShop.hotline) ? route.params.objShop.hotline : ""}
                  editable={false} />
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Địa chỉ email</Text>
              <View>
                <TextInput style={styles.textInputPass}
                  onChangeText={(input) => { setinputConfirmPassword(input) }} />
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Mã xác nhận</Text>
              <View>
                <TextInput style={styles.textInputPass}
                  onChangeText={(input) => { setinputConfirmPassword(input) }} />
              </View>
            </View>
          </View>

          <View>
            <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', marginTop: 20 }}></View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Địa chỉ cửa hàng</Text>
              <View>
                <TextInput style={styles.textInputPass}
                />
              </View>
            </View>
          </View>

          <View>
            <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', marginTop: 20 }}></View>
            <Text style={styles.titleDetailFull}>
              Mật khẩu tài khoản
            </Text>
            <Text style={[{
              color: 'rgba(0, 24, 88, 0.80)',
            }, styles.titleInput]}>Mật khẩu mới</Text>
            <View>
              <TextInput style={styles.textInputPass}
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
              <TextInput style={styles.textInputPass}
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

          <TouchableHighlight style={[styles.buttonConfirm, { marginTop: 35, marginBottom: 25 }]}
            activeOpacity={0.5} underlayColor="#DC749C"
            onPress={onChangePass}>
            <Text style={styles.textButtonConfirm}>Đăng ký</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
      <ToastLayout />
    </View>
  )
}