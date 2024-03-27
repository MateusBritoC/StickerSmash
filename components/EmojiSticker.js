import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export default function EmojiSticker({ imageSize, stickerSource }) {

    const scaleImage = useSharedValue(imageSize);

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onStart(() => {
            if (scaleImage.value !== imageSize * 2) {
                scaleImage.value = scaleImage.value * 2;
            }
        });

        const imageStyle = useAnimatedStyle(() => {
            return {
                width: withSpring(scaleImage.value),
                height: withSpring(scaleImage.value),
            };
        });
        
        const translatex = useSharedValue(0);
        const translatey = useSharedValue(0);

        const drag = Gesture.Pan()
            .onChange((event) => {
                translatex.value += event.changeX;
                translatey.value += event.changeY;
            });

            const containerStyle = useAnimatedStyle(() => {
                return {
                    transform: [
                        {
                            translateX: translatex.value,
                        },
                        {
                            translateY: translatey.value,
                        }
                    ],
                };
            });

    return (
        <GestureDetector gesture={drag}>
            <Animated.View style={[containerStyle, { top: -350 }]}>
                <GestureDetector gesture={doubleTap}>
                    <Animated.Image
                        source={stickerSource}
                        resizeMode="contain"
                        style={[imageStyle, { width: imageSize, height: imageSize}]}
                    />
                </GestureDetector>
            </Animated.View>
        </GestureDetector>
    );
}