import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      const anecdote = action.payload
      state.push(anecdote)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      const idx = state.findIndex((a) => a.id === updated.id)
      if (idx !== -1) {
        state[idx] = updated
      }
    },
  },
})

export const { appendAnecdote, setAnecdotes, updateAnecdote } =
  anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const state = getState()
    const current = state.anecdote.find((a) => a.id === id)
    if (!current) return
    const toSave = { ...current, votes: current.votes + 1 }
    const saved = await anecdoteService.update(toSave)
    dispatch(updateAnecdote(saved))
  }
}

export default anecdoteSlice.reducer
