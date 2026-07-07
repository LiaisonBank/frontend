import Image from "next/image";
import rightTick from "@/assets/images/rightTick.svg";
import { services } from "@/lib/data/servicesData";
import ServiceContent from "./ServiceContent";


export default function ServiceList({ activeIndex, onChange }) {
  return (
    <ul className="service-list list-unstyled list-icon style-1">
      {services.map((item, index) => (
        <li
          key={index}
          className={activeIndex === index ? "accordion-item active" : "accordion-item"}
          onClick={() => onChange(index)}
        >
          <div className="service-title"
            onClick={() => onChange(index)}>
            <Image src={rightTick} alt="" />
            <span>{item.title}</span>
          </div>
            {/* Mobile Content */}
          {activeIndex === index && (
            <div className="d-block d-xl-none mobile-service-content">
              <ServiceContent activeIndex={index} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}