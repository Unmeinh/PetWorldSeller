import React from "react";
import LottieView from "lottie-react-native";

const LottieAnimation = ({ fileJson, isLoop, isAutoPlay, style }) => {
    const options = {
        animationData: fileJson,
        loop: isLoop
    };

    return <>
        <LottieView source={fileJson} autoPlay={isAutoPlay} loop={isLoop} style={style} />
    </>;
};

export default LottieAnimation;