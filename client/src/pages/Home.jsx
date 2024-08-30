import React from 'react';
import Footer from '../components/Footer';
import ServicesSection from '../components/ServiceSection';
import HeroSection from '../components/HeroSection';

export default function Home() {
  return (
    <div className=''>
      <HeroSection />
      <ServicesSection />
      <Footer/>
    </div>
  );
}
