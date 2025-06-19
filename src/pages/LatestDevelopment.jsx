import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../../database/db";
import ProjectCard from "../components/ProjectCard";
import {
  Pagination,
  Select,
  Input,
  DatePicker,
  Button,
  Drawer,
  Skeleton,
} from "antd";
import SkeletonLoading from "../components/SkeletonLoading";

const { RangePicker } = DatePicker;

function LatestDevelopment() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    searchTerm: "",
    selectedCategory: null,
    selectedTags: [],
    dateRange: null,
  });
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const itemsData = querySnapshot.docs.map((doc) => doc.data());
        const itemsFilter = itemsData.filter(
          (item) => item.position === "Phát Triển Mới Nhất"
        );
        console.log("🚀 ~ fetchItems ~ itemsFilter:", itemsFilter);
        setItems(itemsFilter);
        setFilteredItems(itemsFilter);

        const uniqueCategories = [
          ...new Set(itemsData.map((item) => item.category)),
        ];
        const uniqueTags = [
          ...new Set(itemsData.flatMap((item) => item.tags).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
        setTags(uniqueTags);
      } catch (error) {
        console.error("Error fetching items: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const applyFilters = () => {
    let filtered = items.filter((item) =>
      item.title.toLowerCase().includes(tempFilters.searchTerm.toLowerCase())
    );

    if (tempFilters.selectedCategory) {
      filtered = filtered.filter(
        (item) => item.category === tempFilters.selectedCategory
      );
    }

    if (tempFilters.selectedTags.length > 0) {
      filtered = filtered.filter((item) =>
        tempFilters.selectedTags.every((tag) => item.tags.includes(tag))
      );
    }

    if (tempFilters.dateRange) {
      filtered = filtered.filter((item) => {
        const publishDate = new Date(item.updated_at);
        return (
          publishDate >= tempFilters.dateRange[0] &&
          publishDate <= tempFilters.dateRange[1]
        );
      });
    }

    setFilteredItems(filtered);
    setCurrentPage(1);
    setIsDrawerOpen(false);
  };

  return (
    <div>
      <div className="w-full h-[200px] relative">
        <img
          src="/banner-bg.png"
          alt=""
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="py-2 px-4 bg-white absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex items-center gap-x-4 rounded-lg">
          <Link to="/" className="text-gray-400">
            Trang chủ
          </Link>
          <span>/</span>
          <h1 className="text-blue-500 font-semibold">Phát Triển Mới Nhất</h1>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-blue-500 py-2">
            Phát Triển Mới Nhất
          </h1>
          <div className="w-[100px] h-[2px] rounded-md bg-blue-200"></div>
        </div>
        <Button
          type="primary"
          onClick={() => setIsDrawerOpen(true)}
          style={{
            fontFamily: '"League Spartan", sans-serif',
            fontWeight: 400,
            fontSize: 16,
          }}
        >
          Bộ lọc
        </Button>
      </div>

      <Drawer
        title="Bộ lọc dự án"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={320}
      >
        <div className="flex flex-col gap-4">
          <label>Tìm kiếm</label>
          <Input
            placeholder="Tìm kiếm..."
            value={tempFilters.searchTerm}
            onChange={(e) =>
              setTempFilters({ ...tempFilters, searchTerm: e.target.value })
            }
          />
          <label>Danh mục</label>
          <Select
            placeholder="Chọn danh mục"
            onChange={(value) =>
              setTempFilters({ ...tempFilters, selectedCategory: value })
            }
            allowClear
            className="w-full"
          >
            {categories.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
          <label>Tags</label>
          <Select
            mode="multiple"
            placeholder="Chọn tags"
            onChange={(value) =>
              setTempFilters({ ...tempFilters, selectedTags: value })
            }
            className="w-full"
          >
            {tags.map((tag) => (
              <Select.Option key={tag} value={tag}>
                {tag}
              </Select.Option>
            ))}
          </Select>
          <label>Ngày cập nhật</label>
          <RangePicker
            onChange={(dates) =>
              setTempFilters({ ...tempFilters, dateRange: dates })
            }
          />
          <Button type="primary" onClick={applyFilters}>
            Áp dụng
          </Button>
        </div>
      </Drawer>

      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <SkeletonLoading key={index} active />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((item) => (
                <ProjectCard item={item} key={item.slug} />
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Không Tìm Thấy Dự Án</p>
        )}

        <Pagination
          current={currentPage}
          total={filteredItems.length}
          pageSize={itemsPerPage}
          onChange={setCurrentPage}
          className="text-center mt-4"
        />
      </div>
    </div>
  );
}

export default LatestDevelopment;
