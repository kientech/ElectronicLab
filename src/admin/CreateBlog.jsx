import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../database/db";
import { toSlug } from "../utils/toSlug";
import { toast } from "react-toastify";
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  Card,
  Divider,
  InputNumber,
  Switch,
  Space,
  Tag,
  Tooltip,
  Steps,
  message,
  Row,
  Col,
  Alert,
  Progress,
  Modal,
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
  UploadOutlined,
  PictureOutlined,
  FileOutlined,
  HeartOutlined,
  TagOutlined,
  SendOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { uploadFile } from "../../middleware/uploadFile";
import { categoryOptions } from "../../database/categories";
import { DEFAULT_IMAGE } from "../constants/images";

const { TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

function CreateBlog() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Load tags from database
    const loadTags = async () => {
      try {
        const tagsSnapshot = await getDocs(collection(db, "tags"));
        const tagsData = tagsSnapshot.docs.map((doc) => doc.data().name);
        setTags(tagsData);
      } catch (error) {
        console.error("Error loading tags:", error);
      }
    };
    loadTags();
  }, []);

  const positionList = [
    "Phát Triển Mới Nhất",
    "Dự Án Nổi Bật",
    "Ứng Dụng Công Nghệ",
    "Nền Tảng Kỹ Thuật",
  ];

  const handleImageUpload = async (blobInfo, success, failure) => {
    try {
      const file = blobInfo.blob();
      if (!file.type.startsWith("image/")) {
        throw new Error("Chỉ chấp nhận file hình ảnh.");
      }

      const maxSizeInBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        throw new Error("Kích thước file quá lớn. Tối đa 5MB.");
      }

      const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      success(downloadURL);
    } catch (error) {
      console.error("Upload Error:", error);
      failure("Có lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại.");
    }
  };

  const handleNext = () => {
    const currentValues = form.getFieldsValue();
    setFormData((prev) => ({
      ...prev,
      ...currentValues,
      content: content,
    }));
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    const currentValues = form.getFieldsValue();
    setFormData((prev) => ({
      ...prev,
      ...currentValues,
      content: content,
    }));
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    if (formData.content) {
      setContent(formData.content);
    }
    if (formData) {
      form.setFieldsValue(formData);
    }
  }, [currentStep, formData, form]);

  const handlePreview = () => {
    const currentValues = form.getFieldsValue();
    const previewData = {
      ...formData,
      ...currentValues,
      content: content,
      thumbnail: thumbnailPreview,
    };
    setPreviewData(previewData);
    setShowPreview(true);
  };

  const handleThumbnailChange = (e) => {
    const url = e.target.value;
    setThumbnailPreview(url);
    setFormData((prev) => ({
      ...prev,
      thumbnail: url,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const currentValues = form.getFieldsValue();
      const allData = {
        ...formData,
        ...currentValues,
        content: content,
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

      const blogData = {
        title: allData.title,
        content: content,
        thumbnail_image: allData.thumbnail,
        video_demo: allData.videoDemo || "",
        code_file: codeFileUrl,
        author: allData.author || "Kien Duong Trung",
        view_count: allData.viewCount || 0,
        like_count: allData.likeCount || 0,
        category: allData.category,
        tags: allData.tags || [],
        short_description: allData.shortDescription,
        custom_url: allData.customUrl || "",
        slug: allData.slug,
        publish_date: new Date(),
        status: allData.status || "public",
        position: allData.position,
        isDelete: false,
        last_updated: new Date(),
      };

      await addDoc(collection(db, "blogs"), blogData);
      setUploadProgress(100);

      toast.success("Tạo Dự Án Thành Công!!");

      form.resetFields();
      setContent("");
      setThumbnailPreview(null);
      setCurrentStep(0);
      setFormData({});
      setUploadProgress(0);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Có Lỗi Xảy Ra!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.thumbnail) {
      setThumbnailPreview(formData.thumbnail);
    }
  }, [formData.thumbnail]);

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
              value={content}
              onEditorChange={setContent}
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
                formats: {
                  alignleft: {
                    selector:
                      "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img",
                    classes: "text-left",
                  },
                  aligncenter: {
                    selector:
                      "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img",
                    classes: "text-center",
                  },
                  alignright: {
                    selector:
                      "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img",
                    classes: "text-right",
                  },
                  alignjustify: {
                    selector:
                      "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img",
                    classes: "text-justify",
                  },
                },
                fontsize_formats: "8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt",
                font_family_formats:
                  "Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; AkrutiKndPadmini=Akpdmi-n",
                image_caption: true,
                image_advtab: true,
                image_title: true,
                automatic_uploads: true,
                file_picker_types: "image",
                images_upload_handler: handleImageUpload,
                paste_data_images: true,
                smart_paste: true,
                link_context_toolbar: true,
                link_title: false,
                target_list: [
                  { title: "None", value: "" },
                  { title: "New window", value: "_blank" },
                ],
                table_default_styles: {
                  width: "100%",
                },
                table_class_list: [
                  { title: "None", value: "" },
                  { title: "Bordered", value: "table-bordered" },
                  { title: "Striped", value: "table-striped" },
                ],
                codesample_languages: [
                  { text: "HTML/XML", value: "markup" },
                  { text: "JavaScript", value: "javascript" },
                  { text: "CSS", value: "css" },
                  { text: "PHP", value: "php" },
                  { text: "Ruby", value: "ruby" },
                  { text: "Python", value: "python" },
                  { text: "Java", value: "java" },
                  { text: "C", value: "c" },
                  { text: "C#", value: "csharp" },
                  { text: "C++", value: "cpp" },
                ],
                template_cdate_format:
                  "[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]",
                template_mdate_format:
                  "[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]",
                height: 600,
                min_height: 400,
                max_height: 800,
                autoresize_bottom_margin: 50,
                quickbars_selection_toolbar:
                  "bold italic | quicklink h2 h3 blockquote quickimage quicktable",
                quickbars_insert_toolbar: "quickimage quicktable",
                contextmenu: "link image table configurepermanentpen",
                a11y_advanced_options: true,
                skin: "oxide",
                mobile: {
                  menubar: true,
                },
                menu: {
                  file: {
                    title: "File",
                    items: "newdocument restoredraft | preview | print",
                  },
                  edit: {
                    title: "Edit",
                    items:
                      "undo redo | cut copy paste pastetext | selectall | searchreplace",
                  },
                  view: {
                    title: "View",
                    items:
                      "code | visualaid visualchars visualblocks | spellchecker | preview fullscreen",
                  },
                  insert: {
                    title: "Insert",
                    items:
                      "image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime",
                  },
                  format: {
                    title: "Format",
                    items:
                      "bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align | forecolor backcolor | removeformat",
                  },
                  tools: {
                    title: "Tools",
                    items: "spellchecker spellcheckerlanguage | code wordcount",
                  },
                  table: {
                    title: "Table",
                    items:
                      "inserttable | cell row column | tableprops deletetable",
                  },
                  help: { title: "Help", items: "help" },
                },
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
                  options={tags.map((tag) => ({ value: tag, label: tag }))}
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
                      Xuất bản
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
}

export default CreateBlog;
