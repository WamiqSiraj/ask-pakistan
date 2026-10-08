// src/pages/Home.jsx
import React from 'react';
import HeroSection from '../components/HeroSection';
import ServicesGrid from '../components/ServicesGrid';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ServicesGrid />
    </div>
  );
}