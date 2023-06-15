import React from 'react'

const MyApps = ({apps}) => {
  return (
    <div>
        <p>{JSON.stringify(apps)}</p>
    </div>
  )
}

export default MyApps