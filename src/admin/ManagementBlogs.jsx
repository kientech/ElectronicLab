import React, { useEffect, useState } from "react";
import { db } from "../../database/db";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Table, Button, Popconfirm, Spin, Drawer, Input, Space } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const ManagementBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "blogs"),
      (snapshot) => {
        const blogsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsList);
        setFilteredBlogs(blogsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching blogs: ", error);
        toast.error("Failed to fetch blogs.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog: ", error);
      toast.error("Error deleting blog!");
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterText(value);
    setFilteredBlogs(
      blogs.filter((blog) => blog.title.toLowerCase().includes(value))
    );
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Link to={`/edit-blog/${record.id}`}>
            <Button type="link" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Are you sure to delete this blog?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Manage Blogs</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => setDrawerVisible(true)}
        >
          Filter
        </Button>
      </Space>
      <Drawer
        title="Filter Blogs"
        placement="right"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Input
          placeholder="Search by title"
          value={filterText}
          onChange={handleFilterChange}
        />
      </Drawer>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredBlogs}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default ManagementBlogs;
