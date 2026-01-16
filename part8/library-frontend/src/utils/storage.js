// Utility for removing user object from localStorage
export const removeUserFromStorage = () => {
    window.localStorage.removeItem('library-user')
}
// Utility for saving user object to localStorage
export const saveUserToStorage = user => {
    window.localStorage.setItem('library-user', JSON.stringify(user))
}

// Utility for reading user object from localStorage
export const getUserFromStorage = () => {
    const saved = window.localStorage.getItem('library-user')
    return saved ? JSON.parse(saved) : null
}
