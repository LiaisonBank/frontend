"use client";

import React, { Component } from "react";
import { getImageUrl } from "@/lib/utils/getImagehelper";
import Image from "next/image";

const API_URL = `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/our-clients`;

export default class OurClients extends Component {
  state = {
    clients: [],
  };

  async componentDidMount() {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (result.success) {
        this.setState({ clients: result.data });

        // ✅ Send count to parent
        this.props.onCountChange?.(result.data.length);
      } else {
        this.props.onError?.("Failed to load clients");
      }

      console.log("api", result.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      // ✅ Send error to parent
      this.props.onError?.(error.message || "Something went wrong");
    }
  }

  render() {
    const { clients } = this.state;

    return (
      <>
        {clients.map((client) => (
          <div className="client-item" key={client.id}>
            <Image
              src={getImageUrl(client.logo)}
              width={200}
              height={200}
              alt={client.name || "Client"}
              loading="lazy"
              unoptimized
            />
          </div>
        ))}
      </>
    );
  }
}