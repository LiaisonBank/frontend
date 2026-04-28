"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Fancybox } from "@fancyapps/ui";
import { certificateList } from "../lib/data/certificateList";

import "@fancyapps/ui/dist/fancybox/fancybox.css";

export default function CertificateScroller() {

  /* ---------------- FANCYBOX ---------------- */

  useEffect(() => {
    Fancybox.bind('[data-fancybox="certificates"]', {
      Thumbs: false,
      Toolbar: {
        display: ["close"],
      },
    });

    return () => {
      Fancybox.unbind('[data-fancybox="certificates"]');
      Fancybox.close();
    };
  }, []);

  /* Duplicate list for seamless infinite loop */
  const certificates = [...certificateList, ...certificateList];

  return (
    <section className="certificate-section">
      <div className="certificate-track">

        {certificates.map((item, index) => (
          <div className="certificate-item" key={index}
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-delay={index * 100}
            data-aos-once="true">
            <a
              href={item.src}
              data-fancybox="certificates"
              data-caption={item.caption}
            >
              <div className="certificate-img-wrapper">
                <Image
                  src={item.src}
                  width={400}
                  height={250}
                  alt={item.caption}
                  className="certificate-img"
                />
              </div>
            </a>
          </div>
        ))}

      </div>
    </section>
  );
} 