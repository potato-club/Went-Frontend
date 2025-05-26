import React from "react";
import styled from "styled-components";

interface PagenationProps {
  totalPage: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

const Pagenation: React.FC<PagenationProps> = ({
  totalPage,
  currentPage,
  onPageChange,
}) => {
  const pageRange = 8;
  const startPage = Math.floor((currentPage - 1) / pageRange) * pageRange + 1;
  const endPage = Math.min(startPage + pageRange - 1, totalPage);

  const handleClick = (page: number) => {
    if (page >= 1 && page <= totalPage && page !== currentPage) {
      onPageChange(page);
    }
  };

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <PageButton
        key={i}
        onClick={() => handleClick(i)}
        isActive={i === currentPage}
      >
        {i}
      </PageButton>
    );
  }

  return (
    <PaginationWrapper>
      <ArrowButton
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lsaquo;
      </ArrowButton>

      {pages}

      <ArrowButton
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPage}
      >
        &rsaquo;
      </ArrowButton>
    </PaginationWrapper>
  );
};

export default Pagenation;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px 0;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  background: none;
  border: none;
  font-size: 17px;
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? "#000" : "#999")};
  font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};
  
  &:hover {
    color: #000;
  }

  &:disabled {
    color: #ccc;
    cursor: default;
  }
`;

const ArrowButton = styled(PageButton)`
  font-size: 18px;
`;