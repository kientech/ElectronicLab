// src/components/BlogList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../database/db";
import { collection, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const blogsCollection = collection(db, "blogs");

    // Sử dụng onSnapshot để nghe các thay đổi
    const unsubscribe = onSnapshot(blogsCollection, (snapshot) => {
      const blogList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogList);
    });

    // Trả về hàm unsubscribe để ngừng nghe khi component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Blog List</h1>
      {blogs.map((blog) => (
        <div key={blog.id}>
          {/* Sử dụng slug để tạo liên kết */}
          <Link to={`/blog/${blog.slug}`}>
            <h2>{blog.title}</h2>
          </Link>
          <p>{blog.short_description || blog.content.slice(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
};

export default BlogsList;
