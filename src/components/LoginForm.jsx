import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Form,
  Input,
  Button,
  Divider,
  message,
  Space,
  Typography,
  Alert,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
  FacebookOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Text } = Typography;

const LoginForm = ({ onSuccess }) => {
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError("");
      await login(values.email, values.password);
      message.success("Đăng nhập thành công!");
      onSuccess();
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      message.error("Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {error && (
        <Alert
          message="Lỗi đăng nhập"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
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
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            Đăng Nhập
          </Button>
        </Form.Item>

        <div className="text-center mb-4">
          <Link to="/recover-password">Quên mật khẩu?</Link>
        </div>

        <Divider>Hoặc đăng nhập bằng</Divider>

        <Space direction="vertical" className="w-full">
          <Button
            icon={<GoogleOutlined />}
            className="w-full"
            onClick={() => message.info("Tính năng đang phát triển")}
          >
            Google
          </Button>
          <Button
            icon={<FacebookOutlined />}
            className="w-full"
            onClick={() => message.info("Tính năng đang phát triển")}
          >
            Facebook
          </Button>
          <Button
            icon={<GithubOutlined />}
            className="w-full"
            onClick={() => message.info("Tính năng đang phát triển")}
          >
            GitHub
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default LoginForm;
