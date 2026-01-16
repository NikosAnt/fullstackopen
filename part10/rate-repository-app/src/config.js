import Constants from 'expo-constants'

const getDevServerHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.hostUri

  if (!hostUri) {
    return null
  }

  // hostUri looks like "192.168.1.11:8081"
  return hostUri.split(':')[0]
}

const devHost = getDevServerHost()
const defaultApiBaseUrl = devHost ? `http://${devHost}` : 'http://localhost'

const stripPortFromUrl = urlString => {
  if (!urlString) {
    return urlString
  }

  // Prefer standards-based parsing when the input includes a scheme.
  if (urlString.includes('://')) {
    try {
      const parsed = new URL(urlString)
      return `${parsed.protocol}//${parsed.hostname}`
    } catch (e) {
      // fall through to string parsing
    }
  }

  // Handle common "host:port" (or "http://host:port" that failed to parse)
  // without pulling in extra dependencies.
  return urlString.replace(/:(\d+)(\/|$)/, '$2').replace(/\/$/, '')
}

export const API_BASE_URL = stripPortFromUrl(
  process.env.EXPO_PUBLIC_API_BASE_URL || defaultApiBaseUrl
)

// Helpful runtime debug: show what base URL the client will use.
// This will appear in the Metro/Expo logs and on-device JS console.
try {
  console.log('Resolved API_BASE_URL ->', API_BASE_URL)
} catch (e) {
  // ignore logging errors in constrained runtimes
}
