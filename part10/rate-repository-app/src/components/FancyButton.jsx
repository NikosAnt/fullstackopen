import { Pressable, StyleSheet } from 'react-native'

import Text from './Text'
import theme from '../theme'

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.blue,
        padding: theme.button.padding,
        borderRadius: theme.button.borderRadius,
        alignItems: theme.button.alignItems,
    }
})

const FancyButton = ({ onPress, children }) => (
    <Pressable style={styles.button} onPress={onPress}>
        <Text fontWeight="bold" color="secondary">
            {children}
        </Text>
    </Pressable>
)

export default FancyButton