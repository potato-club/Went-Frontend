import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { uploadPhoto, writePost } from "../../api/write";
import TiptapEditor from "../../components/TiptapEditor";
import { CATEGORIES } from "../../constants/categories";

const WritePage = () => {
  const [rating, setRating] = useState(0);
  const [editorContent, setEditorContent] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [title, setTitle] = useState("");
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // react-easy-crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const navigate = useNavigate();

  const handleClick = (index: number) => {
    if (rating === index + 1) {
      setRating(0);
    } else {
      setRating(index + 1);
    }
  };

  const handleSubmit = async () => {
    const postData = {
      userId: "test-key",
      content: editorContent,
      categoryId: categoryId,
      photoUrls: thumbnailUrl ? [thumbnailUrl] : [],
      title: title,
    };

    console.log("📤 글 등록 데이터:", postData);

    try {
      const res = await writePost(postData);

      console.log("✅ 글 등록 성공:", res);
      if (res.data && res.data.postId) {
        // navigate(`/posts/${res.data.postId}`);
      } else {
        alert("등록은 되었으나 postId를 받아오지 못했습니다.");
      }
    } catch (error) {
      alert("등록에 실패했습니다.");
    }
  };

  // 썸네일 파일 선택 시
  const handleThumbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawImage(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // react-easy-crop 콜백
  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // canvas에서 crop된 이미지 추출
  const getCroppedImg = async (imageSrc: string, crop: any) => {
    const image = new window.Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/png");
    });
  };

  // 자르기 완료 시
  const handleCrop = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(rawImage, croppedAreaPixels);
    if (croppedBlob) {
      const formData = new FormData();
      formData.append("files", croppedBlob, "thumbnail.png");
      try {
        const res = await uploadPhoto(formData);
        const url = res.data;
        console.log("✅ 썸네일 업로드 성공:", url);
        setThumbnailUrl(url);
        setCropperOpen(false);
        setRawImage(null);
      } catch (err) {
        alert("썸네일 업로드에 실패했습니다.");
      }
    }
  };

  return (
    <Container>
      <Title>리뷰 작성</Title>
      <InputBox>
        <OptionBox>
          <Select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}>
            <option value="">카테고리</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.koName}
              </option>
            ))}
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
        <Input
          type="text"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        {/* 대표 썸네일 업로드 */}
        <ThumbBox>
          <ThumbLabel htmlFor="thumbnail-upload">대표 썸네일 업로드</ThumbLabel>
          <ThumbInput
            id="thumbnail-upload"
            type="file"
            accept="image/*"
            onChange={handleThumbFileChange}
          />
          {thumbnailUrl && (
            <span>✅</span>
          )}
        </ThumbBox>
        {/* Cropper 모달/영역 */}
        {cropperOpen && rawImage && (
          <CropperModal>
            <div>
              <CropperWrapper>
                <Cropper
                  image={rawImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={500 / 393}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  cropShape="rect"
                  showGrid={false}
                  zoomWithScroll={false} // 스크롤로 줌 비활성화
                />
              </CropperWrapper>
              {/* 줌 슬라이더 추가 */}
              <ZoomSliderBox>
                <ZoomLabel>크기 조절</ZoomLabel>
                <ZoomSlider
                  type="range"
                  value={zoom}
                  min={1}
                  max={5}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </ZoomSliderBox>
              <CropperButtonBox>
                <BlackButton type="button" onClick={handleCrop}>자르기 및 업로드</BlackButton>
                <WhiteButton type="button" onClick={() => setCropperOpen(false)}>취소</WhiteButton>
              </CropperButtonBox>
            </div>
          </CropperModal>
        )}
      </InputBox>
      <TiptapEditor content={editorContent} onChange={setEditorContent} />

      <ButtonBox>
        <WhiteButton>불러오기</WhiteButton>
        <WhiteButton>임시저장</WhiteButton>
        <BlackButton onClick={handleSubmit}>등록</BlackButton>
      </ButtonBox>
    </Container>
  );
};

export default WritePage;

// 스타일 컴포넌트는 기존 코드와 동일하게 사용
const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  height: calc(100vh - 60px);
`;

const Title = styled.div`
  font-size: 38px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 50px;
`;

const InputBox = styled.div``;

const OptionBox = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
`;

const Select = styled.select`
  width: 45%;
  font-size: 18px;
  font-weight: 500;
  border: none;
  border-bottom: 1px solid #e2e2e2;
  background: url("arrow-down-gray.svg") no-repeat right 10px center;
  background-size: 16px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0 20px;
  outline: none;
`;

const StarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45%;
  font-size: 18px;
  font-weight: 500;
  border: none;
  border-bottom: 1px solid #e2e2e2;
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
  width: 96%;
  border: none;
  font-size: 30px;
  font-style: normal;
  line-height: normal;
  padding: 0 2%;
  margin: 30px 0;
  outline: none;

  &::placeholder {
    color: #e2e2e2;
  }
`;

const ButtonBox = styled.div`
  float: right;
  padding: 40px 0;
  display: flex;
  gap: 15px;
`;

const WhiteButton = styled.button`
  background-color: #fff;
  color: #1d1d1d;
  border: 1px solid #1d1d1d;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
`;

const BlackButton = styled.button`
  background-color: #1d1d1d;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
`;

const ThumbBox = styled.div`
  margin: 20px 0 10px 0;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ThumbLabel = styled.label`
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
`;

const ThumbInput = styled.input`
  display: none;
`;

const ThumbPreview = styled.div`
  width: 80px;
  height: 80px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const CropperModal = styled.div`
  position: fixed;
  z-index: 2000;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CropperWrapper = styled.div`
  width: 500px;
  height: 393px;
  background: #fff;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const CropperButtonBox = styled.div`
  width: 500px;
  background: #fff;
  border-radius: 0 0 12px 12px;
  display: flex;
  gap: 10px;
  margin-bottom: 0;
  padding: 16px 0;
  justify-content: center;
`;

const ZoomSliderBox = styled.div`
  width: 100%;
  max-width: 100%;
  background: #fff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-sizing: border-box;
`;

const ZoomLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #1d1d1d;
  min-width: 60px;
  flex-shrink: 0;
`;

const ZoomSlider = styled.input`
  flex: 1;
  min-width: 0; /* flex item이 줄어들 수 있도록 */
  height: 4px;
  background: #e2e2e2;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #1d1d1d;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #1d1d1d;
    cursor: pointer;
    border: none;
  }
`;