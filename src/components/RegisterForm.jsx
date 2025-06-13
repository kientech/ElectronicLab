import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Form,
  Input,
  Button,
  Card,
  Divider,
  message,
  Space,
  Typography,
  Alert,
  Select,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../database/db";

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterForm = ({ onClose }) => {
  const { signup } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const userCredential = await signup(values.email, values.password);

      // Lưu thông tin user vào Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: values.email,
        displayName: values.displayName,
        phone: values.phone,
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      message.success("Đăng ký thành công!");
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
      message.error("Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <Title level={2}>Đăng Ký Tài Khoản</Title>
        <Text type="secondary">Tạo tài khoản mới để bắt đầu</Text>
      </div>

      {error && (
        <Alert
          message="Lỗi đăng ký"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="displayName"
          rules={[
            { required: true, message: "Vui lòng nhập tên hiển thị!" },
            { min: 3, message: "Tên hiển thị phải có ít nhất 3 ký tự!" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Tên hiển thị"
            autoComplete="name"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^[0-9]{10,11}$/,
              message: "Số điện thoại không hợp lệ!",
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Số điện thoại"
            autoComplete="tel"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Xác nhận mật khẩu"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            Đăng Ký
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <Text>
            Đã có tài khoản?{" "}
            <Link to="/login" onClick={onClose}>
              Đăng nhập ngay
            </Link>
          </Text>
        </div>
      </Form>
    </Card>
  );
};

export default RegisterForm;
