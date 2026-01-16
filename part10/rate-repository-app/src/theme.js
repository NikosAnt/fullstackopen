import Constants from 'expo-constants'

const theme = {
  appBar: {
    paddingTop: Constants.statusBarHeight + 20,
    height: 40,
    paddingHorizontal: 10
  },
  button: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center'
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 15,
  },
  colors: {
    appBarBackground: '#24292e',
    primary: '#586069',
    container: '#e1e4e8',
    white: '#fff',
    blue: '#0366d6',
    lightBlack: '#888',
    grey: '#ccc',
    error: '#d73a4a'
  },
  container: {
    flex: 1,
  },
  description: {
    marginVertical: 5
  },
  fontSizes: {
    body: 16,
    heading: 20,
    subheading: 18
  },
  fonts: {
    main: 'System',
    android: 'Roboto',
    ios: 'Arial'
  },
  fontWeights: {
    normal: '400',
    bold: '700'
  },
  formContainer: {
    padding: 16,
  },
  fullName: {
    marginVertical: 5
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 4,
    margin: 10
  },
  input: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 12
  },
  infoContainer: {
    paddingHorizontal: 10,
    flexShrink: 1
  },
  language: {
    padding: 5,
    alignSelf: 'flex-start',
    borderRadius: 4,
    marginVertical: 5
  },
  link: {
    marginRight: 15
  },
  reviewsItem: {
    flexDirection: 'row',
    padding: 15
  },
  reviewsContainer: {
    flex: 1,
  },
  reviewsItemRating: {
    size: 50,
    borderWidth: 2,
    padding: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 40
  },
  reviewsItemText: {
    paddingHorizontal: 15,
    flex: 1,
  },
  reviewsItemTextDate: {
    marginBottom: 10
  },
  separator: {
    height: 10
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  topContainer: {
    flexDirection: 'row'
  },
  viewContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1
  }
}

export default theme
