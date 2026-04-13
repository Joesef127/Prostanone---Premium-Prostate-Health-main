import { API_BASE } from "../lib/constants";
import { useParams, Navigate } from "react-router-dom";
import type { BlogPost as BlogPostType } from "../lib/blogData";
import { useSeoMeta } from "../hooks/useSeoMeta";
import { getFullUrl, generateArticleSchema, SITE_CONFIG } from "../lib/seo";
import BlogPostHeader from "../components/blog/BlogPostHeader";
import BlogPostBody from "../components/blog/BlogPostBody";
import BlogRelatedPosts from "../components/blog/BlogRelatedPosts";
import BlogPostSkeleton from "../components/skeleton-loaders/blog/BlogPostSkeleton";
import ReadingProgressBar from "../components/blog/ReadingProgressBar";
import { useState, useEffect } from "react";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null | undefined>(undefined);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_BASE}/api/blog/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: BlogPostType | null) => setPost(data))
      .catch(() => setPost(null));
    fetch(`${API_BASE}/api/blog`)
      .then((r) => r.json())
      .then((all: BlogPostType[]) =>
        setRelatedPosts(
          Array.isArray(all)
            ? all.filter((p) => p.slug !== slug).slice(0, 2)
            : [],
        ),
      )
      .catch(() => {});
  }, [slug]);

  // SEO configuration for blog post
  useSeoMeta(
    post
      ? {
          title: `${post.title} - Prostanone Blog`,
          description: post.excerpt || post.title,
          keywords: [
            ...(post.tags || []),
            post.category,
            "prostate health",
            "wellness",
          ],
          url: `/blog/${slug}`,
          image: post.coverImage || SITE_CONFIG.defaultImage,
          imageAlt: post.title,
          type: "article",
          author: post.author || "Holis Botanicals",
          publishedDate:
            post.createdAt || new Date().toISOString().split("T")[0],
          modifiedDate:
            post.updatedAt ||
            post.createdAt ||
            new Date().toISOString().split("T")[0],
        }
      : {
          title: "Loading Article - Holis Botanicals Blog",
          description: "Loading blog post...",
          url: `/blog/${slug}`,
        },
    post
      ? {
          schema: generateArticleSchema({
            headline: post.title,
            description: post.excerpt || post.title,
            image: post.coverImage || SITE_CONFIG.defaultImage,
            author: post.author || "Holis Botanicals",
            datePublished:
              post.createdAt || new Date().toISOString().split("T")[0],
            dateModified:
              post.updatedAt ||
              post.createdAt ||
              new Date().toISOString().split("T")[0],
            url: getFullUrl(`/blog/${slug}`),
          }),
        }
      : undefined,
  );

  if (post === undefined) return <BlogPostSkeleton />; // still loading
  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="bg-white pt-16">
      <ReadingProgressBar />
      <BlogPostHeader post={post} />
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="aspect-21/9 rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}
      <BlogPostBody post={post} />
      <BlogRelatedPosts posts={relatedPosts} />
    </div>
  );
};

export default BlogPost;
