import React, { useEffect, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../../database/db";
import { formatDate } from "../utils/formatDate";
import { toSlug } from "../utils/toSlug";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";
import SkeletonLoading from "../components/SkeletonLoading";
import ProjectCard from "../components/ProjectCard";

function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const itemsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(itemsData);
      } catch (error) {
        console.error("Error fetching items: ", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchItems();
  }, []);

  // Dùng useMemo để tính toán danh sách một cách tối ưu
  const banner = useMemo(() => {
    // Sắp xếp theo thời gian đăng mới nhất và lấy 3 dự án đầu tiên
    return [...items]
      .sort((a, b) => b.publish_date?.toDate() - a.publish_date?.toDate())
      .slice(0, 3);
  }, [items]);
  const popular = useMemo(
    () => items.filter((item) => item.position === "Dự Án Nổi Bật"),
    [items]
  );
  const latest = useMemo(
    () => items.filter((item) => item.position === "Phát Triển Mới Nhất"),
    [items]
  );
  const applyTech = useMemo(
    () => items.filter((item) => item.position === "Ứng Dụng Công Nghệ"),
    [items]
  );

  // Lọc danh sách yêu thích từ localStorage thay vì gọi Firestore lần nữa
  const likeProjects = useMemo(() => {
    const storedSlugs = JSON.parse(localStorage.getItem("likedProjects")) || [];
    return items.filter((item) => storedSlugs.includes(item.slug));
  }, [items]);

  return (
    <div className="">
      <div className="md:mb-4 mb-2 mt-4 w-full transparent rounded-xl">
        {loading ? (
          Array.from({ length: 1 }).map((_, index) => (
            <SkeletonLoading key={index} />
          ))
        ) : (
          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            {banner &&
              banner.map((item) => (
                <SwiperSlide
                  key={item.id}
                  style={{
                    borderRadius: "16px",
                  }}
                >
                  <Link
                    to={`/${toSlug(item?.category)}/${item?.slug}`}
                    className="w-full md:h-[300px] h-[200px] rounded-xl block"
                  >
                    <img
                      src={item?.thumbnail_image.url}
                      className="w-full h-full rounded-xl object-cover"
                      loading="lazy"
                      alt={item.title}
                    />
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        )}
      </div>

      {likeProjects.length > 0 && (
        <div className="md:mt-12 mt-6">
          <div className="mt-4">
            <div className="flex items-center justify-between ">
              <div>
                <h1 className="font-bold md:text-2xl text-xl text-blue-500 dark:text-white py-2">
                  Dự Án Yêu Thích
                </h1>
                <div className="w-[100px] h-[2px] rounded-md bg-blue-200"></div>
              </div>
              <Link
                to={"/du-an-yeu-thich"}
                className="text-blue-500 hover:text-blue-600 dark:text-white transition-all"
              >
                Tất cả
              </Link>
            </div>
            <div className="w-full mt-6">
              <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                {loading
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <SkeletonLoading key={index} />
                    ))
                  : likeProjects
                      .slice(0, 3)
                      .map((item) => (
                        <ProjectCard item={item} key={item.slug} />
                      ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Innovative PCB Gallery */}
      <div className="md:mt-12 mt-6">
        <div className="mt-4">
          <div className="flex items-center justify-between ">
            <div>
              <h1 className="font-bold md:text-2xl text-xl text-blue-500 dark:text-white py-2">
                Phát Triển Mới Nhất
              </h1>
              <div className="w-[100px] h-[2px] rounded-md bg-blue-200"></div>
            </div>
            <Link
              to={"/phat-trien-moi-nhat"}
              className="text-blue-500 hover:text-blue-600 dark:text-white transition-all"
            >
              Tất cả
            </Link>
          </div>
          <div className="w-full mt-6">
            <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
              {loading
                ? // Show skeleton if data is loading
                  Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonLoading key={index} />
                  ))
                : // Render PCB designs when data is available
                  latest &&
                  latest
                    .slice(0, 3)
                    .map((item) => <ProjectCard item={item} key={item.slug} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Explorer Series */}
      <div className="mt-4">
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold md:text-2xl text-xl text-blue-500 dark:text-white py-2">
                Dự Án Nổi Bật
              </h1>
              <div className="w-[100px] h-[2px] rounded-md bg-blue-200"></div>
            </div>
            <Link
              to={"/explorer-series"}
              className="text-blue-500 hover:text-blue-600 dark:text-white transition-all"
            >
              Tất cả
            </Link>
          </div>
          <div className="w-full mt-6">
            <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
              {loading
                ? // Show skeleton if data is loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonLoading key={index} />
                  ))
                : // Render PCB designs when data is available
                  popular &&
                  popular
                    .slice(0, 6)
                    .map((item) => (
                      <ProjectCard item={item} key={items.slug} />
                    ))}
            </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="my-12 w-full h-40 bg-blue-100 rounded-lg">
        <img
          src="https://cdn.dribbble.com/users/1272083/screenshots/3701301/media/22f039852bddbd5d316513c1cb9d9326.jpg?resize=800x600&vertical=center"
          alt=""
          className="w-full h-full rounded-lg object-cover"
        />
      </div>

      {/* Challenge Series */}
      <div className="mt-4">
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-2xl text-blue-500 dark:text-white py-2">
                Ứng Dụng Công Nghệ
              </h1>
              <div className="w-[100px] h-[2px] rounded-md bg-blue-200"></div>
            </div>
            <Link
              to={"/du-an-noi-bat"}
              className="text-blue-500 hover:text-blue-600 dark:text-white transition-all"
            >
              Tất cả
            </Link>
          </div>
          <div className="w-full mt-6">
            <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
              {loading
                ? // Show skeleton if data is loading
                  Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonLoading key={index} />
                  ))
                : // Render PCB designs when data is available
                  applyTech &&
                  applyTech
                    .slice(0, 3)
                    .map((item) => <ProjectCard item={item} key={item.slug} />)}
            </div>
          </div>
        </div>
      </div>

      {/* recent creation */}
      <div className="mt-4 hidden">
        <div>
          <div className="mb-4">
            <h1 className="font-bold text-2xl text-blue-400 py-2">
              Recent Creation
            </h1>
            <div className="w-[100px] h-[2px] rounded-md bg-blue-200"></div>
          </div>
          <div className="flex gap-x-4 w-full bg-white p-3 rounded-lg mt-6">
            <div className="w-[50%] group-hover">
              <div className="w-full h-82 overflow-hidden rounded-lg">
                <img
                  src="https://cdn.dribbble.com/userupload/13149868/file/original-a422b7acba07692e0415e5e12260341c.jpg?resize=2048x1536"
                  alt=""
                  className="w-full h-full object-cover rounded-lg hover:scale-105 transition-all"
                />
              </div>
              <div>
                <div className="flex items-center gap-x-2 p-2">
                  <img
                    src="https://cdn.dribbble.com/users/772985/screenshots/9247897/media/59b9f4624886350945af7b7fd2ee318f.png?resize=1600x1200&vertical=center"
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <h1 className="font-semibold text-sm text-blue-500">
                    Kien Duong Trung
                  </h1>
                  <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                  <span className="text-sm font-base text-gray-400">
                    Oct 20, 2024
                  </span>
                </div>
                <h1 className="my-2 font-semibold text-lg ml-2 text-blue-500 line-clamp-3">
                  Automated Product Counting System Using Arduino and Infrared
                  Sensors
                </h1>
                <span className="font-base text-gray-300 italic">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Nobis, eveniet quod tempora assumenda aspernatur quia.{" "}
                </span>
              </div>
            </div>
            <div className="space-y-4 w-[50%]">
              {[1, 2, 3, 4].map((item) => (
                <div className="flex items-center gap-x-4 w-full">
                  <div className="w-[50%] h-32 overflow-hidden group-hover rounded-lg">
                    <img
                      src="https://cdn.dribbble.com/userupload/8564859/file/original-8e9a80906e6bd6c9769aeb8f215f3511.jpg?resize=2056x1542&vertical=center"
                      alt=""
                      className="w-full h-full hover:scale-105 rounded-lg transition-all"
                    />
                  </div>
                  <div>
                    <h1 className="font-semibold text-lg text-blue-600 mb-2">
                      Automated Product Counting System Using Arduino and
                      Infrared Sensors
                    </h1>
                    <span className="font-base text-md text-gray-400 italic">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Voluptatum, ....
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 mt-8 gap-x-4 hidden">
        {[1, 2, 3, 4].map((item) => (
          <div className="w-full h-full overflow-hidden rounded-lg">
            <img
              src="https://cdn.dribbble.com/users/2530840/screenshots/5420157/media/a8805b0d65e2c1100e48c0ea734c9e43.png?resize=1200x900&vertical=center"
              alt=""
              className="rounded-lg w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
