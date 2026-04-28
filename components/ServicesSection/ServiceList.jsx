import Image from "next/image";
import rightTick from "@/assets/images/rightTick.svg";
import { services } from "@/lib/data/servicesData";

export default function ServiceList({ activeIndex, onChange }) {
  return (
    <ul className="service-list list-unstyled list-icon style-1">
      {services.map((item, index) => (
        <li
          key={index}
          className={activeIndex === index ? "accordion-item active" : "accordion-item"}
          onClick={() => onChange(index)}
        >
          <Image src={rightTick} alt="" />
          <span>{item.title}</span>
        </li>
      ))}
    </ul>
  );
}