export const loadNaverMapScript = (clientId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('naver-map-script')) {
      resolve(); // 이미 로드되어 있으면 바로 resolve
      return;
    }

    const script = document.createElement('script');
    script.id = 'naver-map-script';
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject('네이버 지도 스크립트 로딩 실패');
    document.head.appendChild(script);
  });
};
