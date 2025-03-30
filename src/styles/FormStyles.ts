// src/styles/FormStyles.ts
import styled from 'styled-components';

interface InputBoxProps {
  direction?: 'row' | 'column';
}

export const InputBox = styled.div<InputBoxProps>`
  width: 100%;
  display: flex;
  flex-direction: ${({ direction }) => direction};
  gap: 10px;
  margin: 5% 0 10% 0;
`;

export const Input = styled.input`
  /* width: 100%; */
  height: 60px;
  border: 2px solid #c6c4c2;
  background: #fff;
  text-align: center;
  font-size: 16px;
  padding: 0;
`;

export const SelectBox = styled.select`
  width: 100%;
  height: 60px;
  border: 2px solid #c6c4c2;
  background: #fff;
  text-align: center;
  font-size: 20px;
`;

export const RadioBox = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20%;
`;

export const ButtonBox = styled.div`
  width: 333px;
  display: flex;
  gap: 10px;
  /* position: absolute; */
  /* top: 660px; */
`;

export const CategoryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin: 20px 0;

  label {
    width: calc((100% - 40px) / 3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
