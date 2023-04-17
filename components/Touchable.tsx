import React, { ReactNode } from "react";
import {
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";

interface TouchableButtonProps {
  onPress: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const TouchableButton: React.FC<TouchableButtonProps> = ({
  onPress,
  children,
  style,
}) => {
  // if (Platform.OS === "android") {
  //   return (
  //     <TouchableNativeFeedback
  //       onPress={onPress}
  //       background={TouchableNativeFeedback.Ripple("#e9e9e9", true)}
  //     >
  //       <View style={style}>{children}</View>
  //     </TouchableNativeFeedback>
  //   );
  // } else {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        <View style={style}>{children}</View>
      </TouchableOpacity>
    );
  }
// };

export default TouchableButton;
