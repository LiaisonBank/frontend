'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import ImageWave from '@/components/ImageWave';
// import HeroWave from '@/components/HeroWave';

const slides = [
  {
    id: 1,
    title: 'We Build Smart Solutions',
    desc: 'Modern digital experiences for your business growth.',
    img: '/images/Alishaikh_png.png',
  },
  {
    id: 2,
    title: 'Creative & Innovative',
    desc: 'Design-driven development for better UX.',
    img: '/images/Ayesha_amc.webp',
  },
  {
    id: 3,
    title: 'Future Ready Technology',
    desc: 'Scalable and high-performance applications.',
    img: '/images/kalpita_liaisoning.png',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Touch Support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
  };

  return (
    <section className="hero" aria-label="Homepage Hero">
      <div className="hero-container">
        
        {/* TEXT */}
        <div className="hero-text d-none">
          <h1>{slides[current].title}</h1>
          <p>{slides[current].desc}</p>
          <button className="hero-cta">Get Started</button>
        </div>

        {/* IMAGE */}
        <div
          className="hero-imageArea"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
           <div className="img-bg-shape top-0 w-1/1 h-full">
            <ImageWave />
              {/* <HeroWave /> */}
           </div>
            {/* SHAPE (ONLY ONCE) */}
            {/* <div className="img-bg-shape" aria-hidden="true"> */}
                {/* <ImageWave /> */}
                {/* <HeroWave /> */}
            {/* </div> */}
            {slides.map((slide, index) => (
                <div
                key={slide.id}
                className={`hero-slide ${index === current ? 'active' : ''}`}
                >
                <Image
                    src={slide.img}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    className="hero-image"
                />
                </div>
            ))}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="slider-nav">
      <button className="hero-nav hero-prev d-none d-sm-block d-md-none d-lg-block" onClick={prevSlide}>
        ‹
      </button>
      <button className="hero-nav hero-next d-none d-sm-block d-md-none d-lg-block" onClick={nextSlide}>
        ›
      </button>
      </div>

      {/* DOTS */}
      <div className="hero-dots d-none d-sm-block d-md-none">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
}