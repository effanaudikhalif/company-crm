import React from 'react'

function Loading() {

  return (
    <div className='h-[calc(100vh-4rem)] flex bg-gray-600 bg-opacity-50 m-auto justify-center'>
        <span className=" bg-gray-200 loading loading-spinner loading-lg"></span>
    </div>
  )
}

export default Loading