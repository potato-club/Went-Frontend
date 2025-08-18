import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

type CategoryType = "movie" | "place" | "book" | "music" | "performance";
type SortOrderType = "" | "latest" | "likes" | "popular";

type HeaderProps = {
  onCategoryChange: (value: CategoryType) => void;
  onSortChange: (value: SortOrderType) => void;
};

const Header: React.FC<HeaderProps> = ({ onCategoryChange, onSortChange }) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [category, setCategory] = useState<CategoryType>("movie");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("");

  const categoryRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(e.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }

      if (
        sortRef.current &&
        !sortRef.current.contains(e.target as Node)
      ) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const categoryOptions: { label: string; value: CategoryType }[] = [
    { label: "영화", value: "movie" },
    { label: "장소", value: "place" },
    { label: "책", value: "book" },
    { label: "음악", value: "music" },
    { label: "공연", value: "performance" },
  ];

  const sortOptions: { label: string; value: SortOrderType }[] = [
    { label: "최신순", value: "latest" },
    { label: "좋아요순", value: "likes" },
    { label: "인기순", value: "popular" },
  ];

  const getLabel = (
    value: string,
    options: { label: string; value: string }[]
  ) => options.find((opt) => opt.value === value)?.label || "";

  return (
    <Layout>
      <DropdownWrapper
        ref={categoryRef}
        onClick={() => setShowCategoryDropdown((prev) => !prev)}
      >
        <p>{getLabel(category, categoryOptions)}</p>
        {showCategoryDropdown && (
          <Dropdown>
            {categoryOptions.map((opt) => (
              <DropdownItem
                key={opt.value}
                onClick={(e) => {
                  e.stopPropagation();
                  setCategory(opt.value);
                  onCategoryChange(opt.value);
                  setShowCategoryDropdown(false);
                }}
              >
                {opt.label}
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </DropdownWrapper>
      <SortWrapper ref={sortRef}>
        <button onClick={() => setShowSortDropdown((prev) => !prev)}>
          {getLabel(sortOrder, sortOptions) || "정렬"}
        </button>
        {showSortDropdown && (
          <Dropdown>
            {sortOptions.map((opt) => (
              <DropdownItem
                key={opt.value}
                onClick={() => {
                  setSortOrder(opt.value);
                  onSortChange(opt.value);
                  setShowSortDropdown(false);
                }}
              >
                {opt.label}
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </SortWrapper>
    </Layout>
  );
};

export default Header;

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 60px;
`;

const DropdownWrapper = styled.div`
  margin-left: 100px;
  position: relative;
  cursor: pointer;

  p {
    margin: 0;
    font-size: 40px;
    font-weight: bold;
    transition: background 0.2s;

    &:hover {
      color: #6f6f6f;
    }
  }
`;

const SortWrapper = styled.div`
  margin-right: 100px;
  position: relative;

  button {
    background: #d9d9d9;
    border: none;
    font-size: 16px;
    font-weight: 500;
    color: #666666;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 110%;
  left: 0;
  margin-top: 4px;
  padding: 0;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.06);
  z-index: 100;
  min-width: 80px;
  list-style: none;
`;

const DropdownItem = styled.li`
  padding: 10px 16px;
  font-size: 15px;
  color: #333;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;
