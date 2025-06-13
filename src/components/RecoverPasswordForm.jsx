import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Form, Input, Button, Card, message, Typography, Alert } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const RecoverPasswordForm = ({ onClose }) => {
  const { resetPassword } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError("");
      await resetPassword(values.email);
      setSuccess(true);
      message.success("Email khôi phục mật khẩu đã được gửi!");
    } catch (error) {
      console.error("Password reset error:", error);
      setError(error.message);
      message.error("Gửi email khôi phục mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <Title level={2}>Kiểm Tra Email</Title>
          <Text type="secondary">
            Chúng tôi đã gửi email hướng dẫn khôi phục mật khẩu đến địa chỉ
            email của bạn.
          </Text>
        </div>
        <div className="text-center mt-4">
          <Link to="/login" onClick={onClose}>
            Quay lại đăng nhập
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <Title level={2}>Khôi Phục Mật Khẩu</Title>
        <Text type="secondary">
          Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu
        </Text>
      </div>

      {error && (
        <Alert
          message="Lỗi khôi phục mật khẩu"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Form
        form={form}
        name="recover"
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            Gửi Email Khôi Phục
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <Text>
            <Link to="/login" onClick={onClose}>
              Quay lại đăng nhập
            </Link>
          </Text>
        </div>
      </Form>
    </Card>
  );
};

export default RecoverPasswordForm;
