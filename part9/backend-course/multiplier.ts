interface MultiplyValues {
  value1: number
  value2: number
}

const parseArguments = (args: Array<string>): MultiplyValues => {
  switch (true) {
    case args.length < 4:
      throw new Error('Not enough arguments')
    case args.length > 4:
      throw new Error('Too many arguments')
    case Number.isNaN(args[2]) || Number.isNaN(args[3]):
      throw new Error('Provided values were not numbers!')
    default:
      return {
        value1: Number(args[2]),
        value2: Number(args[3])
      }
  }
}

const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText, a * b)
}

try {
  const { value1, value2 } = parseArguments(process.argv)
  multiplicator(
    value1,
    value2,
    `Multiplied ${value1} and ${value2}, the result is:`
  )
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message
  }
  console.log(errorMessage)
}
