import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaLaptopCode } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { BsThreads } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { GiCircuitry } from "react-icons/gi";
import { IoTabletPortraitOutline } from "react-icons/io5";
import { FaAppStoreIos } from "react-icons/fa";
import { GrVirtualMachine } from "react-icons/gr";
import { GiLogicGateNor } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";

const whatIDo = [
  {
    id: 0,
    icon: <FaChalkboardTeacher size={40} color={"#60A5FA"} />,
    title: "Giảng Viên Lập Trình",
    description:
      "Hướng dẫn học viên từ lập trình cơ bản đến nâng cao. Tập trung vào các dự án thực hành giúp việc lập trình trở nên thiết thực và hấp dẫn. Cam kết trang bị cho các chuyên gia công nghệ tương lai những kỹ năng thiết yếu.",
  },
  {
    id: 5,
    icon: <GiLogicGateNor size={40} color={"#60A5FA"} />,
    title: "Hệ Thống Điều Khiển",
    description:
      "Hệ thống điều khiển kỹ thuật cho máy móc và quy trình công nghiệp để duy trì độ chính xác. Có kỹ năng về điều khiển PID, logic kỹ thuật số và thiết kế mạch. Thiết yếu cho các hệ thống yêu cầu hiệu suất ổn định và đáng tin cậy.",
  },
  {
    id: 1,
    icon: <GiCircuitry size={40} color={"#60A5FA"} />,
    title: "Thiết Kế Mạch Điện",
    description:
      "Thiết kế PCB bao gồm việc tạo ra các bảng mạch in nơi các linh kiện điện tử được kết nối trên một nền tảng mạch, cho phép thiết bị hoạt động chính xác.",
  },
  {
    id: 2,
    icon: <IoTabletPortraitOutline size={40} color={"#60A5FA"} />,
    title: "Hệ Thống Nhúng",
    description:
      "Chuyên thiết kế và tích hợp các hệ thống nhúng cho phép các thiết bị hoạt động độc lập với khả năng điều khiển được tối ưu hóa. Có kinh nghiệm trong việc tạo chương trình cơ sở cho vi điều khiển và bộ xử lý. Lý tưởng cho các ứng dụng IoT, tự động hóa và thiết bị thông minh.",
  },
  {
    id: 3,
    icon: <FaAppStoreIos size={40} color={"#60A5FA"} />,
    title: "Phát Triển Phần Mềm",
    description:
      "Có kỹ năng phát triển các ứng dụng full-stack cho cả nền tảng web và di động. Thành thạo trong việc sử dụng các khuôn khổ hiện đại để xây dựng các ứng dụng có khả năng mở rộng, phản hồi và tập trung vào người dùng. Có kinh nghiệm về JavaScript, Python và các công nghệ liên quan.",
  },
  {
    id: 4,
    icon: <GrVirtualMachine size={40} color={"#60A5FA"} />,
    title: "Trí Tuệ Nhân Tạo",
    description:
      "Triển khai các mô hình học máy để xử lý và phân tích các tập dữ liệu lớn. Tập trung vào nhận dạng mẫu và phân tích dự đoán để thúc đẩy quá trình ra quyết định. Có kinh nghiệm với các công cụ như TensorFlow, scikit-learn và các khuôn khổ học sâu.",
  },
];

const technologyUsed = [
  {
    id: 1,
    image: "/logo-programming/cpp.png",
  },
  {
    id: 2,
    image: "/logo-programming/c.png",
  },
  {
    id: 3,
    image: "/logo-programming/arduino.png",
  },
  {
    id: 4,
    image: "/logo-programming/esp32.jpeg",
  },
  {
    id: 5,
    image: "/logo-programming/flutter.svg",
  },
  {
    id: 6,
    image: "/logo-programming/js.png",
  },
  {
    id: 7,
    image: "/logo-programming/python.png",
  },
  {
    id: 8,
    image: "/logo-programming/easyeda.png",
  },
  {
    id: 9,
    image: "/logo-programming/nodejs.png",
  },
  {
    id: 10,
    image: "/logo-programming/pic.jpg",
  },
  {
    id: 11,
    image: "/logo-programming/rasberry.png",
  },
  {
    id: 12,
    image: "/logo-programming/mongodb.svg",
  },
  {
    id: 13,
    image: "/logo-programming/reactjs.png",
  },
  {
    id: 14,
    image: "/logo-programming/stm32.svg",
  },
];

