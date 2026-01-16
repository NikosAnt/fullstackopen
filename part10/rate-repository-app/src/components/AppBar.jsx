import { useMemo } from 'react'
import { View, StyleSheet, ScrollView, Pressable } from 'react-native'
import { Link, useNavigate } from 'react-router-native'

import useMe from '../hooks/useMe'
import useSignOut from '../hooks/useSignOut'

import theme from '../theme'
import Text from './Text'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.appBarBackground,
    paddingTop: theme.appBar.paddingTop,
    height: theme.appBar.height + theme.appBar.paddingTop,
    paddingHorizontal: theme.appBar.paddingHorizontal
  },
  link: {
    marginRight: theme.link.marginRight
  }
})

const AppBar = () => {
  const navigate = useNavigate()
  const { me } = useMe()
  const { signOut } = useSignOut()

  const signedIn = useMemo(() => !!me, [me])

  const handleSignOut = async () => {
    await signOut()
    navigate('/signin')
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <Link to="/" style={styles.link}>
          <Text fontSize="subHeading" color="secondary" fontWeight="bold">
            Repositories
          </Text>
        </Link>
        {signedIn ? (
          <Pressable onPress={handleSignOut} style={styles.link}>
            <Text fontSize="subHeading" color="secondary" fontWeight="bold">
              Sign Out
            </Text>
          </Pressable>
        ) : (
          <Link to="/signin">
            <Text fontSize="subHeading" color="secondary" fontWeight="bold">
              Sign in
            </Text>
          </Link>
        )}
      </ScrollView>
    </View>
  )
}

export default AppBar
