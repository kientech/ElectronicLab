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
  Badge,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
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

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Lỗi khi tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(value.toLowerCase()) ||
        user.email?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || "user",
      status: user.status || "active",
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      message.success("Xóa người dùng thành công!");
      fetchUsers();
    } catch (error) {
      message.error("Lỗi khi xóa người dùng!");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await updateDoc(doc(db, "users", editingUser.id), {
          ...values,
          updated_at: new Date(),
        });
        message.success("Cập nhật người dùng thành công!");
      } else {
        await addDoc(collection(db, "users"), {
          ...values,
          created_at: new Date(),
          updated_at: new Date(),
        });
        message.success("Thêm người dùng thành công!");
      }
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      message.error("Lỗi khi lưu người dùng!");
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "red";
      case "editor":
        return "blue";
      case "user":
        return "green";
      default:
        return "default";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "editor":
        return "Biên tập viên";
      case "user":
        return "Người dùng";
      default:
        return role;
    }
  };

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "name",
      key: "name",
      width: "25%",
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar src={record.avatar} icon={<UserOutlined />} size="large" />
          <div>
            <Text strong className="block">
              {text}
            </Text>
            <Text type="secondary" className="text-xs">
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Thông tin",
      key: "info",
      width: "25%",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MailOutlined className="text-gray-400" />
            <Text type="secondary" className="text-xs">
              {record.email}
            </Text>
          </div>
          {record.phone && (
            <div className="flex items-center gap-2">
              <PhoneOutlined className="text-gray-400" />
              <Text type="secondary" className="text-xs">
                {record.phone}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Vai trò & Trạng thái",
      key: "role_status",
      width: "20%",
      render: (_, record) => (
        <div className="space-y-2">
          <Tag color={getRoleColor(record.role)}>
            {getRoleText(record.role)}
          </Tag>
          <Badge
            status={record.status === "active" ? "success" : "error"}
            text={record.status === "active" ? "Hoạt động" : "Không hoạt động"}
          />
        </div>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      width: "15%",
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
      width: "15%",
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
            title="Bạn có chắc chắn muốn xóa người dùng này?"
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
              <h1 className="text-xl font-semibold">Quản lý người dùng</h1>
              <p className="text-gray-500 text-sm mt-1">
                Tổng số người dùng: {filteredUsers.length}
              </p>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Thêm người dùng
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchUsers}
                loading={loading}
              />
            </Space>
          </div>
        }
      >
        <div className="mb-6">
          <Search
            placeholder="Tìm kiếm theo tên hoặc email..."
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
          dataSource={filteredUsers}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} người dùng`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Không có người dùng nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      <Modal
        title={editingUser ? "Sửa người dùng" : "Thêm người dùng"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            role: "user",
            status: "active",
          }}
        >
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên!" },
              { min: 3, message: "Họ và tên phải có ít nhất 3 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input
              placeholder="Nhập số điện thoại"
              prefix={<PhoneOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select>
              <Option value="admin">Quản trị viên</Option>
              <Option value="editor">Biên tập viên</Option>
              <Option value="user">Người dùng</Option>
            </Select>
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
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