function AboutMe() {
  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex gap-5">
        <div className="w-[40%] rounded-xl h-[530px]">
          <img
            src="/me.jpg"
            alt="Duong Trung Kien"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="w-[60%] h-[500px] py-2">
          <h1 className="text-lg text-gray-500 font-base">
            👋 Chào Mừng Các Bạn!
          </h1>
          <h1 className="text-3xl font-bold text-gray-800 my-2">
            Tôi là <span className="text-blue-600">Dương Trung Kiên</span>
          </h1>
          <p className="font-base leading-relaxed text-md text-gray-700">
            Xin chào! Tôi là Kiên, một lập trình viên đam mê công nghệ, đặc biệt
            trong lĩnh vực điện tử, hệ thống nhúng và phát triển ứng dụng. Hiện
            tại, tôi giảng dạy lập trình tại MindX Technology School, nơi tôi có
            cơ hội chia sẻ kinh nghiệm và hướng dẫn học viên từ những kiến thức
            cơ bản đến các dự án thực tế. <br /> Tôi không chỉ tập trung vào lập
            trình nhúng và thiết kế mạch mà còn kết hợp phát triển web và ứng
            dụng di động để xây dựng các hệ thống thông minh. Từ việc tạo ra các
            thiết bị IoT có thể điều khiển qua app, đến việc kết nối cảm biến
            với hệ thống xử lý dữ liệu trên web, tôi luôn tìm kiếm cách tối ưu
            hóa và mở rộng khả năng ứng dụng công nghệ vào đời sống. <br /> Đối
            với tôi, lập trình không chỉ là viết code mà là giải quyết vấn đề,
            tối ưu hệ thống và tạo ra những sản phẩm hữu ích. Tôi mong muốn
            truyền cảm hứng cho thế hệ trẻ, giúp họ không chỉ học lập trình mà
            còn biết cách ứng dụng nó vào thực tế để tạo ra những giải pháp sáng
            tạo, hiệu quả.
          </p>

          <div className="mt-1 flex items-end">
            <div className="p-2 w-1/2">
              <h1 className="my-2">Kết Bạn Với Tôi</h1>
              <div className="flex items-center gap-x-2 w-full">
                <Link to={"/"} className="p-4 bg-blue-50 rounded-lg">
                  <FaFacebookF />
                </Link>
                <Link to={"/"} className="p-4 bg-blue-50 rounded-lg">
                  <FaInstagram />
                </Link>
                <Link to={"/"} className="p-4 bg-blue-50 rounded-lg">
                  <BsThreads />
                </Link>
                <Link to={"/"} className="p-4 bg-blue-50 rounded-lg">
                  <FaYoutube />
                </Link>
              </div>
            </div>

            <div className="mt-8 w-[50%]">
              <Link
                to={"/"}
                className="py-4 px-8 bg-blue-50 rounded-lg text-center block mb-2 w-full text-blue-500"
              >
                Xem CV
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="my-16">
        <h1 className="font-bold text-3xl text-gray-800 my-2 mb-4">
          Công Việc & Đam Mê
        </h1>
        <div className="grid grid-cols-3 gap-5">
          {whatIDo.map((item) => (
            <div className="py-8 pl-8 pr-2 bg-white shadow-sm rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
              <span>{item.icon}</span>
              <div className="my-4">
                <h1 className="font-semibold text-2xl mb-2">{item.title}</h1>
                <p className="line-clamp-3 text-[#a3a3a3]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="my-16">
        <h1 className="font-bold text-2xl text-gray-800">Công Nghệ Sử Dụng</h1>
        <div className="grid grid-cols-5 gap-5 mt-6">
          {technologyUsed.map((item) => (
            <div className="p-4 bg-white shadow-sm rounded-lg">
              <img
                src={item.image}
                className="w-1/2 h-full rounded-lg object-cover mx-auto"
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
