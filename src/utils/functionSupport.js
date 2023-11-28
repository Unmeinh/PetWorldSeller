import Moment from 'moment';
import "moment/locale/vi";
import Toast from 'react-native-toast-message';
import { onAxiosPost } from '../api/axios.function';
import auth from '@react-native-firebase/auth';
import { Share } from 'react-native';

//Date
export function getDateTimeVietnamese(inputDate) {
    let date = Moment(inputDate);
    //45p trở lên bị đổi thành 1h
    //21h trở lên bị đổi thành 1d
    let dateHour = Moment().diff(date, 'hours');
    let dateMinute = Moment().diff(date, 'minutes');
    let isFuture = new Date() < new Date(date.format("YYYY-MM-DD"));
    if (Moment().diff(date, 'months') >= 1) {
        return toDateUpperCase(date.fromNow());
    }
    if (isFuture) {
        if (dateHour < 24) {
            if (dateHour > 20) {
                return dateHour + " giờ tới";
            } else {
                if (dateHour < 1) {
                    if (dateMinute > 40) {
                        return dateMinute + " phút tới";
                    } else {
                        return toDateUpperCase(date.fromNow());
                    }
                } else {
                    return toDateUpperCase(date.fromNow());
                }
            }
        }
    } else {
        if (dateHour < 24) {
            if (dateHour > 20) {
                return dateHour + " giờ trước";
            } else {
                if (dateHour < 1) {
                    if (dateMinute > 40) {
                        return dateMinute + " phút trước";
                    } else {
                        return toDateUpperCase(date.fromNow());
                    }
                } else {
                    return toDateUpperCase(date.fromNow());
                }
            }
        }
    }
    if (date.calendar().split(' ')[1]) {
        return toDateUpperCase(date.calendar());
    } else {
        return date.format("DD/MM/YYYY") + " lúc " + date.format("HH:mm")
    }
}

export function getDateVietnamese(inputDate) {
    let date = Moment(inputDate);
    if (Moment().diff(date, 'months') >= 2) {
        return toDateUpperCase(date.fromNow());
    }
    if (date.calendar().split(' ')[1]) {
        return toDateUpperCase(date.calendar().substring(0, date.calendar().indexOf('lúc')));
    } else {
        return date.format("DD/MM/YYYY");
    }
}

export function getDateDefault(inputDate) {
    let date = Moment(inputDate);
    return "Ngày " + date.format("DD/MM/YYYY");
}

export function getTimeDefault(inputDate) {
    let date = Moment(inputDate);
    return "Lúc " + date.format("HH:mm A");
}

export function getDateTimeDefault(inputDate) {
    let date = Moment(inputDate);
    return date.format("DD/MM/YYYY HH:mm A");
}

export function getMonthVietnamese(inputDate) {
    let date = new Date();
    if (date.getMonth() == new Date(inputDate).getMonth()) {
        return "Tháng này";
    }
    if (date.getMonth() < new Date(inputDate).getMonth()) {
        if (new Date(inputDate).getMonth() - date.getMonth() == 1) {
            return "Tháng sau";
        } else {
            return "Tháng " + (new Date(inputDate).getMonth() + 1);
        }
    }
    if (date.getMonth() > new Date(inputDate).getMonth()) {
        if (date.getMonth() - new Date(inputDate).getMonth() == 1) {
            return "Tháng trước";
        } else {
            return "Tháng " + (new Date(inputDate).getMonth() + 1);
        }
    }
}

function toDateUpperCase(date) {
    let upcaseHead = date.substring(0, 1).toLocaleUpperCase();
    return upcaseHead + date.substring(1);
}

export function getPreviosMonth(nMonth) {
    const months = [];
    const endDate = new Date();
    const lastnMonth = new Date(endDate.getFullYear(), endDate.getMonth() - (nMonth - 1), 1);
    let currentDate = new Date(lastnMonth);

    while (currentDate <= endDate) {
        let previusDate = currentDate.toISOString();
        let nowDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString();
        let date = currentDate.toLocaleString('en', { month: 'numeric', year: 'numeric' });
        months.push(date);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
}

//OTP
export async function onSendOTPbyPhoneNumber(phone) {
    try {
        Toast.show({
            type: 'loading',
            position: 'top',
            text1: "Đang gửi mã xác minh...",
            bottomOffset: 20,
            autoHide: false
        });
        const confirmation = await auth().signInWithPhoneNumber(phone);
        Toast.show({
            type: 'success',
            position: 'top',
            text1: "Gửi mã xác minh thành công.",
            bottomOffset: 20
        });
        return {
            success: true,
            confirm: confirmation
        };
    } catch (error) {
        console.log(error);
        if (String(error).indexOf('[auth/invalid-phone-number]') >= 0) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: "Số điện thoại không hợp lệ!\nKhông thể tìm thấy số điện thoại để xác minh!",
                bottomOffset: 20
            });
        }
        if (String(error).indexOf('[auth/too-many-requests]') >= 0) {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: "Thiết bị của bạn đang tạm thời bị chặn vì gửi quá nhiều yêu cầu lên hệ thống!\nVui lòng thử lại sau!",
                bottomOffset: 20
            });
        }
        return undefined;
    }
}

export async function onSendOTPbyEmail(email) {
    Toast.show({
        type: 'loading',
        position: 'top',
        text1: "Đang gửi mã xác minh...",
        bottomOffset: 20,
        autoHide: false
    });
    var response = await onAxiosPost('shop/sendResetPasswordEmail', { email: email }, 'json', true);
    if (response && response.success) {
        return true;
    } else {
        return false;
    }
}

export async function onVerifyOTPbyEmail(email, otp) {
    var response = await onAxiosPost('user/verifyResetPasswordCode', { email: email, otp: otp }, 'json', true);
    if (response && response.success) {
        return true;
    } else {
        return false;
    }
}

//Share
export async function onSharingBlog(blogId) {
    try {
        let urlShare = "https://server-pet-world.onrender.com/blog/shareBlog/" + encodeToAscii(blogId);
        const result = await Share.share({
            message: urlShare,
            title: "Chia sẻ Blog này với:",
            url: urlShare
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
            } else {
            }
        } else if (result.action === Share.dismissedAction) {
        }
    } catch (error) {
        alert(error.message);
    }
}

//Hash
export function encodeToAscii(inputString) {
    return inputString.split("")
        .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");
}

export function decodeFromAscii(inputString) {
    return inputString.split(/(\w\w)/g)
        .filter(p => !!p)
        .map(c => String.fromCharCode(parseInt(c, 16)))
        .join("")
}

//Number
export function convertInputToFloat(inputValue, integerLength, surplusLength, inputType) {
    if (inputValue.indexOf(',') > -1) {
        let intValue = inputValue.substring(0, inputValue.indexOf(','));
        let surplus = inputValue.substring(inputValue.indexOf(',') + 1).replace(/\D/g, '');
        let value = intValue + "," + surplus;
        if (intValue.length > integerLength) {
            Toast.show({
                type: 'error',
                text1: 'Phần số nguyên không dài quá 3 số!',
                position: 'top'
            });
            return false;
        }
        if (surplus.length > surplusLength) {
            Toast.show({
                type: 'error',
                text1: 'Phần số dư không dài quá 2 số!',
                position: 'top'
            });
            return false;
        }
        return value;
    } else {
        let value = inputValue.replace(/\D/g, '');
        if (value.length > integerLength) {
            Toast.show({
                type: 'error',
                text1: (inputType) ? inputType + ' không dài quá 3 số!' : 'Số nhập không dài quá 3 số!',
                position: 'top'
            });
            return false;
        } else {
            return value;
        }
    }
}