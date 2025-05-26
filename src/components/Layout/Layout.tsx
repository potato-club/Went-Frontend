import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
const Layout = () => {
  return (
    <StyledDiv>
      <Header />
      <Outlet />
    </StyledDiv>
  );
};

export default Layout;

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
