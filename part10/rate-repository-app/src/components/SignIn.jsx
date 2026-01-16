import { View, StyleSheet } from 'react-native'
import { useNavigate } from 'react-router-native'
import * as yup from 'yup'
import { useFormik } from 'formik'

import FancyButton from './FancyButton'
import theme from '../theme'
import FormikTextInput from './FormikTextInput'
import useSignIn from '../hooks/useSignIn'

const styles = StyleSheet.create({
  formContainer: {
    padding: theme.formContainer.padding,
    backgroundColor: theme.colors.white
  },
  input: {
    borderStyle: theme.input.borderStyle,
    borderWidth: theme.input.borderWidth,
    borderColor: theme.colors.grey,
    borderRadius: theme.input.borderRadius,
    padding: theme.input.padding,
    marginBottom: theme.input.marginBottom
  }
})

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .required('Username is required'),
  password: yup
    .string()
    .min(3, 'Password must be at lest 3 characters long')
    .required('Password is required')
})

const SignIn = () => {
  const navigate = useNavigate()
  const { signIn } = useSignIn()

  const initialValues = {
    username: '',
    password: ''
  }

  const onSubmit = async values => {
    await signIn(values)
    navigate('/')
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit
  })

  return (
    <View style={styles.formContainer}>
      <FormikTextInput
        formik={formik}
        name="username"
        placeholder="Username"
        style={styles.input}
      />
      <FormikTextInput
        formik={formik}
        name="password"
        placeholder="Password"
        style={styles.input}
      />
      <FancyButton onPress={formik.handleSubmit}>
        Sign In
      </FancyButton>
    </View>
  )
}

export default SignIn
