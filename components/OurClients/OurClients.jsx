"use client";

import React, { Component } from "react";
import { getImageUrl } from "@/lib/utils/getImagehelper";
import Image from "next/image";
import ApiError from "@/components/ApiError/ApiError"; // adjust path

const API_URL = `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/our-clients`;

export default class OurClients extends Component {
  state = {
    clients: [],
    loading: true,
    error: null,
    statusCode: null,
  };

  componentDidMount() {
    this.fetchClients();
  }

  fetchClients = async () => {
    this.setState({ loading: true, error: null, statusCode: null });

    try {
      const response = await fetch(API_URL);

      // Capture HTTP status for the error UI
      if (!response.ok) {
        this.setState({
          loading: false,
          error: `Request failed with status ${response.status}`,
          statusCode: `ERR · ${response.status}`,
        });
        this.props.onError?.(`HTTP ${response.status}`);
        return;
      }

      const result = await response.json();

      if (result?.success && Array.isArray(result.data)) {
        this.setState({
          clients: result.data,
          loading: false,
          error: null,
        });

        // Send count to parent
        this.props.onCountChange?.(result.data.length);
      } else {
        this.setState({
          loading: false,
          error: "Unexpected response from server",
          statusCode: "ERR · BAD DATA",
        });
        this.props.onError?.("Failed to load clients");
      }
    } catch (err) {
      console.error("Error fetching clients:", err);

      this.setState({
        loading: false,
        error: err?.message || "Something went wrong",
        statusCode: "ERR · NETWORK",
      });
      this.props.onError?.(err?.message || "Something went wrong");
    }
  };

  handleRetry = () => {
    this.fetchClients();
  };

  render() {
    const { clients, loading, error, statusCode } = this.state;

    /* ---------- Error state ---------- */
    if (error) {
      return (
        <ApiError
          title="Client Information Unavailable"
          message="We couldn't load our client list right now. Please try again in a moment."
          onRetry={this.handleRetry}
          statusCode={statusCode}
          statusTone="warning"
        />
      );
    }

    /* ---------- Loading state ---------- */
    if (loading) {
      return (
        <div className="client-loading" aria-live="polite">
          <span className="client-loading__spinner" aria-hidden="true" />
          <span className="client-loading__text">Loading clients…</span>
        </div>
      );
    }

    /* ---------- Empty state ---------- */
    if (clients.length === 0) {
      return (
        <div className="client-empty" aria-live="polite">
          <p>No clients to display yet.</p>
        </div>
      );
    }

    /* ---------- Success ---------- */
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