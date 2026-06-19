import Link from "next/link";
import BodyClassWrapper from "@/components/BodyClassWrapper/page";
import LeaveReply from "./LeaveReply";
import pressReleaseData from "@/lib/data/pressReleaseData";

export async function generateMetadata({ params }) {
  const post = pressReleaseData.find(
    (item) => item.slug === params.slug
  );

  if (!post) {
    return {
      title: "Press Release Not Found",
    };
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription,
    keywords: post.seo?.keywords,

    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription,
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription,
      images: [post.featuredImage],
    },

    alternates: {
      canonical: `https://yourdomain.com/press-release/${post.slug}`,
    },
  };
}



export default async function PressReleaseDetailPage({ params,}) {

    const { slug } = await params;

    const post = pressReleaseData.find(
        (item) => item.slug === slug
    );

    if (!post) {
        notFound();
    }
    const currentIndex = pressReleaseData.findIndex(
        (item) => item.slug === slug
    );

    const prevPost =
        currentIndex > 0
            ? pressReleaseData[currentIndex - 1]
            : null;

    const nextPost =
        currentIndex < pressReleaseData.length - 1
            ? pressReleaseData[currentIndex + 1]
            : null;
    return (
        <>
           <BodyClassWrapper />
            {/* PAGE HEADER */}
            <div className="page-header">
                <div className="inner-header">
                    <div className="page-title">
                        <div className="container">
                            <div className="row justify-content-center text-center">
                                <div className="col-lg-10">
                                    <div className="theme-breadcrumb-box">
                                        <h1>{post.title}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="py-4">
                <div className="container">
                    <div className="row">
                        {/* Left Column - 70% */}
                        <div className="pressdetails col-12 col-lg-9 mb-3 mb-lg-0 px-5">
                            <h1 className="mb-3">{post.title}</h1>

                            {/* {post.image && (    
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="img-fluid rounded mb-4"
                                />
                            )} */}

                            <div className="post-content mb-5">
                                {/* Press Release Content */}
                                <div className="mb-3"
                                    dangerouslySetInnerHTML={{
                                        __html: post.content,
                                    }}
                                />
                                 {/* SEO Information */}
                                <div className="card mb-4 border-0 bg-light">
                                    <div className="card-body">
                                        <h5 className="mb-3">SEO Information</h5>

                                        <div className="mb-3">
                                            <strong>Meta Title:</strong>
                                            <p className="mb-0">
                                                {post?.metaTitle || post.title}
                                            </p>
                                        </div>

                                        <div className="mb-3">
                                            <strong>Meta Description:</strong>
                                            <p className="mb-0">
                                                {post?.metaDescription || "No description available"}
                                            </p>
                                        </div>

                                        <div>
                                            <strong>Keywords:</strong>
                                            <p className="mb-0">
                                                {Array.isArray(post.seo?.keywords)
                                                    ? post.keywords.join(", ")
                                                    : post?.keywords || "No keywords available"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Previous & Next Post Navigation */}
                            <div className="row border-top border-bottom py-4 mb-5 ">
                                <div className="col-6 prev-post-title">
                                    {prevPost && (
                                        <Link
                                            href={`/press-release-liaison-bank/${prevPost.slug}`}
                                            className="text-decoration-none"
                                        >
                                            <small className="text-muted d-block">
                                                ← Previous Post
                                            </small>

                                            <h6 className="mb-0 text-dark">
                                                {prevPost.title}
                                            </h6>
                                        </Link>
                                    )}
                                </div>

                                <div className="col-6 text-end next-post-title">
                                    {nextPost && (
                                        <Link
                                            href={`/press-release-liaison-bank/${nextPost.slug}`}
                                            className="text-decoration-none"
                                        >
                                            <small className="text-muted d-block">
                                                Next Post →
                                            </small>

                                            <h6 className="mb-0 text-dark">
                                                {nextPost.title}
                                            </h6>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Leave Reply Form */}
                            <LeaveReply
                                postId={post.id}
                                postSlug={post.slug}
                                postTitle={post.title}
                            />
                        </div>

                        {/* Right Column - 30% */}
                        <div className="recentpost col-12 col-lg-3 border-left">
                            <div className="sticky-top" style={{ top: "20px" }}>
                                <h3 className="mb-4">RECENT POSTS</h3>
                                {pressReleaseData
                                    .filter((item) => item.slug !== post.slug)
                                    .slice(0, 5)
                                    .map((item) => (
                                        <div
                                            key={item.id}
                                            className="border-bottom pb-3 mb-3"
                                        >
                                            <Link
                                                href={`/press-release-liaison-bank/${item.slug}`}
                                                className="text-decoration-none"
                                            >
                                                <h6 className="mb-1 text-dark">
                                                    {item.title}
                                                </h6>

                                                <small className="text-muted">
                                                    {item.publishedAt}
                                                </small>
                                            </Link>
                                        </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}