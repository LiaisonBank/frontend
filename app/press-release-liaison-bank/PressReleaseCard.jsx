import Link from "next/link";
import Image from "next/image";
import placeholder from "@/public/images/400X400.png";
import { getImageUrl } from "@/lib/utils/getImagehelper";

export default function PressReleaseCard({ item }) {
    const image =   item.featured_image?.trim() ||  placeholder;
    console.log(process.env.BACKEND_URL);
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
    const slug = item.slug || item.id;
    const title = item.title || "Untitled";
    const category = item.category || "Press Release";

  return (
    <article className="press-card">
      <Link href={`/press-release/${slug}`}>
        <div className="image-wrapper">
          <Image
            src={getImageUrl(image.featured_image) || placeholder}
            alt={title}
            fill
            className="image"
            sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
          /></div> 
          <span className="category">{category}</span>
        </Link>
        <div className="content">
          
          <h3>{title}</h3>
          <div className="footer">
            <Link href={`/press-release/${slug}`}><span className="read-more">
              Read More →   
            </span></Link>
            {/* <span>{formattedDate}</span> */}
          </div>
        </div>
    </article>
  );
}