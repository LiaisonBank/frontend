
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils/getImagehelper";
import "./ClientScroller.scss";

const ClientScroller = () => {
  const pathname = usePathname();

  const [clients, setClients] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchClients = async () => {
      try {
        setLoaded(false);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/our-clients/foraccess`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setClients(result.data.slice(0, 45));
        } else {
          setClients([]);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Client fetch error:", error);
          setClients([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoaded(true);
        }
      }
    };

    fetchClients();

    return () => controller.abort();
  }, [pathname]);

  // Distribute clients into three rows
  const tracks = [
    clients.filter((_, index) => index % 3 === 0),
    clients.filter((_, index) => index % 3 === 1),
    clients.filter((_, index) => index % 3 === 2),
  ];

  const renderTrack = (items, index) => {
    if (!items.length) return null;

    const duplicatedItems = [...items, ...items];

    return (
      <div
        className={`clientFlow__track clientFlow__track--${index + 1}`}
        key={index}
      >
        <div className="clientFlow__movingTrack">
          {duplicatedItems.map((client, i) => {
            const logoUrl = client.logo
              ? getImageUrl(client.logo)
              : null;

            return (
              <article
                className="clientFlow__logo"
                key={`${client.id || client.name || "client"}-${i}`}
                title={client.name || "Our Partner"}
              >
                <div className="clientFlow__logoInner">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={client.name || "Partner logo"}
                      width={200}
                      height={120}
                      sizes="(max-width: 400px) 100px, (max-width: 768px) 120px, 160px"
                      className="clientFlow__image"
                      unoptimized
                    />
                  ) : (
                    <span className="clientFlow__fallback">
                      {client.name?.charAt(0)?.toUpperCase() || "C"}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section
      className="clientFlow"
      aria-label="Our clients and partners"
    >
      <div className="clientFlow__container">

        <div className="clientFlow__stage">

          {!loaded ? (
            <div className="clientFlow__status">
              <span className="clientFlow__loader" />
              <span>Loading our partners...</span>
            </div>
          ) : clients.length > 0 ? (
            <div className="clientFlow__tracks">
              {tracks.map((track, index) =>
                renderTrack(track, index)
              )}
            </div>
          ) : (
            <div className="clientFlow__status">
              No partners found
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default ClientScroller;
