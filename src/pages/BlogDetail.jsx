import React, { useEffect, useState } from "react";
import { db } from "../../database/db";
import { collection, getDocs } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import parse from "html-react-parser";
import { formatDate } from "../utils/formatDate";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import RenderContent from "../components/RenderContent";
import { toSlug } from "../utils/toSlug";
import RelatedPosts from "../components/RelatedPosts";

// Skeleton component for loading
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="p-2 rounded-lg bg-gray-50">
      <div className="p-4">
        <div className="h-8 w-32 bg-gray-100 rounded-lg mb-4"></div>
        <div className="h-8 w-3/4 bg-gray-100 rounded-lg mb-4"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-x-2">
            <div className="w-14 h-14 bg-gray-100 rounded-full"></div>
            <div>
              <div className="h-4 w-32 bg-gray-100 rounded-md mb-2"></div>
              <div className="h-3 w-24 bg-gray-100 rounded-md"></div>
            </div>
          </div>
          <div>
            <div className="h-6 w-16 bg-gray-100 rounded-md"></div>
          </div>
        </div>
        <div className="w-full h-[400px] bg-gray-100 rounded-lg mb-4"></div>
        <div className="h-6 w-3/4 bg-gray-100 rounded-md mb-4"></div>
        <div className="my-8 mx-12">
          <div className="h-4 w-full bg-gray-100 rounded-md mb-2"></div>
          <div className="h-4 w-5/6 bg-gray-100 rounded-md mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-100 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
);

const BlogDetail = () => {
  const { slug, category } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    setLoading(true);
    const blogsCollection = collection(db, "blogs");
    const blogSnapshot = await getDocs(blogsCollection);
    const blogList = blogSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Tìm blog theo slug
    const foundBlog = blogList.find((blog) => blog.slug === slug);
    console.log("🚀 ~ fetchBlog ~ foundBlog:", foundBlog);
    setBlog(foundBlog);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlog();
  }, [slug, category]);

  if (loading) return <SkeletonLoader />;

  if (!blog) return <p>No blog found.</p>;

  const currentUrl = window.location.href;

  return (
    <div className="mt-4">
      <div className="p-2 rounded-lg bg-white">
        <div className="p-4">
          <Link to={`/${toSlug(blog?.category)}`}>
            <span className="px-4 py-2 rounded-lg text-blue-500 bg-blue-100">
              {blog?.category}
            </span>
          </Link>
          <div>
            <h1 className="mt-8 mb-4 font-bold text-2xl text-gray-800">
              {blog.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2 mb-4">
                <img
                  src="https://cdn.dribbble.com/users/772985/screenshots/9247897/media/59b9f4624886350945af7b7fd2ee318f.png?resize=1600x1200&vertical=center"
                  alt=""
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div>
                  <h1 className="font-semibold text-lg text-gray-600">
                    Kien Duong Trung
                  </h1>
                  <span className="text-gray-400 text-sm">
                    {formatDate(blog?.publish_date.toDate())}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 text-gray-400">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF size={20} />
                </a>
                <a
                  href={`https://www.instagram.com/?url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-2">
            {blog.thumbnail_image ? (
              <img
                src={blog?.thumbnail_image?.url}
                alt={blog.title}
                className="w-full md:h-[500px] h-100 object-cover rounded-lg"
              />
            ) : (
              <img
                src="https://cdn.dribbble.com/userupload/16072088/file/original-c2887d4627b1eed2e886d386e74e27a4.png?resize=1514x852&vertical=center"
                className="w-full h-[400px] object-cover rounded-lg"
              />
            )}
            <span className="block py-2 text-center font-base text-sm italic text-gray-600">
              {blog?.title}
            </span>
          </div>

          <div className="my-8 md:mx-12 mx-2 blogView text-wrap overflow-hidden">
            {parse(blog?.content)}
          </div>
          {/* <div className="my-8 md:mx-12 mx-2 blogView">
            <RenderContent content={blog?.content} />
          </div> */}

          {blog?.code_file.url && (
            <div className="my-4 mx-12">
              <a
                href={blog.code_file.url}
                download
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Download Resources
              </a>
            </div>
          )}
        </div>
      </div>

      <div>
        <RelatedPosts
          currentPostId={blog?.id}
          categorySlug={slug}
          tags={blog?.tags || []}
        />
      </div>
    </div>
  );
};

export default BlogDetail;
