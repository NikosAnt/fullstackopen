import { View, StyleSheet, ActivityIndicator, Linking } from 'react-native'
import { useParams } from 'react-router-native'

import useRepository from '../hooks/useRepository'
import useReviews from '../hooks/useReviews'
import theme from '../theme'
import Text from './Text'
import FancyButton from './FancyButton'
import RepositoryItem from './RepositoryItem'
import ReviewList from './ReviewList'

const styles = StyleSheet.create({
    viewContainer: {
        flex: theme.viewContainer.flex,
        flexDirection: theme.viewContainer.flexDirection,
        justifyContent: theme.viewContainer.justifyContent,
    },
    buttonContainer: {
        paddingHorizontal: theme.buttonContainer.paddingHorizontal,
        paddingTop: theme.buttonContainer.paddingTop,
        paddingBottom: theme.buttonContainer.paddingBottom,
        backgroundColor: theme.colors.white,
    },
})

const RepositoryView = () => {
    const { id } = useParams()
    const { repository, loading: repositoryLoading, error: repositoryError } = useRepository(id)
    const { reviews, loading: reviewsLoading, error: reviewsError } = useReviews(id)

    if (repositoryLoading) return <ActivityIndicator />
    if (repositoryError) return (
        <View>
            <Text>Error loading repository</Text>
        </View>
    )
    if (!repository) return null

    const handleOpenInGithub = async () => {
        const url = repository.url
        if (!url) return

        try {
            const supported = await Linking.canOpenURL(url)
            if (supported) {
                await Linking.openURL(url)
            }
        } catch (e) {
            // no-op: avoid crashing on devices that can't open URLs
        }
    }

    return (
        <View style={styles.viewContainer}>
            <RepositoryItem repository={repository} />
            <View style={styles.buttonContainer}>
                <FancyButton onPress={handleOpenInGithub}>
                    Open in GitHub
                </FancyButton>
            </View>
            {reviewsLoading ? (
                <ActivityIndicator />
            ) : reviewsError ? (
                <View>
                    <Text>Error loading reviews</Text>
                </View>
            ) : (
                <ReviewList reviews={reviews} />
            )}
        </View>
    )
}

export default RepositoryView