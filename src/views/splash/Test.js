import React, { useState } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import styles, { darkBlue } from '../../styles/all.style';
import { Image } from 'react-native-animatable';
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import * as nsfwjs from 'nsfwjs'

const Test = () => {
    const [srcImage, setsrcImage] = useState({ uri: '' })

    async function onImagePicked() {
        try {
            var response = await openPicker({
                mediaType: 'image',
                selectedAssets: 'Images',
                doneTitle: 'Xong',
                // isCrop: true,
                // isCropCircle: true,
                singleSelectedMode: true

            });
            console.log(response);
            if (response.crop) {
                let cropPath = "file://" + response.crop.path;
                response.crop.path = cropPath;
                response.crop.fileName = response.fileName;
                // setpickedImage(response.crop);
                setsrcImage({ uri: cropPath });
            } else {
                // setpickedImage(response);
                setsrcImage({ uri: "file://" + response.realPath });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <Image source={srcImage} style={{ width: '100%', aspectRatio: 1, borderRadius: 25 }} />
            <View style={[styles.flexRow, styles.justifyCenter, { width: '100%', marginTop: 25 }]}>
                <TouchableOpacity onPress={onImagePicked}
                style={{ padding: 5, borderWidth: 3, borderColor: darkBlue, borderRadius: 5 }}>
                    <MaterialCommunityIcons name='camera-enhance-outline' size={55} color={darkBlue} />
                </TouchableOpacity>
            </View>
        </View>
    );
}


export default Test;