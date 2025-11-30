import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE':
      return `Anecdote '${action.payload}' created`
    case 'VOTE':
      return `Anecdote '${action.payload}' voted`
    case 'ERROR':
      return action.payload
    default:
      return '' // will this be an error
  }
}

const notificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    '',
  )

  return (
    <notificationContext.Provider
      value={{ notification, notificationDispatch }}
    >
      {props.children}
    </notificationContext.Provider>
  )
}

export default notificationContext
