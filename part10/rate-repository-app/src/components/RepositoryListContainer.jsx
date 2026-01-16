import { FlatList, Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'

import ItemSeparator from './ItemSeparator'
import RepositoryItem from './RepositoryItem'

export const RepositoryListContainer = ({ repositories }) => {
    const navigate = useNavigate()
    const repositoryNodes = repositories
        ? repositories.edges.map(edge => edge.node)
        : []

    const handlePress = id => {
        navigate(`/repository/${id}`)
    }

    const renderItem = ({ item }) => (
        <Pressable onPress={() => handlePress(item.id)}>
            <RepositoryItem repository={item} />
        </Pressable>
    )

    return (
        <FlatList
            data={repositoryNodes}
            ItemSeparatorComponent={ItemSeparator}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
    )
}

export default RepositoryListContainer
