import Image from 'next/image';
import Link from 'next/link';

const services = [
  { id: 1, title: 'AMC', img: '/service-images/amc.png', slug: 'amc' },
  { id: 2, title: 'Electrical (SFITC)', img: '/service-images/electrical.png', slug: 'electrical-sfitc' },
  { id: 3, title: 'Equipment Solution Department (ESD)', img: '/service-images/esd.png', slug: 'esd' },
  { id: 4, title: 'Fire (SFITC)', img: '/service-images/fire_sfitc.png', slug: 'fire-sfitc' },
  { id: 5, title: 'PNG ( SFITC )', img: '/service-images/png_sfitc.png', slug: 'png-sfitc' },
  { id: 6, title: 'License and Liaisoning', img: '/service-images/license_Liaisoning.png', slug: 'license-liaisoning' },
];

const OurServices = () => {
  return (
    <div className="service-type grid-wrapper">
      <div className="grid-item">Item 1</div>
      <div className="grid-item">Item 2</div>
      <div className="grid-item">Item 3</div>
      <div className="grid-item">Item 4</div>
      <div className="grid-item">Item 5</div>
      <div className="grid-item">Item 6</div>
        {/* {services.map((service) => (
          <Link href={`/services/${service.slug}`} key={service.id} className="service-card">
            <div className="image-wrapper">
              <Image 
                src={service.img} 
                alt={service.title}
                fill // Fills the container, better for grid layouts
                className="service-img"
              />
            </div>
            <div className="content-overlay">
              <h3>{service.title}</h3>
               <span className="learn-more">View Details →</span> 
            </div>
          </Link>
        ))} */}
    </div>
  );
};

export default OurServices;