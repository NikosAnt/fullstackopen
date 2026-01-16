export const calculateBmi = (height: number, weight: number): string => {
  const coefficient = weight / ((height * height) / 10000)
  switch (true) {
    case coefficient > 30:
      return 'Obese range'
    case coefficient > 25:
      return 'Overweight range'
    case coefficient > 18.5:
      return 'Normal range'
    default:
      return 'Underweight range'
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1])) {
  try {
    if (process.argv.length !== 4)
      throw new Error('Please provide height and weight as arguments')

    const height = Number(process.argv[2])
    const weight = Number(process.argv[3])

    if (Number.isNaN(height) || Number.isNaN(weight))
      throw new Error('Height and weight must be numbers')

    console.log(calculateBmi(height, weight))
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message)
    } else {
      console.error('Unknown error occurred')
    }
  }
}
