import React from 'react'
import { useContext } from 'react'
import notificationContext from '../NotificationContext'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const { notification } = useContext(notificationContext)

  if (!notification) return null

  return <div style={style}>{notification}</div>
}

export default Notification
