export type Operation = 'multiply' | 'add' | 'divide'
type Result = string | number

export const calculator = (a: number, b: number, op: Operation): Result =>
  ({
    multiply: a * b,
    add: a + b,
    divide: b === 0 ? 'cannot divide by zero' : a / b
  })[op] ?? 'not recognized operation type'

try {
  console.log('Result is', calculator(1, 5, 'divide'))
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  if (error instanceof Error) {
    errorMessage += error.message
  }
  console.log(errorMessage)
}
