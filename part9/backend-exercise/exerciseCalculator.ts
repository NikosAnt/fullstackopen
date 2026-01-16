const validateInputs = (hours: Array<number>, target: number) => {
  if (Number.isNaN(target)) {
    throw new TypeError('Target must be a valid number')
  }
  for (const hour of hours) {
    if (Number.isNaN(hour)) {
      throw new TypeError('All hours must be valid numbers')
    }
  }
}

interface ExerciseResult {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  averageTime: number
}

const rating = (
  periodLength: number,
  trainingDays: number,
  averageTime: number
): number => {
  let rating = 0
  if (trainingDays >= 3) rating += 1
  if (averageTime >= 2) rating += 1
  if (periodLength >= 7) rating += 1
  return rating
}

const ratingDescription = (rating: number) => {
  switch (rating) {
    case 3:
      return 'excellent'
    case 2:
      return 'not too bad but could be better'
    case 1:
      return 'bad'
    default:
      return 'terrible'
  }
}

export const calculateExercises = (
  hours: Array<number>,
  target: number
): ExerciseResult => {
  validateInputs(hours, target)
  const periodLength = hours.length
  const trainingDays = hours.reduce((acc, day) => acc + (day > 0 ? 1 : 0), 0)
  const totalHours = hours.reduce((acc, day) => acc + day, 0)
  const averageTime = periodLength > 0 ? totalHours / periodLength : 0
  const userRating = rating(periodLength, trainingDays, averageTime)
  const userDescription = ratingDescription(userRating)

  return {
    periodLength: periodLength,
    trainingDays: trainingDays,
    success: averageTime > target,
    rating: userRating,
    ratingDescription: userDescription,
    target: target,
    averageTime: averageTime
  }
}

try {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    throw new Error('Please provide at least one hour value and a target')
  }

  const target = Number(args.at(-1))
  const hours = args.slice(0, -1).map(Number)

  console.log(calculateExercises(hours, target))
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message)
  } else {
    console.error('Unknown error occurred')
  }
}
