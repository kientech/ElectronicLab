export const toSlug = (str) => {
  return str
    .normalize("NFD") // Tách dấu khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .toLowerCase() // Chuyển thành chữ thường
    .replace(/đ/g, "d") // Thay đ => d
    .replace(/[^a-z0-9\s-]/g, "") // Xóa ký tự đặc biệt
    .trim() // Xóa khoảng trắng đầu/cuối
    .replace(/\s+/g, "-"); // Thay khoảng trắng thành dấu "-"
};
