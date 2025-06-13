import React, { useState, useEffect } from "react";
import SkeletonLoading from "../components/SkeletonLoading";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../../database/db";
import { formatDate } from "../utils/formatDate";

function BlogsPage() {
  const [items, setItems] = useState([]);
  const [BlogsPage, setBlogsPage] = useState([]);
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

        const filteredBlogsPage = itemsData.filter(
          (item) => item.category === "Challenge Series"
        );
        setBlogsPage(filteredBlogsPage);
      } catch (error) {
        console.error("Error fetching items: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Function to handle sorting and filtering
  const getFilteredBlogsPage = () => {
    let filteredDesigns = BlogsPage.filter((item) =>
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

  // Debounced search function
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchLoading(false); // Stop loading when search is done
    }, 500); // Delay before executing the search

    // Start loading on search input change
    if (searchTerm) {
      setSearchLoading(true);
    }

    return () => {
      clearTimeout(handler); // Clean up timeout on unmount
    };
  }, [searchTerm]);

  return (
    <div>
      <div className="w-full h-[200px] relative">
        <img
          src="/challenge-bg.jpeg"
          alt=""
          loading="lazy"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="py-2 px-4 rounded-lg bg-white absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex items-center gap-x-4">
          <Link to={"/"} className="font-base text-md text-gray-400">
            Home
          </Link>
          <span>/</span>
          <h1 className="font-semibold text-md text-blue-500">
            Challenge Series
          </h1>
        </div>
      </div>

      <div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl text-blue-400 py-2">
              Featured Projects
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
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
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
              : getFilteredBlogsPage().map((item) => (
                  <Link to={`/${item?.slug}`} key={item?.slug}>
                    <div className="p-3 rounded-xl bg-white group">
                      <div className="w-full h-52 rounded-xl overflow-hidden">
                        <img
                          src={
                            item?.thumbnail_image?.url ||
                            "https://cdn.dribbble.com/userupload/16072088/file/original-c2887d4627b1eed2e886d386e74e27a4.png?resize=1514x852&vertical=center"
                          }
                          alt={item?.title}
                          loading="lazy"
                          className="rounded-xl h-full w-full object-cover group-hover:scale-110 transition-all"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-x-2 p-2">
                          <img
                            src="https://cdn.dribbble.com/users/772985/screenshots/9247897/media/59b9f4624886350945af7b7fd2ee318f.png?resize=1600x1200&vertical=center"
                            alt=""
                            loading="lazy"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <h1 className="font-semibold text-sm text-blue-500">
                            Kien Duong Trung
                          </h1>
                          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                          <span className="text-sm font-base text-gray-400">
                            {formatDate(item?.publish_date.toDate())}
                          </span>
                        </div>
                        <h1 className="py-2 font-semibold text-lg ml-2 text-blue-500">
                          {item?.title}
                        </h1>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogsPage;
