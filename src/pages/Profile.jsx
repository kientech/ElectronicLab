import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Spin, Card, Avatar, Upload } from "antd";
import {
  UserOutlined,
  MailOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { auth, db } from "../../database/db";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile, updateEmail } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    bio: "",
  });

  const [currentPhotoURL, setCurrentPhotoURL] = useState(
    "https://via.placeholder.com/150"
  );
  const [uploading, setUploading] = useState(false);

  const { refreshUserData } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const email = currentUser.email || "";
        const displayName = currentUser.displayName || "";
        const photoURL =
          currentUser.photoURL || "https://via.placeholder.com/150";

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const firestoreData = userDocSnap.data();
          setUserProfile({
            displayName: firestoreData.displayName || displayName,
            email: firestoreData.email || email,
            photoURL: firestoreData.photoURL || photoURL,
            bio: firestoreData.bio || "",
          });
          form.setFieldsValue({
            displayName: firestoreData.displayName || displayName,
            email: firestoreData.email || email,
            bio: firestoreData.bio || "",
            photoURL: firestoreData.photoURL || photoURL,
          });
          setCurrentPhotoURL(firestoreData.photoURL || photoURL);
        } else {
          setUserProfile({
            displayName,
            email,
            photoURL,
            bio: "",
          });
          form.setFieldsValue({
            displayName,
            email,
            bio: "",
            photoURL,
          });
          setCurrentPhotoURL(photoURL);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        message.error("Lỗi khi tải thông tin cá nhân!");
      } finally {
        setLoading(false);
      }
    } else {
      message.info("Người dùng chưa đăng nhập.");
      setLoading(false);
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên file JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
    }
    if (isJpgOrPng && isLt2M) {
      setUploading(true);
      getBase64(file, (url) => {
        setCurrentPhotoURL(url);
        form.setFieldsValue({ photoURL: url });
        setUploading(false);
      });
    }
    return false;
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        if (currentUser.displayName !== values.displayName) {
          await updateProfile(currentUser, {
            displayName: values.displayName,
          });
        }

        if (currentUser.email !== values.email) {
          await updateEmail(currentUser, values.email);
        }

        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(
          userDocRef,
          {
            displayName: values.displayName,
            email: values.email,
            photoURL: values.photoURL,
            bio: values.bio,
          },
          { merge: true }
        );

        message.success("Cập nhật thông tin thành công!");
        fetchUserProfile();
        refreshUserData();
      } catch (error) {
        console.error("Error updating profile:", error);
        message.error(`Lỗi khi cập nhật thông tin: ${error.message}`);
      } finally {
        setSubmitting(false);
      }
    } else {
      message.error("Không tìm thấy người dùng.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  const uploadButton = (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {uploading ? <LoadingOutlined /> : <CameraOutlined />}
      <div className="mt-2 text-gray-500">Upload</div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 flex justify-center items-start min-h-screen">
      <Card
        className="w-full max-w-4xl shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-[#1f1f1f]"
        title={
          <div className="flex flex-col items-center py-4 border-b border-gray-200 dark:border-gray-700">
            <Avatar
              size={100}
              src={currentPhotoURL}
              icon={<UserOutlined />}
              className="mb-4 shadow-md"
            />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
              Thông tin cá nhân
            </h2>
            <p className="text-gray-500 text-base">
              Quản lý thông tin hồ sơ của bạn
            </p>
          </div>
        }
        styles={{ body: { padding: "24px 32px" } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={userProfile}
          className="mt-6"
        >
          <Form.Item
            label={
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Tên hiển thị
              </span>
            }
            name="displayName"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Tên hiển thị của bạn"
              className="rounded-md h-10 border-gray-300 dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Email
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ email!" },
              { type: "email", message: "Địa chỉ email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Địa chỉ email của bạn"
              disabled
              className="rounded-md h-10 border-gray-300 bg-gray-100 dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Ảnh đại diện
              </span>
            }
            name="photoURL"
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={({ onSuccess }) =>
                setTimeout(() => {
                  onSuccess("ok");
                }, 0)
              }
            >
              {currentPhotoURL ? (
                <img
                  src={currentPhotoURL}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label={
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Giới thiệu bản thân
              </span>
            }
            name="bio"
          >
            <Input.TextArea
              rows={5}
              placeholder="Mô tả ngắn về bản thân bạn, sở thích, kinh nghiệm..."
              className="rounded-md border-gray-300 dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
            />
          </Form.Item>

          <Form.Item className="mt-8">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={submitting}
              className="w-full py-2 h-auto text-lg rounded-md font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
