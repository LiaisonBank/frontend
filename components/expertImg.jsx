'use client';

import Image from 'next/image';
import bannerImg from '@/assets/images/expert.jpg';

export default function HeroImage() {
  return (
    <Image
      src={bannerImg}
      alt="Hero image"
      width={1200}
      height={600}
      sizes="(max-width: 500px) 100vw, (max-width: 1800px) 100vw, 1800px"
      className="attachment-full size-full"
      priority
    />
  );
}
