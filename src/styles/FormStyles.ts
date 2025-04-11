import { AuthProvider } from './../contexts/AuthContext';
// src/styles/FormStyles.ts
import styled from 'styled-components';

interface InputBoxProps {
  direction?: 'row' | 'column';
}

interface ButtonBoxProps {
  direction?: 'row' | 'column'; // flex-direction 값
}

export const InputBox = styled.div<InputBoxProps>`
  width: 100%;
  display: flex;
  flex-direction: ${({ direction }) => direction};
  /* gap: 10px; */
  /* margin: 5% 0 10% 0; */
`;

export const Input = styled.input`
  /* width: 100%; */
  height: 60px;
  border-radius: 12px;
  border: 1px solid var(--gray-300, #e2e2e2);
  padding: 0 20px;
  font-size: 18px;
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

export const ButtonBox = styled.div<ButtonBoxProps>`
  width: 100%;
  display: flex;
  gap: 10px;
  flex-direction: ${(props) => props.direction || 'row'}; // 기본값은 'row'
`;

export const CategoryWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  /* label {
    width: calc((100% - 40px) / 3);
    display: flex;
    justify-content: center;
    align-items: center;
  } */
`;

export const InputWrapper = styled.div`
  vertical-align: middle;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
