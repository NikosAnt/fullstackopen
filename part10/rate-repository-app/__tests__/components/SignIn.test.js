import { render, fireEvent, waitFor } from '@testing-library/react-native'

import SignIn from '../../src/components/SignIn'

const mockSignIn = jest.fn()
jest.mock('../../src/hooks/useSignIn', () => () => ({
  signIn: mockSignIn
}))

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('calls on submit function with correct arguments when a valid form is submitted', async () => {
      const { getByPlaceholderText, getByText } = render(<SignIn />)

      fireEvent.changeText(getByPlaceholderText('Username'), 'kalle')
      fireEvent.changeText(getByPlaceholderText('Password'), 'password')
      fireEvent.press(getByText('Sign In'))

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledTimes(1)
        expect(mockSignIn).toHaveBeenCalledWith({
          username: 'kalle',
          password: 'password'
        })
      })
    })
  })
})
