import Header from "./components/Header";
import List from "./components/List";
import Pagenation from "../../components/Pagenation";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import type { Review } from "../../types/review";

const categoryMap: Record<string, number> = {
  place: 1,
  book: 2,
  music: 3,
  movie: 4,
  performance: 5,
};

const sortMap: Record<string, string> = {
  latest: "recent",
  likes: "likes",
  popular: "popular",
};

function ReviewList() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [category, setCategory] = useState("movie");
  const [sortOrder, setSortOrder] = useState("");

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const fetchReviews = async () => {
      try {
        const categoryId = categoryMap[category];
        const sort = sortMap[sortOrder] || "recent";

        const response = await api.get("/api/posts/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            categoryId,
            sort,
            page: currentPage,
            size: 8,
          },
        });
        console.log(response)
        setReviews(response.data.content);
        setTotalPage(response.data.totalPages);
      } catch (error) {
        console.error("리뷰 목록 가져오기 실패:", error);
      }
    };

    fetchReviews();
  }, [category, sortOrder, currentPage]);

  return (
       <>
      <Header onCategoryChange={setCategory} onSortChange={setSortOrder} />
      <List data={reviews} />
      <Pagenation
        totalPage={totalPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default ReviewList;
