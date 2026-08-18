"use client";

import Image from "next/image";
import Link from "next/link";

const UnderDevelopment = ({
  section = null,
  category = null,
  source = "unknown",
}) => {
  return (
    <section
      className="under-development"
      data-source={source}
      data-section-id={section?.id ?? ""}
      data-section-name={section?.name ?? ""}
      data-category-id={category?.id ?? ""}
      data-category-name={category?.name ?? ""}
    >
      {/* Left Column - Illustration */}
      <div className="under-development__visual">
        <Image
          src="/images/under-development.webp"
          alt="Under Development"
          width={1152}
          height={922}
          priority
          className="under-development__image"
        />
      </div>

      {/* Right Column - Content */}
      <div className="under-development__content">
        <h3>
          {/* {category?.name } <br/> */}
          {section?.name }<br/>
          Website Under Development</h3>

        <p className="under-development__description">
          Our website is getting a fresh look, but our services
          are running as usual. Thanks for your patience!
          
        </p>

        {/* Parent information is available here */}

        {/* Example:
        <p>
          Section: {section?.name}
        </p>

        <p>
          Category: {category?.name}
        </p>
        */}

        {/* <div className="under-development__divider" /> */}

        {/* <p className="under-development__footer">
          To Avail Our Services Call Us :
          <span className="under-development__contact">
            <Link href="tel:+919769458515">
              <span> +91 97694 58515</span>
            </Link>{" "}
            |
            <Link href="tel:+919136066910">
              <span> +91 91360 66910</span>
            </Link>
          </span>
        </p> */}
      </div>
    </section>
  );
};

export default UnderDevelopment;