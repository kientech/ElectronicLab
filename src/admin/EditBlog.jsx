import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../database/db";
import { toSlug } from "../utils/toSlug";
import { toast } from "react-toastify";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Steps,
  Row,
  Col,
  Alert,
  Progress,
  Modal,
  Upload,
  InputNumber,
  Space,
  Tag,
} from "antd";
import {
  FileImageOutlined,
  VideoCameraOutlined,
  UserOutlined,
  TagsOutlined,
  LinkOutlined,
  EyeOutlined,
  LikeOutlined,
  CloudUploadOutlined,
  SaveOutlined,
  FileZipOutlined,
  GlobalOutlined,
  LockOutlined,
  PictureOutlined,
  FileOutlined,
  HeartOutlined,
  TagOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { uploadFile } from "../../middleware/uploadFile";
import { categoryOptions } from "../../database/categories";
import { DEFAULT_IMAGE } from "../constants/images";

const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [formData, setFormData] = useState({});

  const positionList = [
    "Phát Triển Mới Nhất",
    "Dự Án Nổi Bật",
    "Ứng Dụng Công Nghệ",
    "Nền Tảng Kỹ Thuật",
  ];

  // Load blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setThumbnailPreview(data.thumbnail_image);
          form.setFieldsValue({
            title: data.title,
            thumbnail: data.thumbnail_image,
            videoDemo: data.video_demo,
            author: data.author,
            viewCount: data.view_count || 0,
            likeCount: data.like_count || 0,
            category: data.category,
            tags: data.tags || [],
            shortDescription: data.short_description,
            customUrl: data.custom_url,
            slug: data.slug,
            status: data.status,
            position: data.position || "",
            content: data.content,
          });
        } else {
          toast.error("Bài viết không tồn tại!");
          navigate("/dashboard/all-projects");
        }
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu!");
      }
    };
    fetchBlog();
  }, [id, navigate, form]);

  const handleNext = () => {
    const currentValues = form.getFieldsValue();
    setFormData((prev) => ({
      ...prev,
      ...currentValues,
    }));
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    const currentValues = form.getFieldsValue();
    setFormData((prev) => ({
      ...prev,
      ...currentValues,
    }));
    setCurrentStep(currentStep - 1);
  };

  const handlePreview = () => {
    const currentValues = form.getFieldsValue();
    const previewData = {
      ...formData,
      ...currentValues,
      content: formData.content,
      thumbnail: thumbnailPreview,
    };
    setPreviewData(previewData);
    setShowPreview(true);
  };

  const handleThumbnailChange = (e) => {
    const url = e.target.value;
    setThumbnailPreview(url);
    form.setFieldsValue({ thumbnail: url });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const currentValues = form.getFieldsValue();
      const allData = {
        ...formData,
        ...currentValues,
        content: formData.content,
      };

      const requiredFields = {
        title: "Tiêu đề",
        content: "Nội dung",
        category: "Danh mục",
        position: "Vị trí",
        thumbnail: "Hình ảnh đại diện",
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !allData[key])
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        throw new Error(
          `Vui lòng điền đầy đủ các trường bắt buộc: ${missingFields.join(
            ", "
          )}`
        );
      }

      let codeFileUrl = "";

      if (allData.codeFile?.file) {
        codeFileUrl = await uploadFile(allData.codeFile.file);
        setUploadProgress(90);
      }

      await updateDoc(doc(db, "blogs", id), {
        title: allData.title,
        content: allData.content,
        thumbnail_image: allData.thumbnail,
        video_demo: allData.videoDemo || "",
        code_file: codeFileUrl || allData.code_file,
        author: allData.author || "Kien Duong Trung",
        view_count: allData.viewCount || 0,
        like_count: allData.likeCount || 0,
        category: allData.category,
        tags: allData.tags || [],
        short_description: allData.shortDescription,
        custom_url: allData.customUrl || "",
        slug: allData.slug,
        status: allData.status || "public",
        position: allData.position,
        last_updated: new Date(),
      });

      setUploadProgress(100);
      toast.success("Cập nhật bài viết thành công!");
      navigate("/dashboard/all-projects");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Thông tin cơ bản",
      content: (
        <div className="space-y-6">
          <Alert
            message="Thông tin cơ bản"
            description="Vui lòng điền đầy đủ thông tin cơ bản của dự án."
            type="info"
            showIcon
          />
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="thumbnail"
                label="Hình ảnh đại diện"
                rules={[
                  { required: true, message: "Vui lòng nhập link hình ảnh!" },
                  { type: "url", message: "Vui lòng nhập đúng định dạng URL!" },
                ]}
              >
                <div className="space-y-4">
                  <Input
                    placeholder="Nhập link hình ảnh"
                    onChange={handleThumbnailChange}
                    prefix={<PictureOutlined />}
                  />
                  {thumbnailPreview && (
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">Xem trước:</div>
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGE;
                        }}
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
              >
                <Input
                  placeholder="Nhập tiêu đề bài viết"
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    form.setFieldsValue({ slug: toSlug(newTitle) });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: "Vui lòng nhập slug!" }]}
              >
                <Input placeholder="Slug tự động tạo từ tiêu đề" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="shortDescription"
                label="Mô tả ngắn"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả ngắn!" },
                ]}
              >
                <TextArea rows={4} placeholder="Nhập mô tả ngắn cho bài viết" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categoryOptions.map((cat, index) => (
                    <Option key={index} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="Vị trí"
                rules={[{ required: true, message: "Vui lòng chọn vị trí!" }]}
              >
                <Select placeholder="Chọn vị trí hiển thị">
                  {positionList.map((item, index) => (
                    <Option key={index} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: "Nội dung",
      content: (
        <div className="space-y-6">
          <Alert
            message="Nội dung chính"
            description="Thêm nội dung chi tiết và các tài nguyên cho dự án."
            type="info"
            showIcon
          />
          <Form.Item
            name="content"
            label="Nội dung bài viết"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <Editor
              apiKey="kipc10e7w0fa5b7bozt9l0xwwmoukji25fh9wbyfnbzmuls5"
              onInit={(evt, editor) => {
                const content = form.getFieldValue("content");
                if (content) {
                  editor.setContent(content);
                }
              }}
              onEditorChange={(content, editor) => {
                form.setFieldsValue({ content });
              }}
              init={{
                height: 700,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                  "emoticons",
                  "template",
                  "paste",
                  "hr",
                  "directionality",
                  "nonbreaking",
                  "toc",
                  "visualchars",
                  "imagetools",
                  "textpattern",
                  "noneditable",
                  "charmap",
                  "quickbars",
                  "codesample",
                  "pagebreak",
                ],
                toolbar1:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
                toolbar2:
                  "forecolor backcolor removeformat | subscript superscript | link image media table codesample | charmap emoticons hr | fullscreen preview | code help",
                toolbar3:
                  "insertfile template pagebreak nonbreaking anchor toc | visualchars visualblocks | searchreplace | paste pastetext | ltr rtl",
                content_style: `
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #333;
                    max-width: 100%;
                    padding: 1rem;
                  }
                  p { margin: 0 0 1rem 0; }
                  h1, h2, h3, h4, h5, h6 { margin: 1.5rem 0 1rem; }
                  img { max-width: 100%; height: auto; }
                  pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; }
                  code { font-family: Monaco, Consolas, monospace; }
                  table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
                  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                  blockquote { border-left: 4px solid #ddd; margin: 1rem 0; padding-left: 1rem; }
                `,
              }}
            />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="videoDemo" label="Video Demo">
                <Input
                  placeholder="Nhập ID video YouTube"
                  prefix={<VideoCameraOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="codeFile" label="File đính kèm">
                <Upload maxCount={1} beforeUpload={() => false}>
                  <Button icon={<FileOutlined />}>Tải lên file</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: "Cài đặt & Xuất bản",
      content: (
        <div className="space-y-6">
          <Alert
            message="Cài đặt cuối cùng"
            description="Hoàn tất các cài đặt và xuất bản dự án."
            type="info"
            showIcon
          />
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="author"
                label="Tác giả"
                initialValue="Kien Duong Trung"
                rules={[
                  { required: true, message: "Vui lòng nhập tên tác giả!" },
                ]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" initialValue="public">
                <Select>
                  <Option value="public">
                    <Space>
                      <GlobalOutlined />
                      Công khai
                    </Space>
                  </Option>
                  <Option value="draft">
                    <Space>
                      <LockOutlined />
                      Nháp
                    </Space>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="viewCount" label="Lượt xem">
                <InputNumber
                  min={0}
                  prefix={<EyeOutlined />}
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="likeCount" label="Lượt thích">
                <InputNumber
                  min={0}
                  prefix={<HeartOutlined />}
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tags" label="Thẻ">
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Nhập thẻ và nhấn Enter"
                  tokenSeparators={[","]}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <Card className="shadow-xl rounded-lg overflow-hidden">
        <div className="flex flex-col">
          <Steps current={currentStep} className="mb-8 px-4">
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <Form
            form={form}
            layout="vertical"
            className="flex flex-col"
            initialValues={formData}
            preserve={true}
          >
            <div className="px-6">
              {React.cloneElement(steps[currentStep].content, {
                key: currentStep,
              })}
            </div>

            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t">
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <Button
                    onClick={handlePrev}
                    icon={<ArrowLeftOutlined />}
                    size="large"
                    className="min-w-[120px]"
                  >
                    Quay lại
                  </Button>
                )}
              </div>
              <div className="flex gap-4">
                {currentStep < steps.length - 1 ? (
                  <>
                    <Button
                      onClick={handlePreview}
                      icon={<EyeOutlined />}
                      size="large"
                      className="min-w-[120px]"
                    >
                      Xem trước
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleNext}
                      icon={<ArrowRightOutlined />}
                      size="large"
                      className="min-w-[120px]"
                    >
                      Tiếp tục
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handlePreview}
                      icon={<EyeOutlined />}
                      size="large"
                      className="min-w-[120px]"
                    >
                      Xem trước
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      loading={loading}
                      icon={<SendOutlined />}
                      size="large"
                      className="min-w-[120px]"
                    >
                      Cập nhật
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Form>
        </div>
      </Card>

      <Modal
        title="Xem trước bài viết"
        open={showPreview}
        onCancel={() => setShowPreview(false)}
        width={800}
        footer={null}
      >
        {previewData && (
          <div className="space-y-6">
            <div className="relative">
              {previewData.thumbnail && (
                <img
                  src={previewData.thumbnail}
                  alt="Thumbnail"
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h1 className="text-2xl font-bold text-white">
                  {previewData.title}
                </h1>
                <div className="text-gray-200">
                  {previewData.shortDescription}
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <UserOutlined />
                <span>{previewData.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <EyeOutlined />
                <span>{previewData.viewCount || 0} lượt xem</span>
              </div>
              <div className="flex items-center gap-1">
                <HeartOutlined />
                <span>{previewData.likeCount || 0} lượt thích</span>
              </div>
            </div>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: previewData.content }}
            />
            {previewData.tags && previewData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {previewData.tags.map((tag, index) => (
                  <Tag key={index} color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {uploadProgress > 0 && (
        <Modal
          title="Đang tải lên"
          open={uploadProgress > 0}
          footer={null}
          closable={false}
        >
          <Progress percent={uploadProgress} status="active" />
          <div className="mt-4 text-center text-gray-500">
            Đang tải lên dữ liệu, vui lòng đợi...
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditBlog;
