import axios from "./axiosInstance";

// 1. 전체 카테고리 조회
export const getCategories = async () => {
  return await axios.get("/api/categories");
};
