import React, { useEffect, useState } from "react";
import { db } from "../../database/db";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { categoryOptions } from "../../database/categories";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function AllProjects() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [inputTitle, setInputTitle] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(db, "blogs"));
      const blogList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogList);
      setFilteredBlogs(blogList);
    };
    fetchBlogs();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    filterBlogs(value, statusFilter, categoryFilter, authorFilter);
  };

  const handleFilterStatus = (value) => {
    setStatusFilter(value);
    filterBlogs(searchText, value, categoryFilter, authorFilter);
  };

  const handleFilterCategory = (value) => {
    setCategoryFilter(value);
    filterBlogs(searchText, statusFilter, value, authorFilter);
  };

  const handleFilterAuthor = (value) => {
    setAuthorFilter(value);
    filterBlogs(searchText, statusFilter, categoryFilter, value);
  };

  const filterBlogs = (search, status, category, author) => {
    let filtered = blogs;
    if (search) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(search)
      );
    }
    if (status) {
      filtered = filtered.filter((blog) => blog.status === status);
    }
    if (category) {
      filtered = filtered.filter((blog) => blog.category === category);
    }
    if (author) {
      filtered = filtered.filter((blog) => blog.author === author);
    }
    setFilteredBlogs(filtered);
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      await deleteDoc(doc(db, "blogs", confirmDelete.id));
      setBlogs(blogs.filter((blog) => blog.id !== confirmDelete.id));
      setFilteredBlogs(
        filteredBlogs.filter((blog) => blog.id !== confirmDelete.id)
      );
      setConfirmDelete(null);
      setInputTitle("");

      toast.success("Bài Viết Đã Được Xoá Thành Công!!!", {
        position: "top-center",
        style: { width: "400px" }, // Điều chỉnh chiều rộng thông báo
        autoClose: 3000, // Đóng tự động sau 3 giây
      });
    }
  };

  return (
    <div className="p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-6">Quản Lý Bài Viết</h1>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm tiêu đề..."
          onChange={handleSearch}
          className="border p-2 rounded w-full"
        />
        <select
          onChange={(e) => handleFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="publish">Công khai</option>
          <option value="draft">Không công khai</option>
        </select>
        <select
          onChange={(e) => handleFilterCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tất cả danh mục</option>
          {categoryOptions.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => handleFilterAuthor(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tất cả tác giả</option>
          <option value="admin">Admin</option>
          <option value="guest">Khách</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 min-w-max rounded-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 w-[300px]">Tiêu đề</th>
              <th className="border p-2 w-[200px]">Tác giả</th>
              <th className="border p-2 w-1/10">Lượt xem</th>
              <th className="border p-2 w-1/10">Lượt thích</th>
              <th className="border p-2 w-[250px]">Danh mục</th>
              <th className="border p-2 w-1/10">Trạng thái</th>
              <th className="border p-2 w-1/10">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {filteredBlogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="border p-2">{blog.title}</td>
                <td className="border p-2">{blog.author}</td>
                <td className="border p-2">{blog.view_count}</td>
                <td className="border p-2">{blog.like_count}</td>
                <td className="border p-2">{blog.category}</td>
                <td className="border p-2">{blog.status}</td>
                <td className="border p-2 space-x-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded">
                    Xem
                  </button>
                  <Link
                    to={`/dashboard/edit-project/${blog?.id}`}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Sửa
                  </Link>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => setConfirmDelete(blog)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p>Nhập tiêu đề "{confirmDelete.title}" để xác nhận:</p>
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="border p-2 rounded w-full mt-2"
            />
            <div className="mt-4 flex justify-center space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setConfirmDelete(null)}
              >
                Hủy
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  inputTitle === confirmDelete.title
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleDelete}
                disabled={inputTitle !== confirmDelete.title}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllProjects;
