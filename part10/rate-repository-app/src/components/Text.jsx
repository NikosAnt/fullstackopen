import { Text as NativeText, Platform, StyleSheet } from 'react-native'

import theme from '../theme'

const styles = StyleSheet.create({
  text: {
    color: theme.colors.primary,
    fontSize: theme.fontSizes.body,
    fontFamily: Platform.select({
      android: theme.fonts.android,
      ios: theme.fonts.ios,
      default: theme.fonts.main
    }),
    fontWeight: theme.fontWeights.normal
  },
  secondary: {
    color: theme.colors.white
  },
  fontSizeHeading: {
    fontSize: theme.fontSizes.heading
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold
  }
})

const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  const textStyle = [
    styles.text,
    color === 'secondary' && styles.secondary,
    fontSize === 'heading' && styles.fontSizeHeading,
    fontSize === 'subheading' && styles.fontSizeSubheading,
    fontWeight === 'bold' && styles.fontWeightBold,
    style
  ]

  return <NativeText style={textStyle} {...props} />
}

export default Text
