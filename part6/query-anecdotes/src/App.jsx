import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import { useNotification } from './useNotification'

const App = () => {
  const queryClient = useQueryClient()
  const [notification, notificationDispatch] = useNotification()
  const [filter, setFilter] = useState('')

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      notificationDispatch({
        type: 'SHOW',
        payload: `anecdote '${newAnecdote.content}' added`,
      })
      setTimeout(() => notificationDispatch({ type: 'HIDE' }), 5000)
    },
    onError: (error) => {
      notificationDispatch({
        type: 'SHOW',
        payload: error?.message,
      })
      setTimeout(() => notificationDispatch({ type: 'HIDE' }), 5000)
    },
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote,
        ),
      )
      notificationDispatch({
        type: 'SHOW',
        payload: `anecdote '${updatedAnecdote.content}' voted`,
      })
      setTimeout(() => notificationDispatch({ type: 'HIDE' }), 5000)
    },
  })

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.addAnecdote.value
    event.target.addAnecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  const voteAnecdote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: false,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  } else if (result.isError) {
    return <div>acecdote service not available to problems in server</div>
  }

  const anecdotes = result.data || []

  return (
    <>
      <h1>Anecdote app</h1>
      {notification && <div className="notification">{notification}</div>}
      <h2>filter anecdotes</h2>
      <input
        id="filterAnecdotes"
        name="filterAnecdotes"
        type="text"
        aria-label="Filter Anecdotes"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input
          id="addAnecdote"
          name="addAnecdote"
          type="text"
          aria-label="Create New Anecdote"
        />
        <button type="submit">create</button>
      </form>
      <ul className="anecdotes">
        {[...anecdotes]
          .filter((anecdote) =>
            anecdote.content.toLowerCase().includes(filter.toLowerCase()),
          )
          .sort((a, b) => b.votes - a.votes)
          .map((anecdote) => (
            <li key={anecdote.id}>
              {anecdote.content} has {anecdote.votes}{' '}
              <button onClick={() => voteAnecdote(anecdote)}>vote</button>
            </li>
          ))}
      </ul>
    </>
  )
}

export default App
