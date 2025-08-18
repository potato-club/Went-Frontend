import axios from "./axiosInstance";

export const writePost = async (postData: any) => {
  const response = await axios.post("/api/posts", postData, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response;
};

export const uploadPhoto = async (data: FormData) => {
  return await axios.post("/api/posts/images/upload", data, {
    headers: {
      // multipart/form-data의 경우 브라우저가 자동으로 Content-Type과 boundary를 설정하도록 함
      "Content-Type": "multipart/form-data"
    }
  });
};