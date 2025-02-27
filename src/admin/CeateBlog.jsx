import React, { useState } from "react";
import { db, storage } from "../../database/db";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import { uploadFile } from "../../middleware/uploadFile";
import { categoryOptions } from "../../database/categories";
import { toSlug } from "../utils/toSlug";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoDemo, setVideoDemo] = useState("");
  const [codeFile, setCodeFile] = useState(null);
  const [author, setAuthor] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [shortDescription, setShortDescription] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [status, setStatus] = useState("public");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (blobInfo, success, failure) => {
    try {
      const file = blobInfo.blob();
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed for upload.");
      }
      const maxSizeInBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        throw new Error(
          "The image file is too large. Maximum size allowed is 5MB."
        );
      }
      const storageRef = ref(storage, `blog-images/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      success(downloadURL);
    } catch (error) {
      failure("An error occurred while uploading the image. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const thumbnailUrl = thumbnailImage
        ? await uploadFile(thumbnailImage)
        : "";
      const codeFileUrl = codeFile ? await uploadFile(codeFile) : "";

      await addDoc(collection(db, "blogs"), {
        title,
        content,
        thumbnail_image: thumbnailUrl,
        video_demo: videoDemo,
        code_file: codeFileUrl,
        author,
        view_count: viewCount,
        like_count: likeCount,
        category,
        tags,
        short_description: shortDescription,
        custom_url: customUrl,
        slug,
        publish_date: new Date(),
        status,
        isDelete: false,
      });

      toast.success("Tạo Dự Án Thành Công!!");
      resetFormFields();
    } catch (error) {
      toast.error("Có Lỗi Rồi Cậu Ơi!");
    } finally {
      setLoading(false);
    }
  };

  const resetFormFields = () => {
    setTitle("");
    setContent("");
    setThumbnailImage(null);
    setThumbnailPreview(null);
    setVideoDemo("");
    setCodeFile(null);
    setAuthor("Kien Duong Trung");
    setViewCount(0);
    setLikeCount(0);
    setCategory("");
    setTags([]);
    setShortDescription("");
    setCustomUrl("");
    setSlug("");
    setStatus("public");
  };

  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await getBase64(file);
      setThumbnailImage(file);
      setThumbnailPreview(base64);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    const newSlug = toSlug(newTitle);
    setSlug(newSlug);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-2 rounded-lg flex flex-row gap-x-5"
    >
      <div className="w-3/4">
        <h2 className="text-2xl font-semibold mb-6">Tạo Bài Viết Mới</h2>
        <div className="mb-4 grid grid-cols-2 gap-x-5">
          <div>
            <label htmlFor="">Tiêu đề</label>
            <input
              type="text"
              placeholder="Nhập tiêu đề ..."
              value={title}
              onChange={handleTitleChange}
              required
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="">Slug</label>
            <input
              type="text"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="">Mô tả ngắn</label>
          <textarea
            placeholder="Nhập mô tả ngắn cho bài viết"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="">Nội dung bài viết</label>
          <Editor
            apiKey="kipc10e7w0fa5b7bozt9l0xwwmoukji25fh9wbyfnbzmuls5"
            initialValue="<p>Blog Content</p>"
            init={{
              width: "100%",
              height: 800,
              plugins:
                "advlist autolink link image lists charmap preview anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media table emoticons help",
              toolbar:
                "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullscreen | forecolor backcolor emoticons | help",
              automatic_uploads: true,
              images_upload_handler: handleImageUpload,
            }}
            value={content}
            onEditorChange={(newValue) => setContent(newValue)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
        >
          {loading ? "Creating Blog..." : "Create Blog"}
        </button>
      </div>
      <div className="w-1/4 h-full mt-16">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Hình ảnh
          </label>
          <div className="relative w-full">
            <input
              type="file"
              onChange={handleThumbnailChange}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button
              type="button"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              Chọn hình ảnh
            </button>
          </div>
          {thumbnailPreview && (
            <div className="mt-3">
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="w-full h-64 object-cover rounded-md shadow-md"
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="">Video</label>
          <input
            type="text"
            placeholder="Video URL (ID Video)"
            value={videoDemo}
            onChange={(e) => setVideoDemo(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          {videoDemo && (
            <div className="mt-3">
              <iframe
                width="400"
                height="400"
                src={`https://www.youtube.com/embed/${videoDemo}`}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="">Lượt xem</label>
          <input
            type="number"
            placeholder="Số lượng người xem"
            value={viewCount}
            onChange={(e) => setViewCount(Number(e.target.value))}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="" className="mt-4 block">
            Người thích
          </label>
          <input
            type="number"
            placeholder="Số lượng người thích bài viết"
            value={likeCount}
            onChange={(e) => setLikeCount(Number(e.target.value))}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label for="">Tác giả</label>
          <input
            type="text"
            placeholder="Tên tác giả"
            value="Kien Duong Trung"
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="">Danh mục</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Chọn danh mục
            </option>
            {categoryOptions.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="">Thẻ</label>
          <input
            type="text"
            placeholder="Nhập các thẻ (ngăn cách bởi dấu phẩy)"
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(e.target.value.split(",").map((tag) => tag.trim()))
            }
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="">Chế độ bài viết</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="public">Công khai</option>
            <option value="draft">Không công khai</option>
          </select>
        </div>
        <div className="mb-4">
           <label htmlFor="">Tệp tin</label>
          <input
            type="file"
            onChange={(e) => setCodeFile(e.target.files[0])}
            accept=".zip,.js,.html,.css"
            className="w-full"
          />
        </div>
      </div>
    </form>
  );
};

export default CreateBlog;
