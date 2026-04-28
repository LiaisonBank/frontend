// components/MyMarqueeComponent.jsx or app/page.tsx
'use client'; // This component uses client-side features
import React from 'react';
import Marquee from 'react-fast-marquee';

const NewLaunch = () => {
  return (
    <Marquee pauseOnHover={true} speed={50}>
      <span>&nbsp;Unit No.3 Entire 3rd floor Lok Bhavan, Lok Bharti Complex, Lok Bharti Road, Off Marol Maroshi Road Marol Andheri (East), Mumbai - 400059. </span>
    </Marquee>
  );
};

export default NewLaunch;
