import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Tooltip,
  Select,
  Avatar,
  Typography,
  Empty,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../database/db";

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

const Categories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesRef = collection(db, "categories");
      const querySnapshot = await getDocs(categoriesRef);
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Lỗi khi tải danh mục!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      status: category.status || "active",
      color: category.color || "blue",
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      message.success("Xóa danh mục thành công!");
      fetchCategories();
    } catch (error) {
      message.error("Lỗi khi xóa danh mục!");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await updateDoc(doc(db, "categories", editingCategory.id), values);
        message.success("Cập nhật danh mục thành công!");
      } else {
        await addDoc(collection(db, "categories"), {
          ...values,
          created_at: new Date(),
          updated_at: new Date(),
        });
        message.success("Thêm danh mục thành công!");
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("Lỗi khi lưu danh mục!");
    }
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: "25%",
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            style={{ backgroundColor: record.color || "#1890ff" }}
            size="large"
          >
            {text.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Text strong className="block">
              {text}
            </Text>
            <Text type="secondary" className="text-xs">
              {record.description}
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
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Số bài viết",
      dataIndex: "post_count",
      key: "post_count",
      width: "15%",
      render: (count) => <Tag color="blue">{count || 0} bài viết</Tag>,
    },
    {
      title: "Thời gian",
      key: "time",
      width: "20%",
      render: (_, record) => (
        <div className="space-y-1">
          <Text type="secondary" className="text-xs block">
            Tạo: {new Date(record.created_at?.toDate()).toLocaleDateString()}
          </Text>
          <Text type="secondary" className="text-xs block">
            Cập nhật:{" "}
            {new Date(record.updated_at?.toDate()).toLocaleDateString()}
          </Text>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: "25%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Quản lý danh mục</h1>
              <p className="text-gray-500 text-sm mt-1">
                Tổng số danh mục: {filteredCategories.length}
              </p>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Thêm danh mục
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchCategories}
                loading={loading}
              />
            </Space>
          </div>
        }
      >
        <div className="mb-6">
          <Search
            placeholder="Tìm kiếm danh mục..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="w-64"
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredCategories}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} danh mục`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Không có danh mục nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: "active",
            color: "blue",
          }}
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục!" },
              { min: 3, message: "Tên danh mục phải có ít nhất 3 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
              { min: 10, message: "Mô tả phải có ít nhất 10 ký tự!" },
            ]}
          >
            <Input.TextArea placeholder="Nhập mô tả danh mục" rows={4} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="color"
            label="Màu sắc"
            rules={[{ required: true, message: "Vui lòng chọn màu sắc!" }]}
          >
            <Select>
              <Option value="blue">Xanh dương</Option>
              <Option value="green">Xanh lá</Option>
              <Option value="red">Đỏ</Option>
              <Option value="yellow">Vàng</Option>
              <Option value="purple">Tím</Option>
              <Option value="cyan">Xanh ngọc</Option>
              <Option value="orange">Cam</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
