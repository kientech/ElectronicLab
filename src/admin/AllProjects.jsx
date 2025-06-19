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
  InputNumber,
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
  updateDoc,
} from "firebase/firestore";
import { db } from "../../database/db";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

const positionList = [
  "Phát Triển Mới Nhất",
  "Dự Án Nổi Bật",
  "Ứng Dụng Công Nghệ",
  "Nền Tảng Kỹ Thuật",
];

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
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsRef = collection(db, "blogs");

      const projectsSnapshot = await getDocs(
        query(projectsRef, orderBy("publish_date", "desc"))
      );

      const projectsData = projectsSnapshot.docs.map((doc) => {
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
          category: data.category || "Uncategorized", // Use category directly from blog document
          author: data.author || "Kien Duong Trung",
          thumbnail_image:
            data.thumbnail_image || "https://via.placeholder.com/150",
          tags: data.tags || [],
          short_description: data.short_description || "",
          position: data.position || null, // position now stores string or null
        };
      });

      setProjects(projectsData);
      setFilteredProjects(projectsData);

      // Extract unique categories from fetched projects
      const uniqueCategories = [
        ...new Set(projectsData.map((project) => project.category)),
      ].filter(Boolean); // Filter out any undefined/null categories
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching projects:", error);
      message.error("Lỗi khi tải danh sách bài viết!");
    } finally {
      setLoading(false);
    }
  };

  // Function to update position
  const handlePositionChange = async (value, recordId) => {
    try {
      const projectRef = doc(db, "blogs", recordId);
      await updateDoc(projectRef, { position: value });

      // Optimistically update the UI
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === recordId ? { ...project, position: value } : project
        )
      );
      setFilteredProjects((prevFilteredProjects) =>
        prevFilteredProjects.map((project) =>
          project.id === recordId ? { ...project, position: value } : project
        )
      );
      message.success("Cập nhật vị trí thành công!");
    } catch (error) {
      console.error("Error updating position:", error);
      message.error("Lỗi khi cập nhật vị trí!");
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
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            src={record.thumbnail_image}
            alt={text}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          />
          <div>
            <Text strong>{text}</Text>
            <Text type="secondary" className="block text-sm">
              {record.author}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Mô tả ngắn",
      dataIndex: "short_description",
      key: "short_description",
      width: "200px",
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2, expandable: false }}>{text}</Paragraph>
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
      width: "150px",
      render: (text, record) => (
        <Select
          value={text || null}
          onChange={(value) => handlePositionChange(value, record.id)}
          className="w-full"
          allowClear
          placeholder="Chọn vị trí"
        >
          {positionList.map((position) => (
            <Option key={position} value={position}>
              {position}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag color="blue" className="capitalize">
          {category}
        </Tag>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "publish_date",
      key: "publish_date",
      render: (date) => formatDate(date),
    },
    {
      title: "Lượt xem",
      dataIndex: "view_count",
      key: "view_count",
      render: (count) => (
        <Tag icon={<EyeOutlined />} color="blue">
          {count}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge status={getStatusColor(status)} text={getStatusText(status)} />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem bài viết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => window.open(`/blog/${record.slug}`, "_blank")}
            />
          </Tooltip>
          <Tooltip title="Sửa bài viết">
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/dashboard/edit-project/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa bài viết">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
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
                <Option key={category} value={category}>
                  {category}
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
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} mục`,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: <Empty description="Không có dữ liệu" />,
          }}
        />
      </Card>
    </div>
  );
};

export default AllProjects;
