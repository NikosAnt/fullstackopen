import { View, FlatList, StyleSheet } from 'react-native'
import { format } from 'date-fns'

import theme from '../theme'
import Text from './Text'
import ItemSeparator from './ItemSeparator'

const styles = StyleSheet.create({
    reviewsContainer: {
        flex: theme.reviewsContainer.flex,
    },
    reviewsItem: {
        flexDirection: theme.reviewsItem.flexDirection,
        backgroundColor: theme.colors.white,
        padding: theme.reviewsItem.padding
    },
    reviewsItemRating: {
        width: theme.reviewsItemRating.size,
        height: theme.reviewsItemRating.size,
        borderRadius: theme.reviewsItemRating.borderRadius,
        borderColor: theme.colors.blue,
        borderWidth: theme.reviewsItemRating.borderWidth,
        padding: theme.reviewsItemRating.padding,
        textAlign: theme.reviewsItemRating.textAlign,
        textAlignVertical: theme.reviewsItemRating.textAlignVertical,
        justifyContent: theme.reviewsItemRating.justifyContent,
        alignItems: theme.reviewsItemRating.alignItems,
        lineHeight: theme.reviewsItemRating.lineHeight
    },
    reviewsItemRatingText: {
        color: theme.colors.blue
    },
    reviewsItemText: {
        paddingHorizontal: theme.reviewsItemText.paddingHorizontal,
        flex: theme.reviewsItemText.flex,
    },
    reviewsItemTextDate: {
        color: theme.colors.lightBlack,
        marginBottom: 10
    }
})

const ReviewList = ({ reviews }) => (
    <View style={styles.reviewsContainer}>
        <FlatList
            data={reviews}
            keyExtractor={item => item.id}
            ListFooterComponent={ItemSeparator}
            ItemSeparatorComponent={ItemSeparator}
            renderItem={({ item }) => (
                <View style={styles.reviewsItem}>
                    <View style={styles.reviewsItemRating}>
                        <Text style={styles.reviewsItemRatingText} fontSize="heading">{item.rating}</Text>
                    </View>
                    <View style={styles.reviewsItemText}>
                        <Text fontWeight="bold">{item.user?.username || 'Anonymous'}</Text>
                        <Text style={styles.reviewsItemTextDate}>{format(new Date(item.createdAt), 'MM-dd-yyyy')}</Text>
                        <Text>{item.text}</Text>
                    </View>
                </View>
            )}
            inverted
        />
    </View>
)

export default ReviewList