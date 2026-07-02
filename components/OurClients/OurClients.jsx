import React, { Component } from "react";
import Image from "next/image";
import { clientImageName } from "@/lib/data/clientImageList";

export default class OurClients extends Component {
  render() {
    return (
      <>
        {clientImageName.map((name, index) => (
          <div className="client-item" key={index}>
            <Image
              src={`/clients/${name}.webp`}
              width={200}
              height={200}
              alt={name}
              loading="lazy"
            />
          </div>
        ))}
      </>
    );
  }
}