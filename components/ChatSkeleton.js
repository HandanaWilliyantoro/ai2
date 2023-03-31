import React from 'react'

const ChatSkeleton = () => {
  return (
    <div role="status" className="w-full animate-pulse">
        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-4"></div>
        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w=full mb-2.5"></div>
        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w=full mb-2.5"></div>
        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w=full mb-2.5"></div>
        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w=full"></div>
        <span className="sr-only">Loading...</span>
    </div>
  )
}

export default ChatSkeleton