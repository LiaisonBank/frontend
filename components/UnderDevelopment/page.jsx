import Image from "next/image";

const UnderDevelopment = () => {
  return (
    <section className="under-development">
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
        <span className="under-development__badge">Coming Soon</span>

        <h3>Currently Under Development</h3>

        <p className="under-development__description">
         We`re currently working on this section to bring <br/>
         you a more informative, seamless, and engaging experience.
        </p>

        <div className="under-development__divider" />

        <p className="under-development__footer">
          Thank you for your patience.
        </p>
      </div>
    </section>
  );
};

export default UnderDevelopment;
