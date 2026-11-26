import Image from "next/image";
import bellsImg from "../../assets/images/jinglebell-1.png";
import "./SectionDivider.scss";

const SectionDivider = () => {
  return (
    <div className="section-divider" aria-hidden="true">
      <span className="sd-line sd-line-left" />
      <span className="sd-icon">
        <Image
          src={bellsImg}
          width={56}
          height={56}
          alt=""
          className="sd-img"
        />
      </span>
      <span className="sd-line sd-line-right" />
    </div>
  );
};

export default SectionDivider;
