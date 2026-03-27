import React from 'react'
import banner from '../../assets/banner.jpg'
const Banner = () => {
  return (
    <div className='w-9/12 mx-auto my-10'>
      <img className='rounded-4xl' src={banner} alt="Banner" />
    </div>
  )
}

export default Banner