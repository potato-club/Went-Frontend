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
  gap: 10px;
  /* gap: 10px; */
  /* margin: 5% 0 10% 0; */
  label {
    color: #5e5e5e;
  }
`;

export const Input = styled.input`
  /* width: 100%; */
  height: 60px;
  border-radius: 12px;
  border: 1px solid var(--gray-300, #e2e2e2);
  padding: 0 20px;
  font-size: 16px;
  &::placeholder {
    color: #c6c6c6;
  }
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
  width: 400px;
  display: flex;
  gap: 10px;
  flex-direction: ${(props) => props.direction || 'row'}; // 기본값은 'row'
  margin-top: 50px;
`;

// export const CategoryWrapper = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 20px;
//   margin-bottom: 60px;

//   /* label {
//     width: calc((100% - 40px) / 3);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   } */
// `;

export const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

interface CategoryItemProps {
  selected: boolean;
}

export const CategoryItem = styled.button<CategoryItemProps>`
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 14px;
  border: 1px solid ${({ selected }) => (selected ? '#000' : '#ddd')};
  background-color: ${({ selected }) => (selected ? '#000' : '#fff')};
  color: ${({ selected }) => (selected ? '#fff' : '#000')};
  cursor: pointer;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#111' : '#f3f3f3')};
  }
`;

export const InputWrapper = styled.div`
  vertical-align: middle;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const Form = styled.form`
  width: 100%;
  height: 680px;
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  gap: 20px;

  /* justify-content: center; */
`;
