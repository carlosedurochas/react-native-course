import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { styles } from "./styles";

import { Text } from "react-native"; // Import the Text component

type Props = TouchableOpacityProps & {
  title: string;
}

export function Button({ title, ...rest}: Props) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Text style={styles.title}> {/* Use the Text component */}
        {title}
      </Text>
    </TouchableOpacity>
  )
}