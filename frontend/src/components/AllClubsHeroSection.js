import axios from "axios";
import React, { useEffect, useState } from "react";
import ScrollAnimation from "react-animate-on-scroll";
import ClubCard from "./ClubCard";
import RoundedDiv from "./RoundedDiv";
import ZigZagLine from "./ZigZagLine";
function AllClubsHeroSection() {

  const [clubsData, setClubsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroimg, setheroimg] = useState();

   useEffect(() => {
     axios
       .get(`${process.env.REACT_APP_API_BASE_URL}/allclubs`)
       .then((response) => {
         setClubsData(response.data.club || []);
         setheroimg(response.data.homepage?.[0]?.clubheroimg || '');
         setLoading(false);
       })
       .catch((error) => {
         console.error("Error fetching clubs data:", error);
         setError("Failed to load clubs.");
         setLoading(false);
       });
   }, []); 
  return (
    <div className="overflow-x-hidden font-poppins bg-[#F5F5F5]">
      <div
        className="w-full h-[865px] bg-top bg-cover bg-no-repeat flex flex-col items-center justify-start pt-24 sm:pt-28 md:pt-40 lg:pt-48 gap-6 text-gray-200 z-1"
        style={{ backgroundImage:`url(${heroimg})`}}
      >
        <p className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-center text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          LOREM IPSUM
        </p>
        <p className="max-w-[900px] px-4 text-sm sm:text-base md:text-lg lg:text-2xl font-medium tracking-tight text-center text-white/90 leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
          Empowering athletes something something content.
        </p>
      </div>

      {loading ? (
        <p className="text-center py-10 text-xl">Loading clubs...</p>
      ) : error ? (
        <p className="text-center py-10 text-red-500">{error}</p>
      ) : (
        <RoundedDiv
          Element={() => (
            <div className="flex flex-col relative items-center">
              {clubsData.map((clubData, index) => (
                <ScrollAnimation
                  key={index}
                  animateIn="fadeInUp"
                  animateOut="fadeOutUp"
                  className="z-[1000]"
                >
                  <ClubCard index={index} clubData={clubData} />
                </ScrollAnimation>
              ))}
              <ZigZagLine className="top-[20vw] md:top-[10vw]" />
            </div>
          )}
          top="-100px"
          bg="#F5F5F5"
        />
      )}
    </div>
  );
}

export default AllClubsHeroSection;
