import { View, StyleSheet } from 'react-native'

import theme from '../theme'

const styles = StyleSheet.create({
    separator: {
        height: theme.separator.height,
    }
})

const ItemSeparator = () => <View style={styles.separator} />

export default ItemSeparator