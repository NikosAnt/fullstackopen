import { TextInput } from 'react-native'

import Text from './Text'
import theme from '../theme'

const FormikTextInput = ({ formik, name, ...props }) => (
  <>
    <TextInput
      {...props}
      style={[
        props.style,
        (formik.touched[name] || formik.submitCount > 0) &&
          formik.errors[name] && { borderColor: theme.colors.error }
      ]}
      value={formik.values[name]}
      onChangeText={formik.handleChange(name)}
      onBlur={formik.handleBlur(name)}
    />
    {(formik.touched[name] || formik.submitCount > 0) &&
      formik.errors[name] && (
        <Text style={{ color: theme.colors.error }}>{formik.errors[name]}</Text>
      )}
  </>
)

export default FormikTextInput
