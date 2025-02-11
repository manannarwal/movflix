import React from 'react'
import TextPressure from "../animations/TextPressure";
const LiveTv = () => {
  return (
    <div className="bg-[#121212] ml-6 mr-[.5vw] h-230 mb-10 rounded-2xl">
      <div className="justify-center flex items-center pt-80 ml-20 mr-20 text-8xl"> 
        <TextPressure
          text="Coming Soon..."
          flex={true}
          alpha={true}
          stroke={false}
          width={true}
          weight={true}
          italic={false}
          textColor="#ffffff"
          strokeColor="#ff0000"
          minFontSize={32}
        />
      </div>
      <span >
        
      </span>
    </div>
  );
};

export default LiveTv