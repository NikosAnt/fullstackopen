const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  if (state === null || state === undefined) {
    throw new Error('State is null or undefined')
  }

  switch (action.type) {
    case 'GOOD':
      return { ...state, good: state.good + 1 }
    case 'OK':
      return { ...state, ok: state.ok + 1 }
    case 'BAD':
      return { ...state, bad: state.bad + 1 }
    case 'ZERO':
      return initialState
    default:
      if (action.type === undefined) {
        throw new Error('Action type is undefined')
      }
      return state
  }
}

export default counterReducer