import React, { useEffect, useState } from "react";
import { db } from "../../database/db";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ManagementBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    setLoading(true); // Start loading
    const unsubscribe = onSnapshot(
      collection(db, "blogs"),
      (snapshot) => {
        const blogsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsList);
        setLoading(false); // End loading
      },
      (error) => {
        console.error("Error fetching blogs: ", error);
        toast.error("Failed to fetch blogs.");
        setLoading(false); // End loading if there's an error
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      setLoading(true); // Start loading during deletion
      try {
        await deleteDoc(doc(db, "blogs", id));
        toast.success("Blog deleted successfully!");
      } catch (error) {
        console.error("Error deleting blog: ", error);
        toast.error("Error deleting blog!");
      }
      setLoading(false); // End loading after deletion
    }
  };

  return (
    <div>
      <h1>Manage Blogs</h1>
      {loading ? (
        <p>Loading...</p> // Show loading indicator
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
                <td>
                  <Link to={`/edit-blog/${blog.id}`}>Edit</Link>
                  <button onClick={() => handleDelete(blog.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagementBlogs;
