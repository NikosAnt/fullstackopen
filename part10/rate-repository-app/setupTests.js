import '@testing-library/jest-native/extend-expect'

// Silence Expo warning during Jest runs (expo-modules-core expects this).
if (!process.env.EXPO_OS) {
    process.env.EXPO_OS = 'ios'
}

jest.mock('expo-constants', () => ({
    __esModule: true,
    default: {
        statusBarHeight: 0
    }
}))

jest.mock('react-router-native', () => ({
    useNavigate: () => jest.fn(),
}))
