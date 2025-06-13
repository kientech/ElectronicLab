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
  Typography,
  Empty,
  Switch,
  Divider,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  LockOutlined,
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

const Roles = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRole, setEditingRole] = useState(null);

  const permissions = [
    {
      key: "posts",
      label: "Quản lý bài viết",
      children: [
        { key: "posts.view", label: "Xem bài viết" },
        { key: "posts.create", label: "Tạo bài viết" },
        { key: "posts.edit", label: "Sửa bài viết" },
        { key: "posts.delete", label: "Xóa bài viết" },
      ],
    },
    {
      key: "categories",
      label: "Quản lý danh mục",
      children: [
        { key: "categories.view", label: "Xem danh mục" },
        { key: "categories.create", label: "Tạo danh mục" },
        { key: "categories.edit", label: "Sửa danh mục" },
        { key: "categories.delete", label: "Xóa danh mục" },
      ],
    },
    {
      key: "users",
      label: "Quản lý người dùng",
      children: [
        { key: "users.view", label: "Xem người dùng" },
        { key: "users.create", label: "Tạo người dùng" },
        { key: "users.edit", label: "Sửa người dùng" },
        { key: "users.delete", label: "Xóa người dùng" },
      ],
    },
    {
      key: "roles",
      label: "Quản lý vai trò",
      children: [
        { key: "roles.view", label: "Xem vai trò" },
        { key: "roles.create", label: "Tạo vai trò" },
        { key: "roles.edit", label: "Sửa vai trò" },
        { key: "roles.delete", label: "Xóa vai trò" },
      ],
    },
    {
      key: "settings",
      label: "Cài đặt",
      children: [
        { key: "settings.view", label: "Xem cài đặt" },
        { key: "settings.edit", label: "Sửa cài đặt" },
      ],
    },
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const rolesRef = collection(db, "roles");
      const querySnapshot = await getDocs(rolesRef);
      const rolesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRoles(rolesData);
      setFilteredRoles(rolesData);
    } catch (error) {
      console.error("Error fetching roles:", error);
      message.error("Lỗi khi tải danh sách vai trò!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = roles.filter((role) =>
      role.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRoles(filtered);
  };

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions || [],
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "roles", id));
      message.success("Xóa vai trò thành công!");
      fetchRoles();
    } catch (error) {
      message.error("Lỗi khi xóa vai trò!");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        await updateDoc(doc(db, "roles", editingRole.id), {
          ...values,
          updated_at: new Date(),
        });
        message.success("Cập nhật vai trò thành công!");
      } else {
        await addDoc(collection(db, "roles"), {
          ...values,
          created_at: new Date(),
          updated_at: new Date(),
        });
        message.success("Thêm vai trò thành công!");
      }
      setIsModalVisible(false);
      fetchRoles();
    } catch (error) {
      console.error("Error saving role:", error);
      message.error("Lỗi khi lưu vai trò!");
    }
  };

  const columns = [
    {
      title: "Vai trò",
      dataIndex: "name",
      key: "name",
      width: "20%",
      render: (text, record) => (
        <div>
          <Text strong className="block">
            {text}
          </Text>
          <Text type="secondary" className="text-xs">
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: "Quyền hạn",
      key: "permissions",
      width: "50%",
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.permissions?.map((permission) => (
            <Tag key={permission} color="blue">
              {permission}
            </Tag>
          ))}
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
            title="Bạn có chắc chắn muốn xóa vai trò này?"
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
              <h1 className="text-xl font-semibold">Quản lý vai trò</h1>
              <p className="text-gray-500 text-sm mt-1">
                Tổng số vai trò: {filteredRoles.length}
              </p>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                Thêm vai trò
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchRoles}
                loading={loading}
              />
            </Space>
          </div>
        }
      >
        <div className="mb-6">
          <Search
            placeholder="Tìm kiếm vai trò..."
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
          dataSource={filteredRoles}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} vai trò`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Không có vai trò nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      <Modal
        title={editingRole ? "Sửa vai trò" : "Thêm vai trò"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên vai trò"
            rules={[
              { required: true, message: "Vui lòng nhập tên vai trò!" },
              { min: 3, message: "Tên vai trò phải có ít nhất 3 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên vai trò" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
              { min: 10, message: "Mô tả phải có ít nhất 10 ký tự!" },
            ]}
          >
            <Input.TextArea placeholder="Nhập mô tả vai trò" rows={4} />
          </Form.Item>

          <Divider orientation="left">Quyền hạn</Divider>

          <Form.Item
            name="permissions"
            label="Chọn quyền hạn"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một quyền hạn!",
              },
            ]}
          >
            <div className="space-y-4">
              {permissions.map((group) => (
                <div key={group.key} className="space-y-2">
                  <Text strong>{group.label}</Text>
                  <div className="grid grid-cols-2 gap-2">
                    {group.children.map((permission) => (
                      <Form.Item
                        key={permission.key}
                        name={["permissions", permission.key]}
                        valuePropName="checked"
                        noStyle
                      >
                        <Switch
                          checkedChildren="Có"
                          unCheckedChildren="Không"
                          defaultChecked={editingRole?.permissions?.includes(
                            permission.key
                          )}
                        />{" "}
                        {permission.label}
                      </Form.Item>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Roles;
