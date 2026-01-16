const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

export default { info, error }
