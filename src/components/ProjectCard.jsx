import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { toSlug } from "../utils/toSlug";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { DEFAULT_IMAGE } from "../constants/images";

const ProjectCard = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const likedProjects =
      JSON.parse(localStorage.getItem("likedProjects")) || [];
    setLiked(likedProjects.includes(item?.slug));
  }, [item?.slug]);

  const handleLike = (e) => {
    e.preventDefault();
    const likedProjects =
      JSON.parse(localStorage.getItem("likedProjects")) || [];
    let updatedLikedProjects;

    if (liked) {
      updatedLikedProjects = likedProjects.filter(
        (slug) => slug !== item?.slug
      );
    } else {
      updatedLikedProjects = [...likedProjects, item?.slug];
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
    }

    localStorage.setItem("likedProjects", JSON.stringify(updatedLikedProjects));
    setLiked(!liked);
  };

  return (
    <Link to={`/${toSlug(item?.category)}/${item?.slug}`} key={item?.slug}>
      <div className="p-3 rounded-xl bg-white dark:bg-[#161617] group h-full relative">
        <div className="w-full md:h-52 h-40 rounded-xl overflow-hidden">
          <img
            src={item?.thumbnail_image?.url || item?.thumbnail_image}
            alt={item?.title}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_IMAGE;
            }}
            className="rounded-xl dark:brightness-80 h-full w-full object-cover group-hover:scale-110 transition-all"
          />
        </div>
        <div>
          <div className="flex items-center gap-x-2 p-3">
            <img
              src="/me.jpg"
              alt=""
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_IMAGE;
              }}
              className="md:w-8 md:h-8 w-6 h-6 rounded-full object-cover"
            />
            <h1 className="font-semibold md:text-[13px] text-[11px] text-gray-600 dark:text-gray-100">
              Kien Duong Trung
            </h1>
            <div className="w-2 h-2 rounded-full bg-gray-200 hidden md:block"></div>
            <span className="text-sm font-base text-gray-400 hidden md:block">
              {item?.publish_date
                ? formatDate(item.publish_date.toDate())
                : "Unknown Date"}
            </span>
          </div>
          <h1 className="md:my-2 my-1 font-semibold md:text-lg text-md ml-2 text-gray-700 dark:text-white group-hover:text-blue-500 transition-all line-clamp-2">
            {item?.title}
          </h1>
        </div>
        <button
          className={`absolute bottom-3 right-6 rounded-full text-xl text-red-500 transition-transform transform hover:scale-125 ${
            animating ? "animate-ping" : ""
          }`}
          onClick={handleLike}
        >
          {liked ? <HeartFilled /> : <HeartOutlined />}
        </button>
      </div>
    </Link>
  );
};

export default ProjectCard;
