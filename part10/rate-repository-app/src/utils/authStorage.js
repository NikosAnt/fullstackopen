import AsyncStorage from '@react-native-async-storage/async-storage'
const ACCESS_TOKEN_KEY = 'accessToken'

class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace
  }

  _getKey(key) {
    return `${this.namespace}:${key}`
  }

  async getAccessToken() {
    return await AsyncStorage.getItem(this._getKey(ACCESS_TOKEN_KEY))
  }

  async setAccessToken(accessToken) {
    await AsyncStorage.setItem(this._getKey(ACCESS_TOKEN_KEY), accessToken)
  }

  async removeAccessToken() {
    await AsyncStorage.removeItem(this._getKey(ACCESS_TOKEN_KEY))
  }
}

export default AuthStorage
