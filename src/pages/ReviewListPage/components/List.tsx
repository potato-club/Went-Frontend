import React from "react";
import styled from "styled-components";
import { AiFillStar, AiOutlineStar, AiOutlineHeart } from "react-icons/ai";

type Review = {
  id: number;
  title: string;
  place: string;
  rating: number;
  likes: number;
  date: string;
  thumbnail?: string; 
};

const dummyData: Review[] = [
  { id: 1, title: "가격 대비 괜찮은 듯?", place: "한세대 학교 학생식당", rating: 3, likes: 24, date: "2025.03.24"},
  { id: 2, title: "제목", place: "가보거나 해본 것", rating: 5, likes: 156, date: "2025.02.01" },
  { id: 3, title: "가나다", place: "라마리사", rating: 1, likes: 0, date: "2025.03.24" },
  { id: 4, title: "가격 대비 괜찮은 듯?", place: "한세대 학교 학생식당", rating: 2, likes: 4, date: "2025.03.24" },
  { id: 5, title: "가격 대비 괜찮은 듯?", place: "한세대 학교 학생식당", rating: 5, likes: 1, date: "2025.03.24" },
  { id: 6, title: "ㅇㅇㅇㅇ", place: "ㅇㅇㅇ", rating: 5, likes: 0, date: "2025.03.24" },
  { id: 7, title: "가격 대비 괜찮은 듯?", place: "한세대 학교 학생식당", rating: 2, likes: 4, date: "2025.03.24" },
  { id: 8, title: "가나다", place: "라마리사", rating: 1, likes: 0, date: "2025.03.24" },
];
  
const List: React.FC = () => {
  return (
    <Container>
      {dummyData.map((review) => (
        <Card key={review.id}>
          <TextContent>
            <Title>{review.title}</Title>
            <Place>{review.place}</Place>
            <Rating>
              {Array.from({ length: 5 }, (_, i) =>
                i < review.rating ? (
                  <AiFillStar key={i} color="#000000" />
                ) : (
                  <AiOutlineStar key={i} color="#000000" />
                )
              )}
            </Rating>
            <Meta>
              <Likes><AiOutlineHeart /> {review.likes}</Likes>
              <Date>{review.date}</Date>
            </Meta>
          </TextContent>
          <Thumbnail />
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
  padding: 40px 80px;
`;

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 16px;
`;

const Place = styled.div`
  font-size: 14px;
  color: #555;
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
