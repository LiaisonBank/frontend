import React, { Component } from 'react'
import Image from "next/image";
import { clientImageName } from "@/lib/data/clientImageList";

export default class OurClients extends Component {
    render() {
        const getAosAnimation = (index) => {
            const animations = ["flip-left", "flip-up", "flip-down", "flip-right"];
            return {
                "data-aos": animations[index % animations.length],
                "data-aos-delay": index * 100,
                "data-aos-duration": 800,
                "data-aos-easing": "ease-out-cubic"
            };
        };
        return (
            <>
                {clientImageName.map((name, index) => (
                    <div className="client-item" key={index}
                        {...getAosAnimation(index)}>
                        <Image
                            src={`/clients/${name}.jpg`}
                            width={200}
                            height={200}
                            alt={name}
                            loading="lazy"
                        />
                    </div>
                ))}
            </>
        )
    }
}
