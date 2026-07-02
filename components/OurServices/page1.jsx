import Image from 'next/image';
import Link from 'next/link';

const services = [
  { id: 1, title: 'Food & Beverages', img: '/service-images/F_B.jpg', slug: 'food-beverages' },
  { id: 2, title: 'Health Care', img: '/service-images/H_C.png', slug: 'health-care' },
  { id: 3, title: 'Industrial & Manufacturer', img: '/service-images/I_M.png', slug: 'industrial-manufacturer' },
  { id: 4, title: 'Real Estate', img: '/service-images/R_E.png', slug: 'real-estate' },
  { id: 5, title: 'Entertainment', img: '/service-images/entertainment.png', slug: 'entertainment' },
  { id: 6, title: 'Brihan Mumbai Municipal Corporation', img: '/service-images/bmc.png', slug: 'bmc' },
  { id: 7, title: 'Vasai Virar Municipal Corporation', img: '/service-images/vvmc.png', slug: 'vvmc' },
  { id: 8, title: 'Kalyan Dombivali Municipal Corporation', img: '/service-images/kdmc.png', slug: 'kdmc' },
  { id: 9, title: 'Thane Municipal Corporation', img: '/service-images/tmc.png', slug: 'thane-municipal-corporation' },
  { id: 10, title: 'MHADA and Slum Rehabilitation Authority', img: '/service-images/mhada_sra.png', slug: 'mhada-sra' },
];

const OurServices = () => {
  return (
    <div className="service-type grid-wrapper">
        <div className="grid-item service-card">
          <Link href="">
              <div className="image-wrapper">
                <Image src={services[0].img} alt={services[0].title} layout="fill" objectFit="cover" />
              </div>
              <h3>{services[0].title}</h3>
          </Link>
        </div>
        <div className="grid-item service-card">
          <Link href="">
              <div className="image-wrapper">
                <Image src={services[1].img} alt={services[1].title} layout="fill" objectFit="cover" />
              </div>
              <h3>{services[1].title}</h3>
          </Link>
        </div>
        <div className="grid-item service-card">
          <Link href="">
              <div className="image-wrapper">
                <Image src={services[2].img} alt={services[2].title} layout="fill" objectFit="cover" />
              </div>
              <h3>{services[2].title}</h3>
          </Link>
        </div>
        <div className="grid-item service-card">
          <Link href="">
              <div className="image-wrapper">
                <Image src={services[3].img} alt={services[3].title} layout="fill" objectFit="cover" />
              </div>
              <h3>{services[3].title}</h3>
          </Link>
        </div>
        <div className="grid-item service-card">
          <Link href="">
              <div className="image-wrapper">
                <Image src={services[4].img} alt={services[4].title} layout="fill" objectFit="cover" />
              </div>
              <h3>{services[4].title}</h3>
          </Link>
        </div>
        <div className="grid-item service-card">
          <Link href="">
              <div className="image-wrapper">
                <Image src={services[5].img} alt={services[5].title} layout="fill" objectFit="cover" />
              </div>
              <h3>{services[5].title}</h3>
          </Link>
        </div>
        <div className="grid-item service-card">
          <Link href="">
              <div className="image-wrapper">
                <Image src={services[6].img} alt={services[6].title} layout="fill" objectFit="cover" />
              </div>
              <h3>{services[6].title}</h3>
          </Link>
        </div>
        <div className="grid-item service-card">
          <Link href="">
              <div className="image-wrapper">
                <Image src={services[7].img} alt={services[7].title} layout="fill" objectFit="cover" />
              </div>
              <h3>{services[7].title}</h3>
          </Link>
        </div>
        <div className="grid-item service-card">
          <Link href="">
              <div className="image-wrapper">
                <Image src={services[8].img} alt={services[8].title} layout="fill" objectFit="cover" />
              </div>
              <h3>{services[8].title}</h3>
          </Link>
        </div>
        <div className="grid-item service-card">
          <Link href="">
              <div className="image-wrapper">
                <Image src={services[9].img} alt={services[9].title} layout="fill" objectFit="cover" />
              </div>
              <h3>{services[9].title}</h3>
          </Link>
        </div>
    </div>
  );
};

export default OurServices;