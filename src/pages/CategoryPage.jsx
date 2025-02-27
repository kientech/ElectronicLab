import React, { useState, useEffect } from "react";
import SkeletonLoading from "../components/SkeletonLoading";
import { collection, getDocs } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { db } from "../../database/db";
import ProjectCard from "../components/ProjectCard";
import { toSlug } from "../utils/toSlug";

function CategoryPage() {
  const { category } = useParams();
  console.log("🚀 ~ CategoryPage ~ category:", category);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const itemsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Lọc bài viết theo category dựa trên slug
        const filteredItems = itemsData.filter(
          (item) => toSlug(item?.category) === category
        );
        console.log("🚀 ~ fetchItems ~ filteredItems:", filteredItems);

        setItems(filteredItems);
      } catch (error) {
        console.error("Error fetching items: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category]);

  // Hàm lọc và sắp xếp bài viết
  const getFilteredItems = () => {
    let filtered = items.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOption === "newest") {
      filtered.sort((a, b) => b.publish_date - a.publish_date);
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => a.publish_date - b.publish_date);
    } else if (sortOption === "a-z") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "z-a") {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  };

  return (
    <div>
      <div className="w-full h-[200px] relative">
        <img
          src="/pcb_background.jpeg"
          alt=""
          loading="lazy"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="py-2 px-4 rounded-lg bg-white absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex items-center gap-x-4">
          <Link to={"/"} className="font-base text-md text-gray-400">
            Danh Mục
          </Link>
          <span>/</span>
          <h1 className="font-semibold text-md text-blue-500">
            {items[0]?.category}
          </h1>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-blue-400 py-2">
            {items[0]?.category}
          </h1>
          <div className="w-[100px] h-[2px] rounded-md bg-blue-200"></div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Tìm kiếm ...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg p-2 mt-4"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded-lg py-2 px-4 mt-4 ml-4"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>
      </div>

      <div className="w-full my-4">
        <div className="grid grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoading key={index} />
              ))
            : getFilteredItems().map((item) => (
                <ProjectCard item={item} key={item.id} />
              ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
