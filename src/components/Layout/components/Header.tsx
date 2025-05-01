import styled from "styled-components";
import LOGO from "../../../asset/StringLogo.svg";
import SearchIcon from "../../../asset/SearchIcon.png";
import Pencil from "../../../asset/PostIcon.png";
import Calerdar from "../../../asset/Calendar.png";
import MyPageIcon from "../../../asset/MyPage.png";
const Header = () => {
  return (
    <Container>
      <Left>
        <img src={LOGO} />
        <InputBox>
          <StyledInput placeholder="검색어를 입력하세요."></StyledInput>
          <img
            src={SearchIcon}
            onClick={() => {
              console.log("검색!");
            }}
          />
        </InputBox>
      </Left>

      <Right>
        <img src={Pencil} />
        <img src={Calerdar} />
        <img src={MyPageIcon} />
        <div>로그아웃</div>
      </Right>
    </Container>
  );
};

export default Header;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #adadad;
  align-items: center;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  padding-left: 45px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  padding-right: 45px;
  font-size: 16px;
  color: #9e9e9e;
`;

const InputBox = styled.div`
  width: 275px;
  height: 42px;
  border-radius: 11px;
  border: 1px solid #adadad;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
`;

const StyledInput = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  font-size: 14px;
  width: 200px;
  font-weight: 600;
  height: 18px;
`;
