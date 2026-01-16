import { createSlice } from '@reduxjs/toolkit'

let notificationTimeoutId

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return ''
    },
  },
})

export const showNotification =
  (message, seconds = 5) =>
  (dispatch) => {
    dispatch(setNotification(message))
    if (notificationTimeoutId) {
      clearTimeout(notificationTimeoutId)
    }
    notificationTimeoutId = setTimeout(() => {
      dispatch(clearNotification())
      notificationTimeoutId = undefined
    }, seconds * 1000)
  }

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
