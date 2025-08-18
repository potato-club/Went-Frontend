import styled from "styled-components";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Post, CategoryResponse } from "../../../types/main";
import { Film, MapPin, BookOpen, Theater, Headphones } from "lucide-react";

const categories = [
  { id: 1, name: "영화", icon: <Film size={25} /> },
  { id: 2, name: "장소", icon: <MapPin size={25} /> },
  { id: 3, name: "책", icon: <BookOpen size={25} /> },
  { id: 4, name: "공연", icon: <Theater size={25} /> },
  { id: 5, name: "음악", icon: <Headphones size={25} /> },
];

const MainList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categoryId, setCategoryId] = useState<number>(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get<CategoryResponse>("/api/main", {
          params: { categoryId },
        });
        setPosts(res.data.posts);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchPosts();
  }, [categoryId]);

  return (
    <div style={{display:'flex', flexDirection:'column'}}>
      <CategoryBar>
        {categories.map((cat) => (
          <CategoryItem
            key={cat.id}
            $active={cat.id === categoryId}
            onClick={() => setCategoryId(cat.id)}
          >
            {cat.icon}
            <span>{cat.name}</span>
          </CategoryItem>
        ))}
        <MoreBtn>더보기 +</MoreBtn>
      </CategoryBar>

      <ListWrapper>
        {posts.map((post) => (
          <Card key={post.postId}>
            <Thumbnail
              style={{
                backgroundImage: `url(${post.thumbnailUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Title>{post.title}</Title>
            <Stars>{"⭐".repeat(post.stars)}</Stars>
            <Info>
              <span>👁 {post.viewCount}</span>
              <span>{new Date(post.createdDate).toLocaleDateString()}</span>
            </Info>
          </Card>
        ))}
      </ListWrapper>
    </div>
  );
};

export default MainList;

const CategoryBar = styled.div`
  display: flex;
  gap: 16px;
`;

const CategoryItem = styled.div<{ $active: boolean }>`
  display: flex;
  gap: 5px;
  cursor: pointer;
  font-size: 18px;
  margin-right: 30px;
  color: ${({ $active }) => ($active ? "#000" : "#999")};
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  &:hover {
    color: #333;
  }
  height: 25px;
  align-items: center;
`;

const MoreBtn = styled.button`
  margin-left: auto;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 16px;
  background: #fff;
  height: 30px;
  cursor: pointer;

  &:hover {
    background: #f7f7f7;
  }
`;

const ListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  flex: 3;
`;

const Card = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 220px;
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 150px;
  background: #ddd;
  border-radius: 6px;
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin: 6px 0;
`;

const Stars = styled.div`
  color: #f7b500;
  font-size: 14px;
  margin-bottom: 4px;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
`;
