import React from 'react'
import { FaRegUserCircle } from 'react-icons/fa';

const Reviews = () => {

    const reviews = [
    {
      id: 1,
      name: "Rahim",
      review: "Very good service. Doctors are friendly.",
    },
    {
      id: 2,
      name: "Karim",
      review: "Nice environment and helpful staff.",
    },
    {
      id: 3,
      name: "Nusrat",
      review: "I am satisfied with the treatment.",
    },
  ];
  return (
    <div className='my-7'>
        <h3 className='text-center text-3xl text-gray-600 my-7'>Reviews About Us</h3>
        
        <div className="grid px-10 grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.id} className="bg-base-200 shadow-md p-5 rounded-xl">
              
             
              <div className="flex items-center gap-3 mb-3">
                <FaRegUserCircle className="text-3xl text-primary" />
                <h3 className="font-semibold">{r.name}</h3>
              </div>

             
              <p className="text-sm text-gray-600">
                {r.review}
              </p>

            </div>
          ))}
        </div>
        </div>
      
  )
}

export default Reviews