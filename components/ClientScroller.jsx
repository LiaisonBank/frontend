import Slider from 'react-infinite-logo-slider'
import Image from "next/image";
import { clientImageName } from "@/lib/data/clientImageList";

const ClientScroller = () => {
    // const loopClients = [...clientImageName, ...clientImageName];
    return (
        <div className="slider-container py-10 bg-white">
            <Slider
                width="250px"
                duration={100}
                pauseOnHover={true}
                blurBorders={false}
                blurBorderColor="#fff"
                direction="right"   // ✅ KEY CHANGE
            >
                {clientImageName.map((name, index) => (
                    <Slider.Slide key={index}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}>
                        <div className="client-image-wrapper">
                            <Image
                                src={`/clients/${name}.webp`}
                                width={175}
                                height={125}
                                alt={name}
                                loading="lazy"
                            />
                        </div>
                    </Slider.Slide>
                ))}
            </Slider>
        </div>
    );
};

export default ClientScroller;