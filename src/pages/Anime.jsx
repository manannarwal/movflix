import React from "react";
import TextPressure from "../animations/TextPressure";

const Anime = () => {
  return (
    <div className="bg-[#121212] ml-6 mr-[.5vw] h-229 rounded-2xl max-md:-ml-10 max-md:mr-3 max-md:h-186">
      <div className="justify-center flex items-center pt-80 ml-20 mr-20"> 
        <TextPressure
          text="Coming Soon..."
          flex={true}
          alpha={true}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="#ffffff"
          strokeColor="#ff0000"
          minFontSize={32}
        />
      </div>
    </div>
  );
};

export default Anime;
