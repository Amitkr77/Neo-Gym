import React, { useEffect, useState } from 'react';

const HeroSection = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 500);
  }, []);

  return (
   <section
  className="relative h-screen bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] flex items-center justify-center text-white"
  style={{ backgroundImage: 'url(/bgImage.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
>
  <div className="absolute inset-0 bg-black bg-opacity-40"></div>

  <div className={`relative z-10 text-center px-8 md:px-16 py-12 md:py-24 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 md:mb-8 tracking-wide">
      Get Stronger. Feel Better. Live Better.
    </h1>
    <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-80">
      Start your fitness journey today. Whether you’re looking to build muscle or improve your health, we have you covered.
    </p>
    {/* <button className="bg-white text-[#ff7e5f] py-4 px-12 rounded-full text-xl font-semibold transition transform duration-300 hover:scale-110 hover:bg-[#ff7e5f] hover:text-white hover:shadow-lg">
      Join Now
    </button> */}
  </div>
</section>

  );
};

export default HeroSection;
