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
import Comments from "../components/Comments";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { usePosition } from "../contexts/PositionContext";

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

const renderContentWithHighlight = (htmlContent) => {
  return parse(htmlContent, {
    replace: (domNode) => {
      if (domNode.name === "pre" && domNode.children.length > 0) {
        const codeNode = domNode.children[0];

        if (codeNode.name === "code") {
          // Lấy class từ domNode (thẻ <pre>), không phải từ codeNode
          const languageClass = domNode.attribs.class || "";
          const matchedLang = languageClass.match(/language-(\w+)/);
          const language = matchedLang ? matchedLang[1] : "plaintext"; // Mặc định là plaintext nếu không tìm thấy

          const codeText = codeNode.children[0]?.data || "";

          return (
            <SyntaxHighlighter
              language={language}
              style={oneLight}
              customStyle={{
                fontSize: "14px",
                lineHeight: "1.5",
                borderRadius: "12px",
              }}
            >
              {codeText}
            </SyntaxHighlighter>
          );
        }
      }
    },
  });
};

const BlogDetail = () => {
  const { slug, category } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState([]);
  const [activeTocId, setActiveTocId] = useState(null);
  const { setCurrentPosition } = usePosition();

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
    setBlog(foundBlog);
    setCurrentPosition(foundBlog?.position);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlog();

    // Cleanup: Clear position when component unmounts or slug/category changes
    return () => {
      console.log("BlogDetail - Cleanup: Setting currentPosition to null");
      setCurrentPosition(null);
    };
  }, [slug, category]);

  useEffect(() => {
    if (blog) {
      // Chờ DOM cập nhật xong rồi lấy tiêu đề
      setTimeout(() => {
        const headings = document.querySelectorAll(
          ".blogView h2, .blogView h3, .blogView h4, .blogView h5, .blogView h6"
        );
        const tocData = Array.from(headings).map((heading, index) => {
          const id = `heading-${index}`;
          heading.id = id; // Gán ID cho mỗi heading
          return {
            id,
            text: heading.textContent,
            level: heading.tagName, // "H2" hoặc "H3"
          };
        });
        setToc(tocData);
      }, 500);
    }
  }, [blog]);

  // Lắng nghe scroll để active mục lục
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll(
        ".blogView h2, .blogView h3, .blogView h4"
      );

      let currentHeading = null;
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 150) {
          currentHeading = heading.id;
        }
      });

      if (currentHeading) {
        setActiveTocId(currentHeading);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) return <SkeletonLoader />;

  if (!blog) return <p>No blog found.</p>;

  const currentUrl = window.location.href;

  return (
    <div className="mt-4">
      <div className="p-2 w-full h-full rounded-lg bg-white">
        <div className="p-2 md:p-4">
          <Link to={`/danh-muc/${toSlug(blog?.category)}`}>
            <span className="px-4 py-2 rounded-lg text-blue-600 bg-blue-100">
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
                  src="/me.jpg"
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
              <div className="flex gap-4">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <span style={{ color: "#1877F2" }}>
                    <FaFacebookF size={20} />
                  </span>
                </a>
                <a
                  href={`https://www.instagram.com/?url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <span style={{ color: "#C13584" }}>
                    <FaInstagram size={20} />
                  </span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform duration-200"
                >
                  <span style={{ color: "#000000" }}>
                    <FaTwitter size={20} />
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-2">
            {blog.thumbnail_image ? (
              <img
                src={blog?.thumbnail_image?.url || blog?.thumbnail_image}
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

          <div className="flex flex-col-reverse md:flex-row gap-x-5 h-auto">
            {/* Left Column - Content & Comments */}
            <div className="w-full md:w-[70%]">
              {/* Blog Content */}
              <div className="blogView my-8 md:mx-8 mx-2 text-wrap overflow-hidden">
                {renderContentWithHighlight(blog?.content)}
              </div>

              {/* Download Resources */}
              {blog?.code_file?.url && (
                <div className="my-4 mx-8">
                  <a
                    href={blog.code_file.url}
                    download
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Download Resources
                  </a>
                </div>
              )}
            </div>

            {/* Right Column - Table of Contents and Related Posts */}
            <div className="w-full md:w-[30%] px-4">
              <div className="mt-8 sticky top-4">
                <h3 className="text-lg font-bold mb-4">Mục lục</h3>
                <ul className="list-disc pl-5">
                  {toc.map((item) => (
                    <li
                      key={item.id}
                      className={`text-gray-700 hover:text-blue-500 cursor-pointer ${
                        activeTocId === item.id ? "font-bold text-blue-600" : ""
                      }
                      ml-${(parseInt(item.level[1]) - 2) * 4}`}
                      onClick={() => {
                        document.getElementById(item.id).scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                    >
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Comments */}
      <Comments blogId={blog.id} />
      <RelatedPosts
        currentBlogId={blog.id}
        currentBlogCategory={blog.category}
      />
    </div>
  );
};

export default BlogDetail;
