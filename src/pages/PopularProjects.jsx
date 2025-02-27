import React, { useState, useEffect } from "react";
import SkeletonLoading from "../components/SkeletonLoading";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../../database/db";
import { formatDate } from "../utils/formatDate";
import ProjectCard from "../components/ProjectCard";

function PopularProjects() {
  const [items, setItems] = useState([]);
  const [explorerSeries, setExplorerSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
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

        const filteredExplorerSeries = itemsData.filter(
          (item) => item.view_count >= 40
        );
        setExplorerSeries(filteredExplorerSeries);
      } catch (error) {
        console.error("Error fetching items: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const getFilteredExplorerSeries = () => {
    let filteredSeries = explorerSeries.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort based on selected option
    if (sortOption === "newest") {
      filteredSeries.sort((a, b) => b.publish_date - a.publish_date);
    } else if (sortOption === "oldest") {
      filteredSeries.sort((a, b) => a.publish_date - b.publish_date);
    } else if (sortOption === "a-z") {
      filteredSeries.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "z-a") {
      filteredSeries.sort((a, b) => b.title.localeCompare(a.title));
    }

    return filteredSeries;
  };

  // Debounced search function
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchLoading(false);
    }, 500);

    if (searchTerm) {
      setSearchLoading(true);
    }

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  return (
    <div>
      <div className="w-full h-[200px] relative">
        <img
          src="../../public/explorer-bg.png"
          alt=""
          loading="lazy"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="py-2 px-4 rounded-lg bg-white absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex items-center gap-x-4">
          <Link to={"/"} className="font-base text-md text-gray-400">
            Trang chủ
          </Link>
          <span>/</span>
          <h1 className="font-semibold text-md text-green-500">
            Dự án nổi bật
          </h1>
        </div>
      </div>

      <div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl text-blue-400 py-2">
              Dự Án Nổi Bật
            </h1>
            <div className="w-[100px] h-[2px] rounded-md bg-blue-200"></div>
          </div>

          <div>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by title..."
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
            {loading || searchLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonLoading key={index} />
                ))
              : getFilteredExplorerSeries().map((item) => (
                  <ProjectCard item={item} key={item.slug} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopularProjects;
