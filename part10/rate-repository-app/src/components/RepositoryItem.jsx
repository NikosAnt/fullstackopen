import { View, StyleSheet, Image } from 'react-native'

import theme from '../theme'
import Text from './Text'

function formatCount(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  }
  return count.toString()
}

const RespositoryItem = ({ repository }) => {
  const styles = StyleSheet.create({
    itemContainer: {
      backgroundColor: theme.colors.white
    },
    topContainer: {
      flexDirection: theme.topContainer.flexDirection
    },
    infoContainer: {
      paddingHorizontal: theme.infoContainer.paddingHorizontal,
      flexShrink: theme.infoContainer.flexShrink,
    },
    statsContainer: {
      flexDirection: theme.statsContainer.flexDirection,
      justifyContent: theme.statsContainer.justifyContent,
      marginVertical: theme.statsContainer.marginVertical
    },
    statItem: {
      flex: theme.statItem.flex,
      alignItems: theme.statItem.alignItems,
    },
    fullName: {
      marginVertical: theme.fullName.marginVertical
    },
    description: {
      marginVertical: theme.description.marginVertical
    },
    language: {
      backgroundColor: theme.colors.blue,
      padding: theme.language.padding,
      alignSelf: theme.language.alignSelf,
      borderRadius: theme.language.borderRadius,
      marginVertical: theme.language.marginVertical
    },
    image: {
      height: theme.image.height,
      width: theme.image.width,
      borderRadius: theme.image.borderRadius,
      margin: theme.image.margin
    }
  })

  return (
    <View testID="repositoryItem" style={styles.itemContainer}>
      <View style={styles.topContainer}>
        <Image
          style={styles.image}
          source={{ uri: repository.ownerAvatarUrl }}
        />
        <View style={styles.infoContainer}>
          <Text fontSize="heading" fontWeight="bold" style={styles.fullName}>
            {repository.fullName}
          </Text>
          <Text fontSize="subheading" style={styles.description}>
            {repository.description}
          </Text>
          <View style={styles.language}>
            <Text fontSize="subheading" color="secondary">
              {repository.language}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text fontWeight="bold">
            {formatCount(repository.stargazersCount)}
          </Text>
          <Text>Stars</Text>
        </View>
        <View style={styles.statItem}>
          <Text fontWeight="bold">{formatCount(repository.forksCount)}</Text>
          <Text>Forks</Text>
        </View>
        <View style={styles.statItem}>
          <Text fontWeight="bold">{formatCount(repository.reviewCount)}</Text>
          <Text>Reviews</Text>
        </View>
        <View style={styles.statItem}>
          <Text fontWeight="bold">{formatCount(repository.ratingAverage)}</Text>
          <Text>Rating</Text>
        </View>
      </View>
    </View>
  )
}

export default RespositoryItem
