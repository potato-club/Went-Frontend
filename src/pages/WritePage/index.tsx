import { useState } from "react";
import styled from "styled-components";
import TiptapEditor from "../../components/TiptapEditor";

const WritePage = () => {
  const [rating, setRating] = useState(0); // 별점 상태 (0~5)
  const [editorContent, setEditorContent] = useState("");

  const handleClick = (index: number) => {
    // 같은 별 다시 누르면 초기화
    if (rating === index + 1) {
      setRating(0);
    } else {
      setRating(index + 1);
    }
  };

  const handleSubmit = () => {
    console.log("에디터 내용:", editorContent);
  };
  return (
    <Container>
      <Title>리뷰 작성</Title>
      <InputBox>
        <OptionBox>
          <Select>
            <option value="">카테고리</option>
            <option value="movie">영화</option>
            <option value="book">도서</option>
            <option value="performance">공연</option>
          </Select>

          <Select>
            <option value="">매체</option>
            <option value="youtube">유튜브</option>
            <option value="netflix">넷플릭스</option>
            <option value="instagram">인스타그램</option>
          </Select>
          <StarWrapper>
            <span>별점</span>
            {[...Array(5)].map((_, i) => (
              <StarButton key={i} onClick={() => handleClick(i)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M16 2L19.09 10.26H28L20.545 15.74L23.635 24L16 18.52L8.365 24L11.455 15.74L4 10.26H12.91L16 2Z"
                    fill={i < rating ? "#1D1D1D" : "#E2E2E2"}
                  />
                </svg>
              </StarButton>
            ))}
          </StarWrapper>
        </OptionBox>
        <Input type="text" placeholder="제목을 입력해주세요." />
      </InputBox>
      {/* <div>위지윅 에디터 부분</div> */}
      <TiptapEditor content={editorContent} onChange={setEditorContent} />

      <ButtonBox>
        <button>불러오기</button>
        <button>임시저장</button>
        <button onClick={handleSubmit}>등록</button>
      </ButtonBox>
    </Container>
  );
};

export default WritePage;

const Container = styled.div`
  /* border: 2px solid red; */
  margin: 0 140px;
  margin-top: 100px;
`;

const Title = styled.div`
  /* border: 2px solid green; */
  font-size: 38px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 50px;
`;

const InputBox = styled.div`
  /* border: 2px solid blue; */
`;

const OptionBox = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
`;

const Select = styled.select`
  width: 30%;
  font-size: 18px;
  font-weight: 500;
  border: none;
  border-bottom: 2px solid black;
  background: none;
  appearance: none;
  padding: 0 20px;
`;

// const Category = styled.div`
//   border-bottom: 2px solid black;
//   font-size: 22px;
//   font-style: normal;
//   font-weight: 500;
//   line-height: normal;
//   width: 30%;
// `;

// const Media = styled.div`
//   border-bottom: 2px solid black;
//   font-size: 22px;
//   font-style: normal;
//   font-weight: 500;
//   line-height: normal;
//   width: 30%;
// `;

const StarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  font-size: 18px;
  font-weight: 500;
  border: none;
  border-bottom: 2px solid black;
  background: none;
  appearance: none;
  padding: 8px;
  text-align: center;

  span {
    margin-right: 15px;
  }
`;

const StarButton = styled.button`
  width: 16%;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  svg {
    display: block;
  }
`;

const Input = styled.input`
  width: 100%;
  border: none;
  font-size: 30px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  /* padding: 10px;   */
  margin: 30px 0;
`;

const ButtonBox = styled.div`
  float: right;
  padding: 40px 0;

  display: flex;
  gap: 10px;
`;
