import React, { useState, useEffect } from 'react';

// Define interfaces for the API response structure
interface GeocodingResult {
  region: {
    area1: { name: string };
    area2: { name: string };
  };
}

interface GeocodingResponse {
  status: {
    name: string;
  };
  results: GeocodingResult[];
}

const LocationFinder: React.FC = () => {
  const [locationInfo, setLocationInfo] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 네이버 지도 스크립트 로드
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_MAP_API_KEY}&submodules=geocoder`;
    script.async = true;

    script.onload = () => {
      console.log('Naver Maps script loaded');

      // 위치 정보 가져오기
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            console.log('Position obtained:', position.coords);

            // 대안적인 주소 변환 방법
            const { latitude, longitude } = position.coords;

            // 직접 API 호출 방식으로 변경
            fetch(
              `/map-reversegeocode/v2/reverseGeocode?request=coordsToaddr&coords=${longitude},${latitude}&sourcecrs=epsg:4326&output=json&orders=roadaddr`,
              {
                method: 'GET',
                headers: {
                  'X-NCP-APIGW-API-KEY-ID':
                    process.env.REACT_APP_NAVER_MAP_API_KEY ?? '',
                  'X-NCP-APIGW-API-KEY':
                    process.env.REACT_APP_NAVER_MAP_SECRET_KEY ?? '',
                },
              }
            )
              .then((response) => {
                console.log('API Response Status:', response.status);
                // 응답 텍스트 먼저 확인
                return response.text().then((text) => {
                  console.log('Response Text:', text); // 처음 200자만 로그
                  try {
                    return JSON.parse(text); // 텍스트를 JSON으로 변환
                  } catch (e) {
                    throw new Error(
                      `Invalid JSON: ${text.substring(0, 100)}...`
                    );
                  }
                });
              })
              .then((data: GeocodingResponse) => {
                console.log('Geocode Response:', data);

                // API 응답에서 주소 추출
                if (data.status.name === 'ok') {
                  const result = data.results[0];
                  const sido = result.region.area1.name || '';
                  const sigungu = result.region.area2.name || '';

                  // 위치 정보 포맷팅
                  const formattedLocation = `나의 현재 위치는 "${sido} ${sigungu}" 입니다`;

                  setLocationInfo(formattedLocation);
                } else {
                  setError(
                    `주소를 찾을 수 없습니다. 상태: ${data.status.name}`
                  );
                }
              })
              .catch((err: Error) => {
                console.error('Geocode API Error:', err);
                setError('주소 변환 중 오류가 발생했습니다.');
              });
          },
          (err: GeolocationPositionError) => {
            console.error('Geolocation error:', err);
            switch (err.code) {
              case err.PERMISSION_DENIED:
                setError('위치 정보 접근 권한이 거부되었습니다.');
                break;
              case err.POSITION_UNAVAILABLE:
                setError('위치 정보를 사용할 수 없습니다.');
                break;
              case err.TIMEOUT:
                setError('위치 정보 요청 시간이 초과되었습니다.');
                break;
              default:
                setError('알 수 없는 오류가 발생했습니다.');
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        setError('현재 브라우저에서 위치 서비스를 지원하지 않습니다.');
      }
    };

    script.onerror = () => {
      console.error('Naver Maps script load error');
      setError('네이버 지도 스크립트를 로드하는 데 실패했습니다.');
    };

    // 스크립트를 문서에 추가
    document.head.appendChild(script);

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : locationInfo ? (
        <p>{locationInfo}</p>
      ) : (
        <p>위치 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default LocationFinder;
