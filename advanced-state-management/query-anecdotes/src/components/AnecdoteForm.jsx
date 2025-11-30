import React from 'react'
import { useContext } from 'react'
import notificationContext from '../NotificationContext'

const AnecdoteForm = ({ newAnecdoteMutation }) => {
  const { notificationDispatch } = useContext(notificationContext)

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content: content, votes: 0 })
    console.log('new anecdote')
    notificationDispatch({ type: 'CREATE', payload: content })
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
