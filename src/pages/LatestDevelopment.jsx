import React, { useState, useEffect } from "react";
import SkeletonLoading from "../components/SkeletonLoading";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../../database/db";
import { formatDate } from "../utils/formatDate";
import { toSlug } from "../utils/toSlug";
import ProjectCard from "../components/ProjectCard";

function LatestDevelopment() {
  const [items, setItems] = useState([]);
  const [pcbDesigns, setPcbDesigns] = useState([]);
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
        setItems(itemsData);

        const filteredPcbDesigns = itemsData.filter(
          (item) => item.view_count >= 40
        );
        setPcbDesigns(filteredPcbDesigns);
      } catch (error) {
        console.error("Error fetching items: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Function to handle sorting and filtering
  const getFilteredPcbDesigns = () => {
    let filteredDesigns = pcbDesigns.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort based on selected option
    if (sortOption === "newest") {
      filteredDesigns.sort((a, b) => b.publish_date - a.publish_date);
    } else if (sortOption === "oldest") {
      filteredDesigns.sort((a, b) => a.publish_date - b.publish_date);
    } else if (sortOption === "a-z") {
      filteredDesigns.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "z-a") {
      filteredDesigns.sort((a, b) => b.title.localeCompare(a.title));
    }

    return filteredDesigns;
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
            Trang chủ
          </Link>
          <span>/</span>
          <h1 className="font-semibold text-md text-blue-500">
            Phát triển mới nhất
          </h1>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-blue-400 py-2">
            Phát Triển Mới Nhất
          </h1>
          <div className="w-[100px] h-[2px] rounded-md bg-blue-200"></div>
        </div>

        <div>
          {/* Search Input */}
          <input
            type="text"
            placeholder="Tìm kiếm ...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg p-2 mt-4"
          />

          {/* Sort Options */}
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
            : getFilteredPcbDesigns().map((item) => (
                <ProjectCard item={item} key={item.slug} />
              ))}
        </div>
      </div>
    </div>
  );
}

export default LatestDevelopment;
