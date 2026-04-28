"use client";

import { useState } from "react";
import ServiceList from "@/components/ServicesSection/ServiceList";
import ServiceContent from "@/components/ServicesSection/ServiceContent";

export default function ServicesSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <>
           <div data-aos="fade-right" data-aos-duration="600" data-aos-delay="100">
                <ServiceList
                    activeIndex={activeIndex}
                    onChange={setActiveIndex}
                />
            </div>

            <div>
                <ServiceContent activeIndex={activeIndex} />
            </div>
        </>
    );
}