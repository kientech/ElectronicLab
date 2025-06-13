import React, { useState } from "react";
import {
  IoChatbubblesOutline,
  IoCallOutline,
  IoTimeOutline,
  IoMailOutline,
} from "react-icons/io5";
import {
  MdOutlineAlternateEmail,
  MdOutlineSupportAgent,
  MdOutlineBusinessCenter,
} from "react-icons/md";
import {
  FaInstagram,
  FaFacebookF,
  FaGithub,
  FaLinkedin,
  FaTelegram,
} from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Card,
  Divider,
  Space,
  Typography,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../database/db";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

function ContactMe() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await addDoc(collection(db, "contacts"), {
        ...values,
        created_at: new Date(),
        status: "pending",
        type: activeTab === "1" ? "hỗ trợ" : "hợp tác",
      });
      message.success(
        "Tin nhắn của bạn đã được gửi thành công. Tôi sẽ liên hệ lại trong thời gian sớm nhất."
      );
      form.resetFields();
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = {
    email: "duongtrungkien.dev@gmail.com",
    phone: "0968 384 643",
    address: "Quận 9, TP. Hồ Chí Minh, Việt Nam",
    workingHours: "Thứ 2 - Thứ 7: 8:00 - 17:00",
    support: {
      email: "duongtrungkien.dev@gmail.com",
      phone: "0968 384 643",
      hours: "Linh hoạt",
    },
    social: {
      facebook: "https://facebook.com/your_facebook",
      github: "https://github.com/your_github",
      linkedin: "https://linkedin.com/in/your_linkedin",
      instagram: "https://instagram.com/your_instagram",
      telegram: "https://t.me/your_telegram",
    },
    services: [
      {
        name: "Phát triển Web & App",
        description:
          "Thiết kế và phát triển website, ứng dụng di động đa nền tảng",
        items: ["Website", "Web App", "Mobile App", "Progressive Web App"],
      },
      {
        name: "IoT & Nhúng",
        description: "Phát triển hệ thống IoT và lập trình nhúng",
        items: ["Arduino", "Raspberry Pi", "ESP32", "STM32", "Sensors"],
      },
      {
        name: "Đào tạo",
        description: "Đào tạo lập trình và phát triển kỹ năng",
        items: ["Lập trình Web", "IoT cơ bản", "Điện tử cơ bản", "Automation"],
      },
      {
        name: "Tư vấn & Hỗ trợ",
        description: "Tư vấn giải pháp và hỗ trợ kỹ thuật",
        items: ["Tư vấn dự án", "Hỗ trợ kỹ thuật", "Bảo trì hệ thống"],
      },
    ],
    projects: [
      {
        name: "Smart Home System",
        description: "Hệ thống nhà thông minh tích hợp IoT",
        technologies: ["ESP32", "React", "Node.js", "MQTT"],
        rating: 4.8,
      },
      {
        name: "Industrial Monitoring",
        description: "Hệ thống giám sát công nghiệp",
        technologies: ["STM32", "LoRaWAN", "React", "MongoDB"],
        rating: 4.9,
      },
      {
        name: "E-learning Platform",
        description: "Nền tảng học trực tuyến về điện tử",
        technologies: ["React", "Node.js", "WebRTC", "Firebase"],
        rating: 4.7,
      },
    ],
  };

  const faqItems = [
    {
      question: "Các khóa học có phù hợp với người mới bắt đầu không?",
      answer:
        "Có, các khóa học được thiết kế phù hợp với nhiều đối tượng, từ người mới bắt đầu đến nâng cao.",
    },
    {
      question: "Chi phí phát triển một dự án IoT như thế nào?",
      answer:
        "Chi phí sẽ phụ thuộc vào quy mô và yêu cầu cụ thể của dự án. Hãy liên hệ để được tư vấn chi tiết.",
    },
    {
      question: "Thời gian hoàn thành một dự án trung bình là bao lâu?",
      answer:
        "Thông thường từ 1-3 tháng tùy theo quy mô. Dự án lớn có thể kéo dài hơn.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <Title level={2} className="text-gray-800">
            Liên Hệ Với Tôi
          </Title>
          <Text className="text-gray-600 text-lg block mt-2">
            Tôi nhận thiết kế website, phát triển ứng dụng di động, làm các dự
            án IoT và đào tạo lập trình. Nếu bạn có ý tưởng hoặc dự án cần thực
            hiện, hãy liên hệ để chúng ta có thể trao đổi chi tiết hơn.
          </Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <Tabs defaultActiveKey="1" onChange={setActiveTab}>
                <TabPane tab="Yêu cầu tư vấn" key="1">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="w-full"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="firstName"
                        label="Họ"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập họ của bạn",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập họ của bạn" />
                      </Form.Item>
                      <Form.Item
                        name="lastName"
                        label="Tên"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên của bạn",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập tên của bạn" />
                      </Form.Item>
                    </div>

                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập email của bạn",
                        },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input placeholder="Nhập email của bạn" />
                    </Form.Item>

                    <Form.Item
                      name="service"
                      label="Dịch vụ quan tâm"
                      rules={[
                        { required: true, message: "Vui lòng chọn dịch vụ" },
                      ]}
                    >
                      <Select placeholder="Chọn dịch vụ bạn quan tâm">
                        <Option value="web">Phát triển Web & App</Option>
                        <Option value="iot">IoT & Nhúng</Option>
                        <Option value="training">Đào tạo</Option>
                        <Option value="consulting">Tư vấn & Hỗ trợ</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="message"
                      label="Nội dung"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung tin nhắn",
                        },
                      ]}
                    >
                      <TextArea
                        rows={6}
                        placeholder="Mô tả chi tiết nhu cầu của bạn..."
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full"
                        size="large"
                      >
                        Gửi yêu cầu tư vấn
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
                <TabPane tab="Đề xuất hợp tác" key="2">
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="w-full"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        name="company"
                        label="Tên công ty"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên công ty",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập tên công ty của bạn" />
                      </Form.Item>
                      <Form.Item
                        name="position"
                        label="Chức vụ"
                        rules={[
                          { required: true, message: "Vui lòng nhập chức vụ" },
                        ]}
                      >
                        <Input placeholder="Nhập chức vụ của bạn" />
                      </Form.Item>
                    </div>

                    <Form.Item
                      name="email"
                      label="Email công ty"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập email công ty",
                        },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input placeholder="Nhập email công ty" />
                    </Form.Item>

                    <Form.Item
                      name="projectType"
                      label="Loại dự án"
                      rules={[
                        { required: true, message: "Vui lòng chọn loại dự án" },
                      ]}
                    >
                      <Select placeholder="Chọn loại dự án">
                        <Option value="iot">Hệ thống IoT</Option>
                        <Option value="automation">Tự động hóa</Option>
                        <Option value="webapp">Web/App Development</Option>
                        <Option value="training">Đào tạo nội bộ</Option>
                        <Option value="other">Khác</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="message"
                      label="Nội dung đề xuất"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung đề xuất",
                        },
                      ]}
                    >
                      <TextArea
                        rows={6}
                        placeholder="Mô tả chi tiết về dự án và mong muốn hợp tác..."
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full"
                        size="large"
                      >
                        Gửi đề xuất hợp tác
                      </Button>
                    </Form.Item>
                  </Form>
                </TabPane>
              </Tabs>
            </Card>

            <Card className="shadow-sm mt-8">
              <Title level={4} className="text-gray-800 mb-4">
                Dự án tiêu biểu
              </Title>
              <div className="space-y-6">
                {contactInfo.projects.map((project, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Text strong className="text-lg">
                          {project.name}
                        </Text>
                        <Paragraph className="text-gray-600 mt-2">
                          {project.description}
                        </Paragraph>
                        <div className="flex gap-2 mt-2">
                          {project.technologies.map((tech, techIndex) => (
                            <Tag key={techIndex} color="blue">
                              {tech}
                            </Tag>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <Text className="text-blue-600 font-semibold">
                          {project.rating}/5
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="shadow-sm mt-8">
              <Title level={4} className="text-gray-800 mb-4">
                Câu hỏi thường gặp
              </Title>
              <div className="space-y-6">
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <Text strong className="text-lg">
                      {item.question}
                    </Text>
                    <Paragraph className="text-gray-600 mt-2">
                      {item.answer}
                    </Paragraph>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Title level={4} className="text-gray-800">
                    Thông tin liên hệ
                  </Title>
                  <Divider className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <IoCallOutline className="text-gray-600 mt-1" size={20} />
                      <div>
                        <Text strong>Điện thoại</Text>
                        <div className="text-gray-600">{contactInfo.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MdOutlineAlternateEmail
                        className="text-gray-600 mt-1"
                        size={20}
                      />
                      <div>
                        <Text strong>Email</Text>
                        <div className="text-gray-600">{contactInfo.email}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CiLocationOn className="text-gray-600 mt-1" size={20} />
                      <div>
                        <Text strong>Địa chỉ</Text>
                        <div className="text-gray-600">
                          {contactInfo.address}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <IoTimeOutline className="text-gray-600 mt-1" size={20} />
                      <div>
                        <Text strong>Giờ làm việc</Text>
                        <div className="text-gray-600">
                          {contactInfo.workingHours}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Title level={4} className="text-gray-800">
                    Hỗ trợ khách hàng
                  </Title>
                  <Divider className="my-4" />
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MdOutlineSupportAgent
                        className="text-gray-600 mt-1"
                        size={20}
                      />
                      <div>
                        <Text strong>Hotline hỗ trợ</Text>
                        <div className="text-gray-600">
                          {contactInfo.support.phone}
                        </div>
                        <Text type="secondary" className="text-sm">
                          Hỗ trợ 24/7
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MdOutlineAlternateEmail
                        className="text-gray-600 mt-1"
                        size={20}
                      />
                      <div>
                        <Text strong>Email hỗ trợ</Text>
                        <div className="text-gray-600">
                          {contactInfo.support.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Title level={4} className="text-gray-800">
                    Dịch vụ của chúng tôi
                  </Title>
                  <Divider className="my-4" />
                  <div className="space-y-6">
                    {contactInfo.services.map((service, index) => (
                      <div key={index} className="space-y-2">
                        <Text strong className="text-lg">
                          {service.name}
                        </Text>
                        <Paragraph className="text-gray-600">
                          {service.description}
                        </Paragraph>
                        <div className="flex flex-wrap gap-2">
                          {service.items.map((item, itemIndex) => (
                            <Tag key={itemIndex} color="blue">
                              {item}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Title level={4} className="text-gray-800">
                    Kết nối với tôi
                  </Title>
                  <Divider className="my-4" />
                  <div className="flex flex-wrap gap-3">
                    <Tooltip title="Facebook">
                      <a
                        href={contactInfo.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FaFacebookF className="text-blue-600" size={20} />
                      </a>
                    </Tooltip>
                    <Tooltip title="GitHub">
                      <a
                        href={contactInfo.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FaGithub className="text-gray-800" size={20} />
                      </a>
                    </Tooltip>
                    <Tooltip title="LinkedIn">
                      <a
                        href={contactInfo.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FaLinkedin className="text-blue-600" size={20} />
                      </a>
                    </Tooltip>
                    <Tooltip title="Instagram">
                      <a
                        href={contactInfo.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                      >
                        <FaInstagram className="text-pink-600" size={20} />
                      </a>
                    </Tooltip>
                    <Tooltip title="Telegram">
                      <a
                        href={contactInfo.social.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FaTelegram className="text-blue-500" size={20} />
                      </a>
                    </Tooltip>
                  </div>
                </div>
              </Space>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactMe;
