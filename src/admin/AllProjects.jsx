import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  message,
  Popconfirm,
  Tooltip,
  Select,
  DatePicker,
  Badge,
  Avatar,
  Typography,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  HeartOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../database/db";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

const AllProjects = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Load projects
  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsRef = collection(db, "blogs");
      const q = query(projectsRef, orderBy("publish_date", "desc"));
      const querySnapshot = await getDocs(q);

      const projectsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const publishDate = data.publish_date?.toDate();
        const lastUpdated = data.last_updated?.toDate();

        // Validate dates
        if (publishDate && isNaN(publishDate.getTime())) {
          console.warn("Invalid publish_date for document:", doc.id);
        }
        if (lastUpdated && isNaN(lastUpdated.getTime())) {
          console.warn("Invalid last_updated for document:", doc.id);
        }

        return {
          id: doc.id,
          ...data,
          publish_date:
            publishDate instanceof Date && !isNaN(publishDate.getTime())
              ? publishDate
              : new Date(),
          last_updated:
            lastUpdated instanceof Date && !isNaN(lastUpdated.getTime())
              ? lastUpdated
              : new Date(),
          view_count: data.view_count || 0,
          like_count: data.like_count || 0,
          status: data.status || "public",
          category: data.category || "uncategorized",
          author: data.author || "Kien Duong Trung",
          thumbnail_image:
            data.thumbnail_image || "https://via.placeholder.com/150",
          tags: data.tags || [],
          short_description: data.short_description || "",
        };
      });

      console.log("Fetched projects:", projectsData);
      setProjects(projectsData);
      setFilteredProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      message.error("Lỗi khi tải danh sách bài viết!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, "categories");
      const querySnapshot = await getDocs(categoriesRef);
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched categories:", categoriesData); // Debug log
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error); // Debug log
      message.error("Lỗi khi tải danh mục!");
    }
  };

  // Filter projects
  useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (project) =>
          project.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          project.author?.toLowerCase().includes(searchText.toLowerCase()) ||
          project.short_description
            ?.toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (project) => project.status === selectedStatus
      );
    }

    // Date range filter
    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((project) => {
        const projectDate = project.publish_date;
        return (
          projectDate >= dateRange[0].startOf("day") &&
          projectDate <= dateRange[1].endOf("day")
        );
      });
    }

    console.log("Filtered projects:", filtered); // Debug log
    setFilteredProjects(filtered);
  }, [projects, searchText, selectedCategory, selectedStatus, dateRange]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      message.success("Xóa bài viết thành công!");
      fetchProjects();
    } catch (error) {
      message.error("Lỗi khi xóa bài viết!");
    }
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = selectedRowKeys.map((id) =>
        deleteDoc(doc(db, "blogs", id))
      );
      await Promise.all(deletePromises);
      message.success(`Đã xóa ${selectedRowKeys.length} bài viết thành công!`);
      setSelectedRowKeys([]);
      fetchProjects();
    } catch (error) {
      message.error("Lỗi khi xóa bài viết!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "public":
        return "success";
      case "draft":
        return "default";
      case "private":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "public":
        return "Công khai";
      case "draft":
        return "Bản nháp";
      case "private":
        return "Riêng tư";
      default:
        return status;
    }
  };

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return "N/A";
    }
    try {
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  const columns = [
    {
      title: "Bài viết",
      dataIndex: "title",
      key: "title",
      width: "35%",
      render: (text, record) => (
        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <Avatar
              src={record.thumbnail_image}
              alt={text}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Text strong className="block text-base">
                {text}
              </Text>
              <div className="flex items-center gap-2 mt-1">
                <Text type="secondary" className="text-sm">
                  {record.author}
                </Text>
                <span className="text-gray-400">•</span>
                <Text type="secondary" className="text-sm">
                  {formatDate(record.publish_date)}
                </Text>
              </div>
              <Paragraph
                ellipsis={{
                  rows: 2,
                  expandable: true,
                  symbol: "Xem thêm",
                }}
                className="text-sm mt-1 mb-0"
              >
                {record.short_description}
              </Paragraph>
              <div className="flex flex-wrap gap-1 mt-2">
                <Tag color="blue" className="capitalize text-xs">
                  {record.category}
                </Tag>
                {record.tags?.map((tag, index) => (
                  <Tag key={index} color="cyan" className="text-xs">
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "SEO & Tương tác",
      key: "seo",
      width: "25%",
      render: (_, record) => (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Tooltip title="Lượt xem">
              <Tag color="blue" className="flex items-center gap-1">
                <EyeOutlined className="text-sm" />
                <span className="text-sm">{record.view_count}</span>
              </Tag>
            </Tooltip>
            <Tooltip title="Lượt thích">
              <Tag color="red" className="flex items-center gap-1">
                <HeartOutlined className="text-sm" />
                <span className="text-sm">{record.like_count}</span>
              </Tag>
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-2">
            {record.video_demo && (
              <Tooltip title="Có video demo">
                <Tag color="green" className="flex items-center gap-1">
                  <VideoCameraOutlined className="text-sm" />
                  <span className="text-sm">Video</span>
                </Tag>
              </Tooltip>
            )}
            {record.code_file && (
              <Tooltip title="Có file code">
                <Tag color="purple" className="flex items-center gap-1">
                  <CodeOutlined className="text-sm" />
                  <span className="text-sm">Code</span>
                </Tag>
              </Tooltip>
            )}
          </div>
          <div className="space-y-1">
            <Text type="secondary" className="text-xs block">
              URL: {record.slug}
            </Text>
            <Text type="secondary" className="text-xs block">
              Cập nhật: {formatDate(record.last_updated)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <div className="space-y-2">
          <Badge
            status={getStatusColor(status)}
            text={getStatusText(status)}
            className="capitalize"
          />
          <div className="flex flex-col gap-1">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => window.open(`/blog/${record.slug}`, "_blank")}
              className="w-full flex items-center justify-center"
            >
              Xem
            </Button>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/dashboard/edit-project/${record.id}`)}
              className="w-full flex items-center justify-center"
            >
              Sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa bài viết này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Có"
              cancelText="Không"
            >
          <Button
                type="text"
                danger
            icon={<DeleteOutlined />}
                className="w-full flex items-center justify-center"
              >
                Xóa
              </Button>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
  };

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Quản lý bài viết</h1>
              <p className="text-gray-500 text-sm mt-1">
                Tổng số bài viết: {filteredProjects.length}
              </p>
            </div>
            <Space>
        <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/dashboard/create-project")}
        >
                Tạo bài viết mới
        </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchProjects}
                loading={loading}
              />
            </Space>
      </div>
        }
      >
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            <Search
              placeholder="Tìm kiếm theo tiêu đề, tác giả hoặc mô tả..."
          allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64"
        />
        <Select
              placeholder="Lọc theo danh mục"
              style={{ width: 200 }}
              value={selectedCategory}
              onChange={setSelectedCategory}
              size="large"
            >
              <Option value="all">Tất cả danh mục</Option>
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
            </Option>
          ))}
        </Select>
        <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: 200 }}
              value={selectedStatus}
              onChange={setSelectedStatus}
              size="large"
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="public">Công khai</Option>
              <Option value="draft">Bản nháp</Option>
              <Option value="private">Riêng tư</Option>
        </Select>
            <RangePicker
              size="large"
              value={dateRange}
              onChange={setDateRange}
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </div>
          {selectedRowKeys.length > 0 && (
            <div className="flex justify-end">
              <Popconfirm
                title={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} bài viết đã chọn?`}
                onConfirm={handleBulkDelete}
                okText="Có"
                cancelText="Không"
              >
                <Button danger icon={<DeleteOutlined />}>
                  Xóa đã chọn ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            </div>
          )}
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredProjects}
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bài viết`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: (
              <Empty
                description="Không có bài viết nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>
    </div>
  );
};

export default AllProjects;
