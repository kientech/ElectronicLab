import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../../database/db";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import { uploadFile } from "../../middleware/uploadFile";
import { categoryOptions } from "../../database/categories";
import { toSlug } from "../utils/toSlug";

const EditBlog = () => {
  const { id } = useParams();
  console.log("🚀 ~ EditBlog ~ id:", id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoDemo, setVideoDemo] = useState("");
  const [codeFile, setCodeFile] = useState(null);
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [shortDescription, setShortDescription] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("public");
  const [loading, setLoading] = useState(false);

  // Load dữ liệu bài viết cũ
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);
        console.log("🚀 ~ fetchBlog ~ docSnap:", docSnap);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setContent(data.content);
          setThumbnailPreview(data.thumbnail_image);
          setVideoDemo(data.video_demo);
          setCodeFile(data.code_file);
          setAuthor(data.author);
          setCategory(data.category);
          setTags(data.tags || []);
          setShortDescription(data.short_description);
          setCustomUrl(data.custom_url);
          setSlug(data.slug);
          setStatus(data.status);
        } else {
          toast.error("Bài viết không tồn tại!");
          navigate("/dashboard/all-projects");
        }
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu!");
      }
    };
    fetchBlog();
  }, [id, navigate]);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
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
    setSlug(toSlug(newTitle));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let thumbnailUrl = thumbnailPreview;
      let codeFileUrl = codeFile;

      if (thumbnailImage) {
        thumbnailUrl = await uploadFile(thumbnailImage);
      }
      if (codeFile instanceof File) {
        codeFileUrl = await uploadFile(codeFile);
      }

      await updateDoc(doc(db, "blogs", id), {
        title,
        content,
        thumbnail_image: thumbnailUrl,
        video_demo: videoDemo,
        code_file: codeFileUrl,
        author,
        category,
        tags,
        short_description: shortDescription,
        custom_url: customUrl,
        slug,
        status,
        updated_at: new Date(),
      });

      toast.success("Cập nhật bài viết thành công!");
      navigate("/blogs");
    } catch (error) {
      toast.error("Lỗi khi cập nhật bài viết!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-2 rounded-lg flex flex-row gap-x-5"
    >
      <div className="w-3/4">
        <h2 className="text-2xl font-semibold mb-6">Chỉnh Sửa Bài Viết</h2>
        <div className="mb-4 grid grid-cols-2 gap-x-5">
          <div>
            <label>Tiêu đề</label>
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
            <label>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label>Mô tả ngắn</label>
          <textarea
            placeholder="Nhập mô tả ngắn"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label>Nội dung bài viết</label>
          <Editor
            apiKey="kipc10e7w0fa5b7bozt9l0xwwmoukji25fh9wbyfnbzmuls5"
            value={content}
            init={{
              width: "100%",
              height: 800,
              plugins:
                "advlist autolink link image lists charmap preview anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media table emoticons help codesample",
              toolbar:
                "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullscreen | forecolor backcolor emoticons | help | codesample",
              automatic_uploads: true,
              codesample_languages: [
                { text: "JavaScript", value: "javascript" },
                { text: "HTML/XML", value: "markup" },
                { text: "CSS", value: "css" },
                { text: "Python", value: "python" },
                { text: "Java", value: "java" },
                { text: "C", value: "c" },
                { text: "C++", value: "cpp" },
              ],
              images_upload_handler: handleImageUpload,
            }}
            onEditorChange={(newValue) => setContent(newValue)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-500 text-white rounded-lg"
        >
          {loading ? "Đang cập nhật..." : "Cập nhật bài viết"}
        </button>
      </div>

      <div className="w-1/4 h-full mt-16">
        <label className="block text-gray-700 font-medium mb-2">Hình ảnh</label>
        <input
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail"
            className="mt-3 rounded-lg shadow-md"
          />
        )}
      </div>
    </form>
  );
};

export default EditBlog;
