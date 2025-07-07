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
      "Content-Type": "multipart/form-data"
    }
  });
};