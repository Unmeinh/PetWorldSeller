import Moment from 'moment';
import "moment/locale/vi";
import Toast from 'react-native-toast-message';
import { axiosJSON } from '../api/axios.config';
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

//OTP
export async function onSendOTPbyPhoneNumber(phone) {
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
}

export async function onSendOTPbyEmail(email) {
    Toast.show({
        type: 'loading',
        position: 'top',
        text1: "Đang gửi mã xác minh...",
        bottomOffset: 20,
        autoHide: false
    });
    var response = await axiosJSON.post('user/sendResetPasswordEmail', { email: email })
        .catch((e) => {
            Toast.show({
                type: 'error',
                position: 'top',
                text1: String(e.response.data.message),
                bottomOffset: 20
            });
            return false;
        });
    if (response != undefined) {
        if (response.status == 200) {
            var data = response.data;
            try {
                if (data.success) {
                    Toast.show({
                        type: 'success',
                        position: 'top',
                        text1: String(data.message),
                        bottomOffset: 20
                    });

                    return true;
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
            return false;
        }
    }
}

export async function onVerifyOTPbyEmail(email, otp) {
    var response = await axiosJSON.post('user/verifyResetPasswordCode', { email: email, otp: otp })
        .catch((e) => {
            // var data = response.data;
            Toast.show({
                type: 'error',
                position: 'top',
                text1: String(e.response.data.message),
                bottomOffset: 20
            });
            return false;
        });
    if (response != undefined) {
        if (response.status == 200) {
            var data = response.data;
            if (data.success) {
                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Thành công',
                    bottomOffset: 20
                });
                return true;
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
            return false;
        }
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
