import axios from "./axiosInstance";

export const writePost = async (postData: any) => {
  const response = await axios.post("/api/posts", postData, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response;
};