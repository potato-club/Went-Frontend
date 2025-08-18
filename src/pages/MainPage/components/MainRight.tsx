import styled from "styled-components";

const MainRight = () => {
  return (
    <RightWrapper>
      <ProfileBox>
        <Avatar />
        <UserInfo>
          <UserName>심심이</UserName>
          <Stats>
            <span>게시글 123개</span>
            <span>댓글 123개</span>
            <span>좋아요 23개</span>
          </Stats>
        </UserInfo>
      </ProfileBox>
    </RightWrapper>
  );
};

export default MainRight;

const RightWrapper = styled.div`
  padding-left: 20px;
  flex-direction: column;
  gap: 20px;
  width:300px;
  align-items: center;
  display: flex;
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: #ccc;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: bold;
  margin-bottom: 6px;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #666;
  justify-content: space-between;
`;

const Section = styled.div`
  h4 {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: bold;
  }

  ul {
    list-style: none;
    padding: 0;
    font-size: 13px;
    color: #444;

    li {
      margin-bottom: 4px;
      cursor: pointer;
    }
  }

  button {
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fafafa;
    cursor: pointer;
  }
`;
