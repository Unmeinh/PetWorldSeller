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
import { onAxiosPost } from '../../api/axios.function';
import { onNavigate } from '../../navigation/rootNavigation';

export default function RegisterShop({ route }) {
  const navigation = useNavigation();
  let objShop = route.params.objShop;
  const [passToggle, setpassToggle] = useState(true);
  const [confirmPassToggle, setconfirmPassToggle] = useState(true);
  const [cdSendAgain, setcdSendAgain] = useState(0);
  const [inputEmail, setinputEmail] = useState("");
  const [inputOTP, setinputOTP] = useState("");
  const [isVerified, setisVerified] = useState(false);
  const [inputLocation, setinputLocation] = useState("");
  const [inputNewPassword, setinputNewPassword] = useState('');
  const [inputConfirmPassword, setinputConfirmPassword] = useState('');
  const [numberCard, setnumberCard] = useState("");
  const [fullNameCard, setfullNameCard] = useState("");
  const [birthCard, setbirthCard] = useState("");
  const [pickedAvatar, setpickedAvatar] = useState(null);
  const [pickedFrontCard, setpickedFrontCard] = useState(null);
  const [pickedBehindCard, setpickedBehindCard] = useState(null);
  const [isOKFrontCard, setisOKFrontCard] = useState(false);
  const [isOKBehindCard, setisOKBehindCard] = useState(false);

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
      setpickedFrontCard(response);
      const result = await TextRecognition.recognize(response.path);
      let checkResult = 0;
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
        setnumberCard("");
        Toast.show({
          type: 'error',
          text1: 'Ảnh tải lên quá mờ hoặc không hợp lệ!',
          position: 'top'
        })
        if (isOKFrontCard) {
          setisOKFrontCard(false);
        }
        checkResult = 1;
      }
      if (iFullName2 > -1 && iBirth1 > -1) {
        let name = result.text.substring((iFullName2 + String('Full name:').length), iBirth1).trim();
        setfullNameCard(name);
      } else {
        setfullNameCard("");
        Toast.show({
          type: 'error',
          text1: 'Ảnh tải lên quá mờ hoặc không hợp lệ!',
          position: 'top'
        })
        if (isOKFrontCard) {
          setisOKFrontCard(false);
        }
        checkResult = 1;
      }
      if (iBirth2 > -1 && iGender > -1) {
        let birth = result.text.substring((iBirth2 + String('Date of birth:').length), iGender).trim();
        setbirthCard(birth);
      } else {
        setbirthCard("");
        Toast.show({
          type: 'error',
          text1: 'Ảnh tải lên quá mờ hoặc không hợp lệ!',
          position: 'top'
        })
        if (isOKFrontCard) {
          setisOKFrontCard(false);
        }
        checkResult = 1;
      }
      if (checkResult == 0) {
        setisOKFrontCard(true);
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
      setpickedBehindCard(response);
      const result = await TextRecognition.recognize(response.path);
      console.log(result.text);
      console.log(result.text.indexOf(numberCard + '<'));
      let checkResult = 0;
      let iCode = result.text.indexOf(numberCard + '<');
      if (iCode == -1) {
        Toast.show({
          type: 'error',
          text1: 'Ảnh tải lên quá mờ hoặc không hợp lệ!',
          position: 'top'
        })
        if (isOKBehindCard) {
          setisOKBehindCard(false);
        }
        checkResult = 1;
      }

      if (checkResult == 0) {
        setisOKBehindCard(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onSendVerify() {
    let regEmail = /^(\w+@[a-zA-Z]+\.[a-zA-Z]{2,})$/;
    if (!inputEmail.match(regEmail)) {
      Toast.show({
        type: 'error',
        text1: 'Email cần đúng định dạng: abc@def.xyz!',
        position: 'top'
      })
      return;
    }
    if (!isVerified) {
      setcdSendAgain(30);
      await onAxiosPost('shop/sendVerifyCodeEmail', { email: inputEmail }, 'json', true);
    } else {
      Toast.show({
        type: 'success',
        text1: 'Email đã được xác minh.',
        position: 'top'
      })
    }
  }

  async function onVerifyCode() {
    let regEmail = /^(\w+@[a-zA-Z]+\.[a-zA-Z]{2,})$/;
    if (!inputEmail.match(regEmail)) {
      Toast.show({
        type: 'error',
        text1: 'Email cần đúng định dạng: abc@def.xyz!',
        position: 'top'
      })
      return;
    }

    if (inputOTP.trim() == "") {
      Toast.show({
        type: 'error',
        text1: 'Mã xác minh không được để trống!',
        position: 'top'
      })
      return;
    }

    if (inputOTP.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Mã xác minh cần dài 6 số!',
        position: 'top'
      })
      return;
    }

    if (isNaN(inputOTP)) {
      Toast.show({
        type: 'error',
        text1: 'Mã xác minh cần là 6 số!',
        position: 'top'
      })
      return;
    }

    if (!isVerified) {
      let res = await onAxiosPost('shop/verifyCodeEmail', { email: inputEmail, otp: inputOTP }, 'json', true);
      if (res) {
        setisVerified(true);
      } else {
        setisVerified(false);
      }
    } else {
      Toast.show({
        type: 'success',
        text1: 'Email đã được xác minh.',
        position: 'top'
      })
    }
  }

  function checkValidate() {
    let regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}/;
    let regEmail = /^(\w+@[a-zA-Z]+\.[a-zA-Z]{2,})$/;

    if (pickedAvatar == null) {
      Toast.show({
        type: 'error',
        text1: 'Cần có ảnh đại diện cho cửa hàng!',
        position: 'top'
      })
      return false;
    }

    if (!isOKFrontCard) {
      Toast.show({
        type: 'error',
        text1: 'Cần có ảnh thẻ căn cước!',
        position: 'top'
      })
      return false;
    }

    if (!isOKBehindCard) {
      Toast.show({
        type: 'error',
        text1: 'Cần có ảnh thẻ căn cước!',
        position: 'top'
      })
      return false;
    }

    if (fullNameCard.trim() == "") {
      Toast.show({
        type: 'error',
        text1: 'Họ và tên không được để trống!',
        position: 'top'
      })
      return false;
    }

    if (numberCard.trim() == "") {
      Toast.show({
        type: 'error',
        text1: 'Số thẻ căn cước không được để trống!',
        position: 'top'
      })
      return false;
    }

    if (birthCard.trim() == "") {
      Toast.show({
        type: 'error',
        text1: 'Ngày sinh không được để trống!',
        position: 'top'
      })
      return false;
    }

    if (!inputEmail.match(regEmail)) {
      Toast.show({
        type: 'error',
        text1: 'Email cần đúng định dạng: abc@def.xyz!',
        position: 'top'
      })
      return false;
    }

    if (inputLocation.trim() == "") {
      Toast.show({
        type: 'error',
        text1: 'Địa chỉ cửa hàng không được để trống!',
        position: 'top'
      })
      return false;
    }

    if (!inputNewPassword.match(regPass)) {
      Toast.show({
        type: 'error',
        text1: 'Mật khẩu cần dài ít nhất 8 ký tự và chứa ít nhất một số, chữ cái viết thường, chữ viết hoa!',
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

    if (!isVerified) {
      Toast.show({
        type: 'error',
        text1: 'Email chưa được xác minh!',
        position: 'top'
      })
      return false;
    }

    return true;
  }

  async function onContinue() {
    if (checkValidate() == false) {
      return;
    }

    var formData = new FormData();
    formData.append("nameShop", objShop.nameShop);
    formData.append("email", inputEmail);
    formData.append("locationShop", inputEmail);
    formData.append("userName", objShop.userName);
    formData.append("passWord", inputNewPassword);
    formData.append("hotline", objShop.hotline);
    formData.append("nameIdentity", fullNameCard);
    formData.append("numberIdentity", numberCard);
    formData.append("dateIdentity", birthCard);

    let arr_Image = [pickedAvatar, pickedFrontCard, pickedBehindCard]
    if (arr_Image.length > 0) {
      for (let i = 0; i < arr_Image.length; i++) {
        var dataImage = {
          uri: Platform.OS === "android" ? arr_Image[i].path : arr_Image[i].path.replace("file://", ""),
          name: arr_Image[i].fileName,
          type: "multipart/form-data"
        };
        formData.append('imageUploaded', dataImage);
      }
    }

    onNavigate('ConfirmRegister', {
      formData: formData,
      objShop: {
        nameShop: objShop.nameShop,
        hotline: objShop.hotline,
        fullName: fullNameCard,
        numberCard: numberCard,
        dateBirth: birthCard,
      }
    })
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

  React.useEffect(() => {
    if (cdSendAgain > 0) {
      setTimeout(() => {
        var cd = cdSendAgain - 1;
        setcdSendAgain(cd);
      }, 1000)
    }
  }, [cdSendAgain]);

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
                  (pickedFrontCard != null)
                    ?
                    <Image style={{ aspectRatio: 3 / 2, borderRadius: 5 }} source={{ uri: String(pickedFrontCard.path) }} />
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
                  (pickedBehindCard != null)
                    ?
                    <Image style={{ aspectRatio: 3 / 2, borderRadius: 5 }} source={{ uri: String(pickedBehindCard.path) }} />
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
                <TextInput style={styles.textInput} value={fullNameCard}
                  onChangeText={(input) => { setinputConfirmPassword(input) }} />
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Số thẻ căn cước</Text>
              <View>
                <TextInput style={styles.textInput} value={numberCard}
                  onChangeText={(input) => { setinputConfirmPassword(input) }} />
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Ngày sinh</Text>
              <View>
                <TextInput style={styles.textInput} value={birthCard}
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
                <TextInput style={[styles.textInput, { color: 'rgba(0, 24, 88, 0.80)' }]}
                  value={(objShop.hotline != undefined) ? "+" + objShop.hotline : ""}
                  editable={false} />
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Địa chỉ email</Text>
              <View>
                <TextInput style={styles.textInput} value={inputEmail}
                  onChangeText={(input) => { setinputEmail(input) }} />
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Mã xác minh</Text>
              <View style={{ marginBottom: 25 }}>
                <TextInput style={styles.textInput} value={inputOTP}
                  maxLength={6} keyboardType='numeric'
                  onChangeText={(input) => { setinputOTP(input) }} />
                <TouchableOpacity onPress={onSendVerify} disabled={(cdSendAgain == 0) ? false : true}
                  style={{ position: 'absolute', right: 5, top: '20%' }}>
                  <Text style={[styles.textDetailRed, { fontSize: 15, color: '#4285F4' }]}>
                    Gửi mã? {(cdSendAgain == 0) ? "" : "(" + cdSendAgain + ")"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableHighlight style={{ backgroundColor: '#4285F4', position: 'absolute', right: 5, bottom: -10, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 }}
                activeOpacity={0.5} underlayColor="#3677E3"
                onPress={onVerifyCode}>
                <Text style={{ fontSize: 15, color: '#FEF6E4', fontFamily: 'ProductSans' }}>Xác minh</Text>
              </TouchableHighlight>
            </View>
          </View>

          <View>
            <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', marginTop: 20 }}></View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Địa chỉ cửa hàng</Text>
              <View>
                <TextInput style={styles.textInput} value={inputLocation}
                  onChangeText={(input) => { setinputLocation(input) }} />
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
            onPress={onContinue}>
            <Text style={styles.textButtonConfirm}>Tiếp tục</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
      <ToastLayout />
    </View>
  )
}