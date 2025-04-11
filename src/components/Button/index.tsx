import styled from 'styled-components';

const Button = styled.button`
  background-color: ${(props) => props.color};
  color: white;
  width: 100%;
  height: 60px;
  border-radius: 16px;
  text-align: center;
  align-content: center;
  font-size: 18px;
  border: none;
  /* margin-bottom: 10%; */
  cursor: pointer;
`;

export default Button;
