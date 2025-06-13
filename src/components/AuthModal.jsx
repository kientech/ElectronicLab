import React, { useState } from "react";
import { Modal, Tabs } from "antd";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthModal = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState("1");

  const items = [
    {
      key: "1",
      label: "Đăng nhập",
      children: <LoginForm onSuccess={onClose} />,
    },
    {
      key: "2",
      label: "Đăng ký",
      children: <RegisterForm onSuccess={onClose} />,
    },
  ];

  return (
    <Modal
      title="Đăng nhập / Đăng ký"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        centered
      />
    </Modal>
  );
};

export default AuthModal;
