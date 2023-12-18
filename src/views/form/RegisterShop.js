import {
  Text, View,
  TouchableOpacity,
  TextInput, Image,
  TouchableHighlight,
  ScrollView,
  Pressable
} from 'react-native'
import React, { useState } from 'react'
import styles from '../../styles/all.style';
import HeaderTitle from '../../components/header/HeaderTitle';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import { onAxiosPost } from '../../api/axios.function';
import axios from 'axios';
import RNFS from 'react-native-fs';
import ShimmerPlaceHolder from '../../components/layout/ShimmerPlaceHolder';
import DatePickerModal from '../../components/modals/DatePickerModal';
import moment from 'moment';
import LocationPickerModal from '../../components/modals/LocationPickerModal';

export default function RegisterShop({ route }) {
  const navigation = useNavigation();
  let objShop = route?.params?.objShop;
  const [passToggle, setpassToggle] = useState(true);
  const [confirmPassToggle, setconfirmPassToggle] = useState(true);
  const [cdSendAgain, setcdSendAgain] = useState(0);
  const [inputEmail, setinputEmail] = useState("");
  const [inputOTP, setinputOTP] = useState("");
  const [isVerified, setisVerified] = useState(false);
  const [inputSTKZalo, setinputSTKZalo] = useState("");
  const [inputSTKMomo, setinputSTKMomo] = useState("");
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
  const [isLoadingCard, setisLoadingCard] = useState(false);
  const [isShowPicker, setisShowPicker] = useState(false);
  const [isSelectZalo, setisSelectZalo] = useState(false);
  const [isSelectMomo, setisSelectMomo] = useState(false)
  const [inputPickedLocation, setinputPickedLocation] = useState("");
  const [isShowLocationPicker, setisShowLocationPicker] = useState(false);
  const [numberLocationPicked, setnumberLocationPicked] = useState(0);
  const [inputDatePicker, setinputDatePicker] = useState(new Date(String((new Date().getFullYear() - 14) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())));
  let editable = false;

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
      if (response.crop) {
        let cropPath = "file://" + response.crop.path;
        response.crop.path = cropPath;
        response.crop.fileName = response.fileName;
        setpickedAvatar(response.crop);
      } else {
        if (response?.path.indexOf('file://') < 0 && response?.path.indexOf('content://') < 0) {
          response.path = 'file://' + res.path;
        }
        setpickedAvatar(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onCheckCardPicked(imagePath) {
    let base64Image = await RNFS.readFile(imagePath, 'base64')
      .then(async res => {
        if (res) {
          return res;
        }
      });
    if (base64Image) {
      let axiosAPI = axios.create();
      axios.defaults.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
      let res = await axiosAPI.post('https://api.regulaforensics.com/api/process',
        {
          processParam: {
            scenario: "FullProcess",
            doublePageSpread: true,
            measureSystem: 0
          },
          List: [{
            ImageData: { image: String(base64Image) },
            page_idx: 0
          }]
        })
      if (res) {
        return res;
      } else {
        return false;
      }
    }
  }

  async function onFrontCardPicked() {
    try {
      var response = await openPicker({
        mediaType: 'image',
        selectedAssets: 'Images',
        doneTitle: 'Xong',
        singleSelectedMode: true,
      });
      if (response?.path.indexOf('file://') < 0 && response?.path.indexOf('content://') < 0) {
        response.path = 'file://' + res.path;
      }
      setpickedFrontCard(response);
      setisLoadingCard(true);
      let result = await onCheckCardPicked(response?.path);
      if (result) {
        let data = result?.data?.ContainerList?.List;
        if (data && data.length > 0) {
          let checkResult = 0;
          let FaceDetection = (data.length >= 1) ? data[0]?.FaceDetection : null;
          let OneCandidate = (data.length >= 3) ? data[2]?.OneCandidate : null;
          let DocVisualExtendedInfo = (data.length >= 4) ? data[3]?.DocVisualExtendedInfo : null;
          let BarcodePosition = (data.length >= 5) ? data[4]?.BarcodePosition : null;
          let AuthenticityCheckList = (data.length >= 7) ? data[6]?.AuthenticityCheckList : null;
          let ListVerifiedFields = (data.length >= 11) ? data[10]?.ListVerifiedFields : null;
          if (!FaceDetection) {
            //Xác minh khuôn mặt
            checkResult = 1;
          }
          if (OneCandidate) {
            //Xác minh thẻ
            if (OneCandidate?.FDSIDList && OneCandidate?.FDSIDList?.dDescription == "Identity Card") {
              //Thẻ là chứng minh
            } else {
              checkResult = 1;
            }
          } else {
            checkResult = 1;
          }
          if (DocVisualExtendedInfo) {
            //Xác minh thông tin
            let pArrayFields = DocVisualExtendedInfo?.pArrayFields;
            if (pArrayFields && pArrayFields.length > 0) {
              //Đọc được thông tin
              for (let i = 0; i < pArrayFields.length; i++) {
                const pFields = pArrayFields[i];
                if (pFields?.FieldName == "Personal Number") {
                  if (numberCard == "") {
                    setnumberCard(pFields?.Buf_Text);
                  } else {
                    if (numberCard != pFields?.Buf_Text) {
                      setnumberCard(pFields?.Buf_Text);
                      setfullNameCard("");
                      setbirthCard("");
                      setinputDatePicker(new Date(String((new Date().getFullYear() - 14) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())));
                      Toast.show({
                        type: 'error',
                        text1: 'Thông tin căn cước không chính xác với mặt sau của căn cước!',
                        position: 'top'
                      })
                      setisOKFrontCard(false);
                      setisLoadingCard(false);
                      return;
                    }
                  }
                }
                if (pFields?.FieldName == "Surname And Given Names") {
                  setfullNameCard(pFields?.Buf_Text);
                }
                if (pFields?.FieldName == "Date of Birth") {
                  setbirthCard(pFields?.Buf_Text);
                  let i = pFields?.Buf_Text.indexOf('/');
                  let date = String(pFields?.Buf_Text.substring(i + 4) + "-" + pFields?.Buf_Text.substring(i + 1, i + 3) + "-" + pFields?.Buf_Text.substring(0, i));
                  setinputDatePicker(new Date(date));
                }
              }
            } else {
              checkResult = 1;
            }
          } else {
            checkResult = 1;
          }
          if (!BarcodePosition) {
            //Xác minh mã qr
            checkResult = 1;
          }
          if (AuthenticityCheckList) {
            //Xác minh danh tính
            if (AuthenticityCheckList?.Count == 0) {
              checkResult = 1;
            }
          } else {
            checkResult = 1;
          }
          if (!ListVerifiedFields) {
            //Xác minh thông tin theo danh sách
            checkResult = 1;
          }
          if (checkResult == 0) {
            Toast.show({
              type: 'success',
              text1: 'Ảnh tải lên hợp lệ!',
              position: 'top'
            })
            setisOKFrontCard(true);
            setisLoadingCard(false);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Ảnh tải lên quá mờ hoặc không hợp lệ!',
              position: 'top'
            })
            if (isOKFrontCard) {
              setisOKFrontCard(false);
            }
            setisLoadingCard(false);
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Xác minh ảnh thất bại!\nVui lòng tải lại ảnh để xác minh!',
            position: 'top'
          })
          setisOKFrontCard(false);
          setisLoadingCard(false);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Xác minh ảnh thất bại!\nVui lòng tải lại ảnh để xác minh!',
          position: 'top'
        })
        setisOKFrontCard(false);
        setisLoadingCard(false);
      }
    } catch (error) {
      console.log(error);
      setisLoadingCard(false);
    }
  }

  async function onBehindCardPicked() {
    try {
      var response = await openPicker({
        mediaType: 'image',
        selectedAssets: 'Images',
        doneTitle: 'Xong',
        singleSelectedMode: true
      });
      if (response?.path.indexOf('file://') < 0 && response?.path.indexOf('content://') < 0) {
        response.path = 'file://' + res.path;
      }
      setpickedBehindCard(response);
      setisLoadingCard(true);
      let result = await onCheckCardPicked(response?.path);
      if (result) {
        let data = result?.data?.ContainerList?.List;
        if (data && data.length > 0) {
          let checkResult = 0;
          let DocVisualExtendedInfo = (data.length >= 3) ? data[2]?.DocVisualExtendedInfo : null;
          let OneCandidate = (data.length >= 7) ? data[6]?.OneCandidate : null;
          let DocGraphicsInfo = (data.length >= 9) ? data[8]?.DocGraphicsInfo : null;
          if (DocVisualExtendedInfo) {
            //Xác minh thông tin
            let pArrayFields = DocVisualExtendedInfo?.pArrayFields;
            if (pArrayFields && pArrayFields.length > 0) {
              //Đọc được thông tin
              for (let i = 0; i < pArrayFields.length; i++) {
                const pFields = pArrayFields[i];
                if (pFields?.FieldName == "Personal Number") {
                  if (numberCard == "") {
                    setnumberCard(pFields?.Buf_Text);
                  } else {
                    if (numberCard != pFields?.Buf_Text) {
                      setnumberCard(pFields?.Buf_Text);
                      setfullNameCard("");
                      setinputDatePicker(new Date(String((new Date().getFullYear() - 14) + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate())));
                      Toast.show({
                        type: 'error',
                        text1: 'Thông tin căn cước không chính xác với mặt trước của căn cước!',
                        position: 'top'
                      })
                      setisOKBehindCard(false);
                      setisLoadingCard(false);
                      return;
                    }
                  }
                }
              }
            } else {
              checkResult = 1;
            }
          } else {
            checkResult = 1;
          }
          if (OneCandidate) {
            //Xác minh thẻ
            if (OneCandidate?.FDSIDList && OneCandidate?.FDSIDList?.dDescription == "Identity Card") {
              //Thẻ là chứng minh
            } else {
              checkResult = 1;
            }
          } else {
            checkResult = 1;
          }
          if (DocGraphicsInfo) {
            //Xác minh vân tay
            if (DocGraphicsInfo?.nFields != 2) {
              checkResult = 1;
            }
          } else {
            checkResult = 1;
          }
          if (checkResult == 0) {
            Toast.show({
              type: 'success',
              text1: 'Ảnh tải lên hợp lệ!',
              position: 'top'
            })
            setisOKBehindCard(true);
            setisLoadingCard(false);
          } else {
            Toast.show({
              type: 'error',
              text1: 'Ảnh tải lên quá mờ hoặc không hợp lệ!',
              position: 'top'
            })
            if (isOKBehindCard) {
              setisOKBehindCard(false);
            }
            setisLoadingCard(false);
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'Xác minh ảnh thất bại!\nVui lòng tải lại ảnh để xác minh!',
            position: 'top'
          })
          setisOKBehindCard(false);
          setisLoadingCard(false);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Xác minh ảnh thất bại!\nVui lòng tải lại ảnh để xác minh!',
          position: 'top'
        })
        setisOKBehindCard(false);
        setisLoadingCard(false);
      }
    } catch (error) {
      console.log(error);
      setisLoadingCard(false);
    }
  }

  async function onSendVerify() {
    var regEmail = /^(?=[A-Za-z]).*@[a-zA-Z]+.[a-zA-Z]{2,}$/;
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
    let regEmail = /^(?=[A-Za-z]).*@[a-zA-Z]+.[a-zA-Z]{2,}$/;
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
    let regEmail = /^(?=[A-Za-z]).*@[a-zA-Z]+.[a-zA-Z]{2,}$/;

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

    if (!isSelectMomo || !isSelectZalo
      || (!isSelectMomo && !isSelectZalo)) {
        Toast.show({
          type: 'error',
          text1: 'Thông tin thanh toán cần được chọn!',
          position: 'top'
        })
        return false;
    }

    if (isSelectZalo && inputSTKZalo.trim() == "") {
      Toast.show({
        type: 'error',
        text1: 'Số tài khoản không được để trống!',
        position: 'top'
      })
      return false;
    }

    if (isSelectMomo && inputSTKMomo.trim() == "") {
      Toast.show({
        type: 'error',
        text1: 'Số tài khoản không được để trống!',
        position: 'top'
      })
      return false;
    }

    if ((numberLocationPicked < 3 || inputPickedLocation == ""
      || (numberLocationPicked < 3 && inputPickedLocation == ""))) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Địa chỉ cần được chọn đầy đủ!',
      })
      return false;
    }

    if (inputLocation.trim() == "") {
      Toast.show({
        type: 'error',
        text1: 'Địa chỉ chi tiết không được để trống!',
        position: 'top'
      })
      return false;
    }

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
    formData.append("nameShop", objShop?.nameShop);
    formData.append("email", inputEmail);
    formData.append("locationShop", inputLocation + ", " + inputPickedLocation);
    formData.append("userName", objShop?.userName);
    formData.append("passWord", inputNewPassword);
    formData.append("hotline", objShop?.hotline);
    formData.append("nameIdentity", fullNameCard);
    formData.append("numberIdentity", numberCard);
    formData.append("dateIdentity", birthCard);
    formData.append("paymentMethod", (isSelectZalo) ? "Zalo Pay" : "Momo");
    formData.append("stkPayment", (isSelectZalo) ? inputSTKZalo : inputSTKMomo);

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

    navigation.replace('ConfirmRegister', {
      formData: formData,
      objShop: {
        nameShop: objShop?.nameShop,
        hotline: objShop?.hotline,
        fullName: fullNameCard,
        numberCard: numberCard,
        dateBirth: birthCard,
      }
    })
  }

  function onChangeTextEmail(input) {
    setinputEmail(input.replace(" ", ""));
  }

  function onChangeNumberCard(input) {
    var number = input.replace(/\D/g, '');
    setnumberCard(number);
  }

  function onChangeOTP(input) {
    var number = input.replace(/\D/g, '');
    setinputOTP(number);
  }

  function onSelectZalo() {
    if (isSelectZalo == false && isSelectMomo == false) {
      setisSelectZalo(true);
    } else {
      if (isSelectMomo == true) {
        setisSelectZalo(true);
        setisSelectMomo(false);
      }
    }
  }

  function onSelectMomo() {
    if (isSelectZalo == false && isSelectMomo == false) {
      setisSelectMomo(true);
    } else {
      if (isSelectZalo == true) {
        setisSelectMomo(true);
        setisSelectZalo(false);
      }
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

  function onShowDatePicker() {
    setisShowPicker(true)
  }

  function onHideDatePicker() {
    setisShowPicker(false)
  }

  function onShowLocationPicker() {
    setisShowLocationPicker(!isShowLocationPicker);
  }

  function onSetDatePicker(date) {
    setinputDatePicker(date);
    setbirthCard(moment(date).format('DD/MM/YYYY'))
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
        <View style={[styles.container, styles.formContainer]}>
          <Text style={[styles.titleDetailForm, styles.textDarkBlue, { fontWeight: 'bold', marginBottom: 15, marginTop: 0 }]}>
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
            <Text style={[styles.titleDetailForm, styles.textDarkBlue]}>
              Thông tin chủ cửa hàng
            </Text>
            <Text style={[{
              color: 'rgba(0, 24, 88, 0.80)',
            }, styles.titleInput]}>Thẻ căn cước</Text>
            <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
              <Image style={{ width: '25%', aspectRatio: 3 / 2 }} source={require('../../assets/images/democard.png')} />
              {
                (isLoadingCard)
                  ? <ShimmerPlaceHolder shimmerStyle={{ width: '25%', aspectRatio: 3 / 2, borderRadius: 5, marginHorizontal: 10, overflow: 'hidden' }} />
                  : <TouchableOpacity style={{ width: '25%', aspectRatio: 3 / 2, borderRadius: 5, marginHorizontal: 10, overflow: 'hidden' }}
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
              }
              {
                (isLoadingCard)
                  ? <ShimmerPlaceHolder shimmerStyle={{ width: '25%', aspectRatio: 3 / 2, borderRadius: 5, overflow: 'hidden' }} />
                  : <TouchableOpacity style={{ width: '25%', aspectRatio: 3 / 2, borderRadius: 5, overflow: 'hidden' }}
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
              }
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 5
              }]}>Họ và tên</Text>
              <View>
                {
                  (isLoadingCard)
                    ?
                    <ShimmerPlaceHolder shimmerStyle={{
                      marginTop: 7,
                      height: 50,
                      width: '100%',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: 'rgba(0, 0, 0, 0.50)',
                    }} />
                    :
                    <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown]} value={fullNameCard}
                      onChangeText={setfullNameCard} />
                }
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Số thẻ căn cước</Text>
              <View>
                {
                  (isLoadingCard)
                    ?
                    <ShimmerPlaceHolder shimmerStyle={{
                      marginTop: 7,
                      height: 50,
                      width: '100%',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: 'rgba(0, 0, 0, 0.50)',
                    }} />
                    :
                    <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown]} value={numberCard}
                      onChangeText={onChangeNumberCard} keyboardType='numeric' />
                }
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Ngày sinh</Text>
              <View>
                {
                  (isLoadingCard)
                    ?
                    <ShimmerPlaceHolder shimmerStyle={{
                      marginTop: 7,
                      height: 50,
                      width: '100%',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: 'rgba(0, 0, 0, 0.50)',
                    }} />
                    :
                    <Pressable onPress={onShowDatePicker}>
                      <TextInput style={[styles.textInputLogin, styles.bgLightBrown, { color: editable ? '#001858' : '#001858' }]} value={birthCard}
                        onChangeText={setbirthCard} editable={editable} />
                    </Pressable>
                }
              </View>
            </View>
          </View>

          <View>
            <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', marginTop: 20 }}></View>
            <Text style={[styles.titleDetailForm, styles.textDarkBlue]}>
              Thông tin liên hệ
            </Text>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Số điện thoại</Text>
              <View>
                <TextInput style={[[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown], { color: 'rgba(0, 24, 88, 0.80)' }]}
                  value={(objShop?.hotline != undefined) ? "+" + objShop?.hotline : ""}
                  editable={false} keyboardType='number-pad' />
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Địa chỉ email</Text>
              <View>
                <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown]}
                  value={inputEmail} keyboardType='email-address'
                  onChangeText={onChangeTextEmail} />
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Mã xác minh</Text>
              <View style={{ marginBottom: 25 }}>
                <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown]} value={inputOTP}
                  maxLength={6} keyboardType='numeric'
                  onChangeText={onChangeOTP} />
                <TouchableOpacity onPress={onSendVerify} disabled={(cdSendAgain == 0) ? false : true}
                  style={{ position: 'absolute', right: 5, top: '20%' }}>
                  <Text style={[styles.textDetailFormRed, { fontSize: 15, color: '#4285F4' }]}>
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
            <Text style={[styles.titleDetailForm, styles.textDarkBlue]}>
              Thông tin thanh toán
            </Text>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Số tài khoản Zalopay</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={onSelectZalo}>
                  {
                    (isSelectZalo)
                      ?
                      <View>
                        <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                        <FontAwesome name='circle' color={'#53BF2D'} style={styles.isSelectOption} size={11} />
                      </View>
                      : <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                  }
                </TouchableOpacity>
                <TextInput style={[styles.textInputSelect, styles.textDarkBlue, styles.bgLightBrown]} value={inputSTKZalo}
                  onChangeText={setinputSTKZalo} editable={isSelectZalo} keyboardType='number-pad' />
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Số tài khoản Momo</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={onSelectMomo}>
                  {
                    (isSelectMomo)
                      ?
                      <View>
                        <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                        <FontAwesome name='circle' color={'#53BF2D'} style={styles.isSelectOption} size={11} />
                      </View>
                      : <Feather name='circle' size={25} color={'rgba(0, 24, 88, 0.69)'} />
                  }
                </TouchableOpacity>
                <TextInput style={[styles.textInputSelect, styles.textDarkBlue, styles.bgLightBrown]} value={inputSTKMomo}
                  onChangeText={setinputSTKMomo} editable={isSelectMomo} keyboardType='number-pad' />
              </View>
            </View>
          </View>

          <View>
            <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', marginTop: 20 }}></View>
            <Text style={[styles.titleDetailForm, styles.textDarkBlue]}>
              Địa chỉ cửa hàng
            </Text>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Chọn địa chỉ</Text>
              <View>
                <Pressable onPress={onShowLocationPicker}>
                  <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown]} value={inputPickedLocation}
                    onChangeText={setinputPickedLocation} multiline editable={false} />
                </Pressable>
              </View>
            </View>
            <View>
              <Text style={[styles.titleInput, {
                color: 'rgba(0, 24, 88, 0.80)', marginTop: 10
              }]}>Địa chỉ chi tiết</Text>
              <View>
                <TextInput style={[styles.textInputLogin, styles.textDarkBlue, styles.bgLightBrown]} value={inputLocation}
                  onChangeText={setinputLocation} />
              </View>
            </View>
          </View>

          <View>
            <View style={{ backgroundColor: '#C7C5C5', height: 1.5, width: '100%', marginTop: 20 }}></View>
            <Text style={[styles.titleDetailForm, styles.textDarkBlue]}>
              Mật khẩu tài khoản
            </Text>
            <Text style={[{
              color: 'rgba(0, 24, 88, 0.80)',
            }, styles.titleInput]}>Mật khẩu mới</Text>
            <View>
              <TextInput style={[styles.textInputPass, styles.bgLightBrown, styles.textDarkBlue]}
                secureTextEntry={passToggle} value={inputNewPassword}
                onChangeText={setinputNewPassword} />
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
                onChangeText={setinputConfirmPassword} />
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

          <TouchableHighlight style={[styles.buttonConfirmFullPink, styles.bgPinkLotus, styles.itemsCenter, { marginTop: 35, marginBottom: 25 }]}
            activeOpacity={0.5} underlayColor="#DC749C"
            onPress={onContinue}>
            <Text style={[styles.textButtonConfirmFullPink, styles.textYellowWhite]}>Tiếp tục</Text>
          </TouchableHighlight>
        </View>
      </ScrollView >
      {isShowPicker &&
        <DatePickerModal type={'datebirth'} isShow={isShowPicker} datePicked={inputDatePicker} callBackClose={onHideDatePicker} callBackSetDate={onSetDatePicker} />
      }
      {isShowLocationPicker &&
        <LocationPickerModal isShow={isShowLocationPicker} callBack={onShowLocationPicker} callBackSetLocation={setinputPickedLocation} onCallBackNumberPicked={setnumberLocationPicked} />
      }
    </View >
  )
}