// src/styles/LayoutStyles.ts
import styled from 'styled-components';

export const Title = styled.div`
  /* margin-top: 60px; */
  font-size: 36px;
  /* margin-bottom: 20px; */
`;

export const SubTitle = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
  font-size: 25px;
`;

export const DescriptionBox = styled.div`
  width: 100%;
  height: 30px;
  border-bottom: 3px solid #c6c4c2;
  text-align: center;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  padding-bottom: 10px;
  white-space: pre-wrap;
  margin-top: 20px;
`;

export const ChangedComponent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  /* align-items: center; */
  margin: 0 auto;
`;
