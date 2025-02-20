import Image from 'next/image'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-full w-full'>
        <Image src='/logo.png' width={500} height={500} alt='Logo' className='animate-pulse '/>
    </div>
  )
}

export default Loading