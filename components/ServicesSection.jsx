"use client";

import { useState } from "react";
import ServiceList from "@/components/ServicesSection/ServiceList";
import ServiceContent from "@/components/ServicesSection/ServiceContent";

export default function ServicesSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <>
           <div className="services-wrapper">
                <ServiceList
                    activeIndex={activeIndex}
                    onChange={setActiveIndex}
                />
            </div>

            <div className="services-right d-none d-xl-block">
                <ServiceContent activeIndex={activeIndex} />
            </div>
        </>
    );
}