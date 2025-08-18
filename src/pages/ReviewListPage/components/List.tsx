import React from "react";
import styled from "styled-components";
import { AiFillStar, AiOutlineStar, AiOutlineHeart } from "react-icons/ai";
import type { Review } from "../../../types/review"; 


interface ListProps {
  data: Review[];
}

const List: React.FC<ListProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <EmptyMessage>리뷰가 없습니다.</EmptyMessage>;
  }

  return (
    <Container>
      {data.map((review) => (
        <Card key={review.postId}>
          <TextContent>
            <Title>{review.title}</Title>
            <Place>{review.content}</Place>
            <Rating>
              {Array.from({ length: 5 }, (_, i) =>
                i < review.stars ? (
                  <AiFillStar key={i} color="#000000" />
                ) : (
                  <AiOutlineStar key={i} color="#000000" />
                )
              )}
            </Rating>
            <Meta>
              <Likes>
                <AiOutlineHeart /> {review.commentCount || '15'}
              </Likes>
              <Date>{review.createdAt || '2025.10.10'}</Date>
            </Meta>
          </TextContent>
          <Thumbnail
            style={{
              backgroundImage: `url(${review.thumbnailUrl || ""})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Card>
      ))}
    </Container>
  );
};

export default List;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px 20px;
  padding: 40px 80px 0;
`;

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
  max-width: 401px;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: calc(100% - 100px);
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 16px;
`;

const Place = styled.div`
  font-size: 14px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Rating = styled.div`
  display: flex;
  gap: 2px;
  margin-top: 4px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  font-size: 12px;
  color: #888;
`;

const Likes = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Date = styled.div``;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  background: #d9d9d9;
  border-radius: 6px;
  flex-shrink: 0;
`;

const EmptyMessage = styled.div`
  text-align: center;
  width: 100%;
  padding: 40px 0;
  font-size: 18px;
  color: #777;
`;
