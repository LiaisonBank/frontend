// import Image from "next/image";
import ImageWave from '@/components/ImageWave';
import ExpertImg from '@/components/expertImg';
import { services } from "@/lib/data/servicesData";

export default function ServiceContent({ activeIndex }) {
    const service = services[activeIndex];
    return (
        <div className="service-content-panel">
            {/* <div key={activeIndex} className="content-animate"> */}
                <div className="content-box">
                     {Array.isArray(service.content) ? (
                        service.content.map((para, i) => (
                            <p key={i} className="mb-3">{para}</p>
                        ))
                        ) : (
                            <p>{service.content}</p>
                    )}
                </div>
            {/* </div> */}
        </div>
    );
}