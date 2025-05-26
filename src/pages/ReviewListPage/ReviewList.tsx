import styled from "styled-components";
import Header from "./components/Header";
import List from "./components/List";
import Pagenation from "../../components/Pagenation";
import { useState } from "react";
function ReviewList() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPage = 23; // 총 페이지 수 백엔드로 부터 받아야함.

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Header />
      <List />
      <Pagenation
        totalPage={totalPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
}

export default ReviewList;
