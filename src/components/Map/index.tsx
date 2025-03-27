import { useEffect, useRef, useState } from 'react';
import useGeolocation from '../../hooks/useGeolocation';

interface NaverMap {
  maps: {
    Map: any;
    Marker: any;
    InfoWindow: any;
    LatLng: any;
    Event: any;
    Service: any;
  };
}

interface LocationData {
  lat: number;
  lng: number;
}

declare global {
  interface Window {
    naver: NaverMap;
  }
}

function Map() {
  const mapRef = useRef<any>(null);
  const { naver } = window;
  const { currentMyLocation } = useGeolocation();
  const [currentAddress, setCurrentAddress] = useState<string>('');

  // 좌표를 주소로 변환하는 함수
  const reverseGeocode = (lat: number, lng: number) => {
    if (!naver.maps.Service) return;

    naver.maps.Service.reverseGeocode(
      {
        coords: new naver.maps.LatLng(lat, lng),
      },
      (status: any, response: any) => {
        if (status !== naver.maps.Service.Status.OK) {
          return alert('주소를 찾을 수 없습니다!');
        }

        const result = response.v2.results[0];
        if (result) {
          const address = result.jibunAddress || result.roadAddress || '';
          setCurrentAddress(address);
        }
      }
    );
  };

  useEffect(() => {
    if (currentMyLocation.lat !== 0 && currentMyLocation.lng !== 0) {
      // 현재 위치의 주소 정보 가져오기
      reverseGeocode(currentMyLocation.lat, currentMyLocation.lng);

      // 네이버 지도 옵션 선택
      const mapOptions = {
        // 지도의 초기 중심 좌표
        center: new naver.maps.LatLng(
          currentMyLocation.lat,
          currentMyLocation.lng
        ),
        logoControl: false, // 네이버 로고 표시 X
        mapDataControl: false, // 지도 데이터 저작권 컨트롤 표시 X
        scaleControl: true, // 지도 축척 컨트롤의 표시 여부
        tileDuration: 200, // 지도 타일을 전환할 때 페이드 인 효과의 지속 시간(밀리초)
        zoom: 14, // 지도의 초기 줌 레벨
        zoomControl: true, // 줌 컨트롤 표시
        zoomControlOptions: { position: 9 }, // 줌 컨트롤 우하단에 배치
      };

      const mapElement = document.getElementById('map');
      if (mapElement) {
        mapRef.current = new naver.maps.Map(mapElement, mapOptions);
      }

      // 마커 리스트와 정보창 리스트 선언
      const markers: any[] = [];
      const infoWindows: any[] = [];

      const samples: LocationData[] = [
        { lat: currentMyLocation.lat, lng: currentMyLocation.lng },
        { lat: 37.5666103, lng: 126.9783882 },
        { lat: 37.5796103, lng: 126.9772882 },
      ]; // 좌표 샘플

      for (let i = 0; i < samples.length; i++) {
        // 현재 내 위치 마커 표시
        const marker = new naver.maps.Marker({
          // 생성될 마커의 위치
          position: new naver.maps.LatLng(samples[i].lat, samples[i].lng),
          // 마커를 표시할 Map 객체
          map: mapRef.current,
        });

        // 정보창 객체
        const infoWindow = new naver.maps.InfoWindow({
          content: [
            '<div style="padding: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;">',
            `   <div style="font-weight: bold; margin-bottom: 5px;">여기는 제목${
              i + 1
            }</div>`,
            `   <div style="font-size: 13px;">여기는 내용${i + 1}<div>`,
            '</div>',
          ].join(''),
          maxWidth: 300,
          anchorSize: {
            width: 12,
            height: 14,
          },
          borderColor: '#cecdc7',
        });

        markers.push(marker);
        infoWindows.push(infoWindow);
      }

      // 각 마커에 이벤트가 발생했을 때 기능 설정
      const getClickHandler = (index: number) => () => {
        if (infoWindows[index].getMap()) {
          infoWindows[index].close();
        } else if (mapRef.current !== null) {
          infoWindows[index].open(mapRef.current, markers[index]);
        }
      };

      // 각 마커에 이벤트 핸들러 설정
      for (let i = 0; i < markers.length; i++) {
        naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
      }
    }
  }, [currentMyLocation]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div id='map' style={{ width: '100%', height: '100%' }} />
      {currentAddress && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            zIndex: 100,
          }}
        >
          <strong>현재 위치:</strong> {currentAddress}
        </div>
      )}
    </div>
  );
}

export default Map;
