
import Link from "next/link";
import Image from "next/image";
import placeholder from "@/public/images/400X400.png";
import { getImageUrl } from "@/lib/utils/getImagehelper";

export default function PressReleaseCard({ item }) {
   const image =   getImageUrl(item?.post_image?.trim() || item?.image) ||  placeholder;
    const slug = item.slug || item.id;
    const title = item.title || "Untitled";
    const category = item.category || "Press Release";

  return (
    <article className="press-card">
      <Link href={`/press-release-liaison-bank/${slug}`}>
        <div className="image-wrapper">
          <Image
            src={image}
            alt={title}
            fill
            className="image"
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
          /></div> 
        </Link>
        <div className="content">
          <div>
            <h5>{title}</h5>
            <p className="category">{category}</p>
          </div>
          <div className="footer">
            <Link href={`/press-release-liaison-bank/${slug}`}><span className="read-more">
              Read More →   
            </span></Link>
            {/* <span>{formattedDate}</span> */}
          </div>
        </div>
    </article>
  );
}