import styled from "styled-components";

interface ButtonProps {
  bgColor?: string;
  color?: string;
}

const Button = styled.button<ButtonProps>`
  background-color: ${(props) => props.bgColor || "transparent"};
  color: ${(props) => props.color};
  width: 100%;
  height: 60px;
  border-radius: 16px;
  text-align: center;
  align-content: center;
  font-size: 18px;
  border: ${(props) => (props.bgColor ? "none" : "1px solid #E2E2E2")};
  /* margin-bottom: 10%; */
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? "0.6" : "1")};
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default Button;
