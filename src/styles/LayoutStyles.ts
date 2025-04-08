// src/styles/LayoutStyles.ts
import styled from 'styled-components';

export const Title = styled.div`
  /* margin-top: 60px; */
  font-size: 32px;
  /* margin-bottom: 20px; */
`;

export const SubTitle = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
  font-size: 25px;
`;

export const DescriptionBox = styled.div`
  width: 100%;
  /* height: 30px; */
  text-align: center;
  display: flex;
  flex-direction: column;
  font-size: 20px;
  /* padding-bottom: 10px; */
  white-space: pre-wrap;
  /* margin-top: 30px; */
`;

export const ChangedComponent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  margin: 0 auto;
  gap: 20px;
`;

export const Img = styled.img`
  width: 100%;
`;
