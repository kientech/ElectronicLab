import { storage } from "../database/db"; // Đảm bảo rằng đường dẫn này đúng
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFile = async (file) => {
  // Lấy thời gian gửi và chuyển đổi thành chuỗi
  const timestamp = new Date().toISOString().replace(/[-:.]/g, ""); // Loại bỏ dấu '-' '.' và ':'
  const uniqueFileName = `${timestamp}_${file.name}`; // Tạo tên file duy nhất

  const storageRef = ref(storage, `uploads/${uniqueFileName}`);

  // Upload file lên Firebase Storage
  await uploadBytes(storageRef, file);

  // Lấy URL của file đã upload
  const fileUrl = await getDownloadURL(storageRef);

  // Thông tin về file
  const fileInfo = {
    name: uniqueFileName,
    url: fileUrl,
    uploadedAt: new Date().toISOString(), // Lưu thời gian gửi dưới định dạng ISO
  };

  return fileInfo; // Trả về đối tượng chứa thông tin về file
};
