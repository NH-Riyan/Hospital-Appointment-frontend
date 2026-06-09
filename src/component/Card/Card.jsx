import React from 'react'
import CountUp from 'react-countup';

export const Card = ({ title, value , icon: Icon }) => {
  return (
    <div className=" w-6 h-44 bg-base-300 shadow-xl rounded-4xl px-6 py-12 text-center">
    
     <div className="flex justify-center gap-2 items-center">    
        {Icon && <Icon className="text-3xl text-primary" />}
        <h2 className="text-xl font-semibold">{title}</h2>  
     </div>
      
      <p className="text-4xl font-bold text-center">
        <CountUp 
          end={value} 
          duration={2.5} 
          enableScrollSpy={true}
          //scrollSpyOnce={true}
        />+
      </p>

    </div>
  );
}
