import Image from "next/image";
import Link from 'next/link'


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
          To Avail Our Services Call Us :
          <span className="under-development__contact">
            <Link href="tel:+919769458515"><span> +91 97694 58515</span></Link> | 
            <Link href="tel:+919136066910"><span> +91 91360 66910</span></Link>
          </span>
        </p>
      </div>
    </section>
  );
};

export default UnderDevelopment;
 