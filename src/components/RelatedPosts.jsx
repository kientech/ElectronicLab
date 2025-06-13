import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../database/db";
import ProjectCard from "./ProjectCard";
import SkeletonLoading from "./SkeletonLoading"; // Import loading skeleton

function RelatedPosts({ currentPostId, categorySlug, tags }) {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const allPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const related = allPosts
          .filter(
            (post) =>
              post.id !== currentPostId && // Loại trừ bài viết hiện tại
              (post.category_slug === categorySlug || // Cùng category
                post.tags?.some((tag) => tags.includes(tag))) // Cùng tags
          )
          .slice(0, 5); // Giới hạn 5 bài liên quan

        setRelatedPosts(related);
      } catch (error) {
        console.error("Error fetching related posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, categorySlug, tags]);

  if (!loading && relatedPosts.length === 0) return null; // Không hiển thị nếu không có bài nào liên quan

  return (
    <div className="w-full h-full bg-white mt-8 rounded-lg p-4">
      <h1 className="font-bold text-2xl text-gray-800">Bài Viết Liên Quan</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <SkeletonLoading key={index} />
            )) // Hiển thị skeleton khi đang load
          : relatedPosts.slice(0, 3).map((post) => (
              <div className="shadow-sm rounded-lg">
                <ProjectCard item={post} key={post.id} />
              </div>
            ))}
      </div>
    </div>
  );
}

export default RelatedPosts;
