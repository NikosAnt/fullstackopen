const reverse = string => {
  return string.split('').reverse().join('')
}

const average = array =>
  array.length === 0
    ? 0
    : array.reduce((acc, item) => acc + item) / array.length

export { reverse, average }
