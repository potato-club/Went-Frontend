export const useCustomKakaoLogin = () => {
  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  if (!KAKAO_CLIENT_ID || !REDIRECT_URI) {
    alert('카카오 로그인 설정이 잘못되었습니다.');
    return;
  }

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  window.location.href = kakaoAuthUrl;
};
