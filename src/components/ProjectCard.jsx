import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { toSlug } from "../utils/toSlug";

const ProjectCard = ({ item }) => {
  return (
    <Link to={`/${toSlug(item?.category)}/${item?.slug}`} key={item?.slug}>
      <div className="p-3 rounded-xl bg-white group">
        <div className="w-full md:h-52 h-40 rounded-xl overflow-hidden">
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
          <div className="flex items-center gap-x-2 p-3">
            <img
              src="https://cdn.dribbble.com/users/772985/screenshots/9247897/media/59b9f4624886350945af7b7fd2ee318f.png?resize=1600x1200&vertical=center"
              alt=""
              loading="lazy"
              className="md:w-8 md:h-8 w-6 h-6 rounded-full object-cover"
            />
            <h1 className="font-semibold md:text-[13px] text-[11px] text-gray-600">
              Kien Duong Trung
            </h1>
            <div className="w-2 h-2 rounded-full bg-gray-200 hidden md:block"></div>
            <span className="text-sm font-base text-gray-400 hidden md:block">
              {item?.publish_date
                ? formatDate(item.publish_date.toDate())
                : "Unknown Date"}
            </span>
          </div>
          <h1 className="md:my-2 my-1 font-semibold md:text-lg text-md ml-2 text-gray-700 line-clamp-2">
            {item?.title}
          </h1>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
