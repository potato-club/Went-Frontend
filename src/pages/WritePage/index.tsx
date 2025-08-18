import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { uploadPhoto, writePost } from "../../api/write";
import TiptapEditor from "../../components/TiptapEditor";
import { CATEGORIES } from "../../constants/categories";

// 타입 정의
interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WritePostData {
  userId: number;
  content: string;
  categoryId: number;
  thumbnailUrl: string | null;
  title: string;
  stars: number;
}

const WritePage = () => {
  // 상태 관리
  const [formData, setFormData] = useState({
    userId: 12345,
    rating: 0,
    editorContent: "",
    categoryId: 0,
    title: "",
    thumbnailUrl: null as string | null,
  });

  // 이미지 크롭 관련 상태
  const [cropperState, setCropperState] = useState({
    open: false,
    rawImage: null as string | null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    croppedAreaPixels: null as CroppedArea | null,
  });

  const navigate = useNavigate();

  // 입력 검증 함수
  const validateForm = useCallback((): string | null => {
    if (!formData.title.trim()) return "제목을 입력해주세요.";
    if (formData.categoryId === 0) return "카테고리를 선택해주세요.";
    if (!formData.editorContent.trim()) return "내용을 입력해주세요.";
    return null;
  }, [formData]);

  // 별점 클릭 핸들러
  const handleStarClick = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      rating: prev.rating === index + 1 ? 0 : index + 1
    }));
  }, []);

  // 폼 필드 업데이트 핸들러
  const updateFormField = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // 크롭퍼 상태 업데이트 핸들러
  const updateCropperState = useCallback((updates: Partial<typeof cropperState>) => {
    setCropperState(prev => ({ ...prev, ...updates }));
  }, []);

  // 썸네일 파일 선택 핸들러
  const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateCropperState({
        rawImage: reader.result as string,
        open: true,
        crop: { x: 0, y: 0 },
        zoom: 1,
      });
    };
    reader.readAsDataURL(file);
  }, [updateCropperState]);

  // 크롭 완료 핸들러
  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: CroppedArea) => {
    updateCropperState({ croppedAreaPixels });
  }, [updateCropperState]);

  // 이미지 크롭 및 업로드 처리
  const handleImageCropAndUpload = useCallback(async () => {
    if (!cropperState.rawImage || !cropperState.croppedAreaPixels) return;

    try {
      // Canvas를 사용한 이미지 크롭 로직
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();

      await new Promise((resolve) => {
        image.onload = resolve;
        image.src = cropperState.rawImage!;
      });

      const { croppedAreaPixels } = cropperState;
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx?.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      // Canvas를 Blob으로 변환 후 FormData 생성
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8);
      });

      const formDataForUpload = new FormData();
      formDataForUpload.append('files', blob, 'thumbnail.jpg');

      const uploadResponse = await uploadPhoto(formDataForUpload);

      // 응답 구조에 맞게 URL 추출
      let imageUrl = '';
      if (Array.isArray(uploadResponse.data) && uploadResponse.data.length > 0) {
        imageUrl = uploadResponse.data[0];
      } else if (typeof uploadResponse.data === 'string') {
        imageUrl = uploadResponse.data;
      } else if (uploadResponse.data.url) {
        imageUrl = uploadResponse.data.url;
      } else {
        console.error("예상과 다른 응답 형태:", uploadResponse.data);
        alert("썸네일 업로드 응답 형태가 예상과 다릅니다.");
        return;
      }

      updateFormField('thumbnailUrl', imageUrl);
      updateCropperState({ open: false, rawImage: null });

    } catch (error: any) {
      console.error('썸네일 업로드 실패:', error);
      console.error('에러 응답:', error.response);
      console.error('에러 상태:', error.response?.status);
      console.error('에러 데이터:', error.response?.data);

      if (error.response?.status === 413) {
        alert("이미지 크기가 너무 큽니다. 더 작은 이미지를 업로드해주세요.");
      } else if (error.response?.status === 400) {
        alert("잘못된 파일 형식입니다. 이미지 파일만 업로드 가능합니다.");
      } else if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
      } else {
        alert(`썸네일 업로드에 실패했습니다: ${error.response?.data?.message || error.message}`);
      }
    }
  }, [cropperState, updateFormField, updateCropperState]);

  // 게시글 제출 핸들러
  const handleSubmit = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    const postData: WritePostData = {
      userId: 12345,
      title: formData.title,
      content: formData.editorContent,
      categoryId: formData.categoryId,
      stars: formData.rating,
      thumbnailUrl: formData.thumbnailUrl,
    };

    console.log("📤 글 등록 데이터:", postData);

    try {
      const response = await writePost(postData);
      console.log("✅ 글 등록 성공:", response);

      if (response.data?.postId) {
        // navigate(`/posts/${response.data.postId}`);
        alert("게시글이 성공적으로 등록되었습니다!");
        navigate("/");
      } else {
        alert("등록은 되었으나 postId를 받아오지 못했습니다.");
      }
    } catch (error) {
      console.error("❌ 글 등록 실패:", error);
      alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
    }
  }, [formData, validateForm, navigate]);

  return (
    <Container>
      <Title>리뷰 작성</Title>
      <InputBox>
        <OptionBox>
          <Select
            value={formData.categoryId}
            onChange={e => updateFormField('categoryId', Number(e.target.value))}
          >
            <option value="">카테고리</option>
            {CATEGORIES.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.koName}
              </option>
            ))}
          </Select>
          <StarWrapper>
            <span>별점</span>
            {[...Array(5)].map((_, i) => (
              <StarButton key={i} onClick={() => handleStarClick(i)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M16 2L19.09 10.26H28L20.545 15.74L23.635 24L16 18.52L8.365 24L11.455 15.74L4 10.26H12.91L16 2Z"
                    fill={i < formData.rating ? "#1D1D1D" : "#E2E2E2"}
                  />
                </svg>
              </StarButton>
            ))}
          </StarWrapper>
        </OptionBox>

        <Input
          type="text"
          placeholder="제목을 입력해주세요."
          value={formData.title}
          onChange={e => updateFormField('title', e.target.value)}
        />

        {/* 대표 썸네일 업로드 */}
        <ThumbBox>
          <ThumbLabel htmlFor="thumbnail-upload">대표 썸네일 업로드</ThumbLabel>
          <ThumbInput
            id="thumbnail-upload"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
          {formData.thumbnailUrl && (
            <ThumbPreview>
              <img src={formData.thumbnailUrl} alt="썸네일 미리보기" />
            </ThumbPreview>
          )}
        </ThumbBox>

        {/* 크롭퍼 모달 */}
        {cropperState.open && (
          <CropperModal>
            <CropperWrapper>
              <Cropper
                image={cropperState.rawImage!}
                crop={cropperState.crop}
                zoom={cropperState.zoom}
                aspect={4 / 3}
                onCropChange={(crop) => updateCropperState({ crop })}
                onCropComplete={onCropComplete}
                onZoomChange={(zoom) => updateCropperState({ zoom })}
              />
            </CropperWrapper>
            <div>
              <ZoomSliderBox>
                <input
                  type="range"
                  value={cropperState.zoom}
                  min={1}
                  max={5}
                  step={0.1}
                  onChange={(e) => updateCropperState({ zoom: Number(e.target.value) })}
                />
              </ZoomSliderBox>
              <CropperButtonBox>
                <BlackButton type="button" onClick={handleImageCropAndUpload}>
                  자르기 및 업로드
                </BlackButton>
                <WhiteButton
                  type="button"
                  onClick={() => updateCropperState({ open: false })}
                >
                  취소
                </WhiteButton>
              </CropperButtonBox>
            </div>
          </CropperModal>
        )}
      </InputBox>

      <TiptapEditor
        content={formData.editorContent}
        onChange={(content) => updateFormField('editorContent', content)}
      />

      <ButtonBox>
        <WhiteButton>불러오기</WhiteButton>
        <WhiteButton>임시저장</WhiteButton>
        <BlackButton onClick={handleSubmit}>등록</BlackButton>
      </ButtonBox>
    </Container>
  );
};

export default WritePage;

// 스타일드 컴포넌트
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

const ThumbBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 20px 0;
`;

const ThumbLabel = styled.label`
  background-color: #1d1d1d;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
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
  position: relative;
`;

const ZoomSliderBox = styled.div`
  width: 500px;
  background: #fff;
  padding: 20px;
  display: flex;
  justify-content: center;
`;

const CropperButtonBox = styled.div`
  width: 500px;
  background: #fff;
  border-radius: 0 0 12px 12px;
  padding: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 40px;
`;

const BlackButton = styled.button`
  background: #1d1d1d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const WhiteButton = styled.button`
  background: white;
  color: #1d1d1d;
  border: 1px solid #e2e2e2;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;
