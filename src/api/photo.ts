import axios from "./axiosInstance";

// 1. 전체 카테고리 조회
export const uploadPhoto = async (data: FormData) => {
  return await axios.post("/api/upload", data);
};
