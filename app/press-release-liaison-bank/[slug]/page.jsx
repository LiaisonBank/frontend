import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import BodyClassWrapper from "@/components/BodyClassWrapper/page";
import LeaveReply from "./LeaveReply";
import { getImageUrl } from "@/lib/utils/getImagehelper";
// import pressReleaseData from "@/lib/data/pressReleaseData";

import { getPressReleaseBySlug, getPressReleases } from "@/lib/api/press-releases";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const NEXT_PUBLIC_BACKEND_URL =  process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const post = await getPressReleaseBySlug(slug);

    const image =
      post.featuredImage?.startsWith("http")
        ? post.featuredImage
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}${post.featuredImage}`;

    return {
      title: post.seo?.metaTitle || post.title,

      description:
        post.seo?.metaDescription ||
        "Latest press release from Liaison Bank.",

      keywords: post.seo?.keywords || [],

      alternates: {
        canonical: `${ NEXT_PUBLIC_BACKEND_URL}/press-release-liaison-bank/${post.slug}`,
      },

      openGraph: {
        title: post.seo?.metaTitle || post.title,

        description:
          post.seo?.metaDescription ||
          "Latest press release from Liaison Bank.",

        url: `${ NEXT_PUBLIC_BACKEND_URL}/press-release-liaison-bank/${post.slug}`,

        type: "article",

        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: post.seo?.metaTitle || post.title,
        description:
          post.seo?.metaDescription ||
          "Latest press release from Liaison Bank.",
        images: [image],
      },
    };
  } catch (error) {
    return {
      title: "Press Release Not Found",
      description: "The requested press release could not be found.",
    };
  }
}

export default async function PressReleaseDetailPage({  params,}) {
    const { slug } = await params;
    let post;
    let posts = [];

    try {
        post = await getPressReleaseBySlug(slug);
        console.log("Post:", post);
        posts = await getPressReleases();
    } catch (error) {
        notFound();
    }

    const currentIndex = posts.findIndex(
        (item) => item.slug === slug
    );

    const prevPost =
        currentIndex > 0
        ? posts[currentIndex - 1]
        : null;

    const nextPost =
        currentIndex < posts.length - 1
        ? posts[currentIndex + 1]
        : null;

    const recentPosts = posts
        .filter((item) => item.slug !== slug)
        .slice(0, 5);

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

            {/* LEFT */}

            <div className="pressdetails col-12 col-lg-9 mb-3 mb-lg-0 px-lg-5">
              {/* <h1 className="mb-4">{post.title}</h1> */}

                {/* Featured Image */}
               <div className="position-relative mb-4">
                <Image
                    src={getImageUrl(post.post_image?.trim() || post.image) || placeholder}
                    alt={post.title}
                    width={600}
                    height={800}
                    className="img-fluid rounded"
                    style={{
                    width: "100%",
                    height: "auto",
                    }}
                />
                </div>
                {post.featuredImage && (
                    <Image
                    width={1200}
                    height={630}
                    src={
                        post.featuredImage.startsWith("http")
                        ? post.featuredImage
                        : `${process.env.NEXT_PUBLIC_BACKEND_URL}${post.featuredImage}`
                    }
                    alt={post.title}
                    className="img-fluid rounded mb-4"
                    />
                )}

                {/* Content */}
                <article
                    className="post-content mb-5"
                    dangerouslySetInnerHTML={{
                    __html: post.content,
                    }}
                />
                {/* Content Image */}
                {post.content_image && (
                  <div className="content-image mb-4 text-center">
                    <Image
                      src={getImageUrl(post.content_image.trim())}
                      alt={`${post.title} Content Image`}
                      fill
                      className="content-img img-fluid rounded"
                    />
                  </div>
                )}


              {/* SEO */}

              <div className="card border-0 bg-light mb-5">
                <div className="card-body">

                  <h5 className="mb-3">
                    SEO Information
                  </h5>

                  <div className="mb-3">
                    <strong>Meta Title</strong>

                    <p className="mb-0">
                      {post.seo?.metaTitle ||
                        post.title}
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong>
                      Meta Description
                    </strong>

                    <p className="mb-0">
                      {post.seo?.metaDescription ||
                        "No description available"}
                    </p>
                  </div>

                  <div>
                    <strong>Keywords</strong>

                    <p className="mb-0">
                      {Array.isArray(
                        post.seo?.keywords
                      )
                        ? post.seo.keywords.join(", ")
                        : "No keywords available"}
                    </p>
                  </div>

                </div>
              </div>

              {/* Previous / Next */}
              <div className="row border-top border-bottom py-4 mb-5 post-navigation">

                <div className="col-6 prev">

                  {prevPost && (
                    <Link
                      href={`/press-release-liaison-bank/${prevPost.slug}`}
                      className="text-decoration-none prev-post-title"
                    >
                      <small className="text-muted d-block">
                        ← Previous Post
                      </small>

                      <h5 className="text-dark">
                        {prevPost.title}
                      </h5>
                    </Link>
                  )}

                </div>

                <div className="col-6 next text-end">
                  {nextPost && (
                    <Link
                      href={`/press-release-liaison-bank/${nextPost.slug}`}
                      className="text-decoration-none next-post-title"
                    >
                      <small className="text-muted d-block">
                        Next Post →
                      </small>

                      <h5 className="text-dark">
                        {nextPost.title}
                      </h5>
                    </Link>
                  )}
                </div>

              </div>

              {/* Comments */}

              <LeaveReply
                postId={post.id}
                postSlug={post.slug}
                postTitle={post.title}
              />

            </div>

            {/* RIGHT SIDEBAR */}

            <div className="recentpost col-12 col-lg-3">

              <div
                className="sticky-top"
                style={{ top: 20 }}
              >
                <div className="recent-post-title">
                    <h3 className="pl-3 mb-2">RECENT POSTS</h3>
                </div>
                

                {recentPosts.map((item) => (
                  <div
                    key={item.id}
                    className="recent-post-list border-bottom py-3 pl-3 mb-3"
                  >
                    <Link
                      href={`/press-release-liaison-bank/${item.slug}`}
                      className="text-decoration-none"
                    >
                      <div className="d-flex align-items-center gap-3">
                     <Image
                          src={getImageUrl(item.featured_image?.trim() || item.image) || placeholder}
                          alt={item.title}
                          width={75}
                          height={75}
                          className="img-fluid rounded"
                      />
                      <div>
                        <h6 className="mb-1">{item.title}</h6>
                        <small>
                          {new Date(item.published_at).toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </small>

                      </div>
                      </div>
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