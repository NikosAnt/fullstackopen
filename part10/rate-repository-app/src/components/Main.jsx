import { StyleSheet, View } from 'react-native'
import { Route, Routes, Navigate } from 'react-router-native'

import theme from '../theme'
import AppBar from './AppBar'
import RepositoryListView from './RepositoryListView'
import RepositoryView from './RepositoryView'
import SignIn from './SignIn'

const styles = StyleSheet.create({
  container: {
    flex: theme.container.flex,
    backgroundColor: theme.colors.container,
  }
})

const Main = () => {
  return (
    <View style={styles.container}>
      <AppBar />
      <Routes>
        <Route path="/" element={<RepositoryListView />} />
        <Route path="/repository/:id" element={<RepositoryView />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </View>
  )
}

export default Main
