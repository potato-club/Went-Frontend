import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

interface AddressSearchProps {
  onAddressSelect: (address: string) => void;
}

interface AddressResult {
  roadAddress: string;
  jibunAddress: string;
  englishAddress: string;
  x: string; // 경도
  y: string; // 위도
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onAddressSelect }) => {
  const [keyword, setKeyword] = useState<string>('');
  const [results, setResults] = useState<AddressResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const naverMapRef = useRef<any>(null);

  // 네이버 지도 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    // script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_MAP_API_KEY}&submodules=geocoder`;
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_MAP_API_KEY}&submodules=geocoder`;
    script.async = true;

    script.onload = () => {
      console.log('Naver Maps script loaded successfully');
      naverMapRef.current = (window as any).naver;

      // // 네이버 맵 객체 구조 확인
      // console.log('Naver Map Object:', naverMapRef.current);
      // console.log('Maps Object:', naverMapRef.current.maps);
      // console.log('Service Object:', naverMapRef.current.maps.Service);

      // console.log('Naver Maps script loaded successfully');
      naverMapRef.current = (window as any).naver;
    };

    script.onerror = () => {
      setError('네이버 지도 스크립트를 로드하는 데 실패했습니다.');
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 주소 검색 함수 수정
  const searchAddress = async () => {
    console.log(keyword);
    console.log(encodeURIComponent(keyword));
    if (!keyword.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(
          keyword
        )}`,
        {
          headers: {
            'X-NCP-APIGW-API-KEY-ID':
              process.env.REACT_APP_NAVER_MAP_API_KEY || '',
            'X-NCP-APIGW-API-KEY':
              process.env.REACT_APP_NAVER_MAP_SECRET_KEY || '',
            Accept: 'application/json',
          },
        }
      );

      console.log('Response status:', response.status);

      // 응답 텍스트 먼저 확인
      const text = await response.text();
      console.log('Response text:', text); // 처음 200자만 출력

      try {
        const data = JSON.parse(text);
        console.log('API Response:', data);

        if (data.addresses && data.addresses.length > 0) {
          const addresses = data.addresses.map(
            (item: {
              roadAddress: any;
              jibunAddress: any;
              englishAddress: any;
              x: any;
              y: any;
            }) => ({
              roadAddress: item.roadAddress,
              jibunAddress: item.jibunAddress,
              englishAddress: item.englishAddress,
              x: item.x,
              y: item.y,
            })
          );

          setResults(addresses);
        } else {
          setResults([]);
          setError('검색 결과가 없습니다.');
        }
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        setError('응답 데이터 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('주소 검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 주소 선택 핸들러
  const handleAddressSelect = (address: AddressResult) => {
    onAddressSelect(address.roadAddress);
  };

  return (
    <Container>
      <SearchBar>
        <Input
          type='text'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='도로명 주소 ex) 오금로 16'
          onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
        />
        <SearchButton onClick={searchAddress}>검색</SearchButton>
      </SearchBar>

      {loading && <LoadingText>검색 중...</LoadingText>}
      {error && <ErrorText>{error}</ErrorText>}

      {results.length > 0 && (
        <ResultList>
          {results.map((result, index) => (
            <ResultItem key={index} onClick={() => handleAddressSelect(result)}>
              <AddressType>도로명</AddressType>
              <AddressText>{result.roadAddress}</AddressText>
              {result.jibunAddress && (
                <>
                  <AddressType>지번</AddressType>
                  <AddressText>{result.jibunAddress}</AddressText>
                </>
              )}
            </ResultItem>
          ))}
        </ResultList>
      )}
    </Container>
  );
};

// 스타일 컴포넌트
const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const SearchBar = styled.div`
  display: flex;
  /* margin-bottom: 16px; */
  /* height: 60px; */
  /* width: 100%; */
  border: 2px solid #c6c4c2;
`;

const Input = styled.input`
  flex: 6;
  /* padding: 10px 16px; */
  /* border: 2px solid #ddd; */
  border: none;
  font-size: 16px;
  width: 100%;
  height: 60px;
  text-align: center;
  padding: 0;
`;

const SearchButton = styled.button`
  flex: 1;
  /* padding: 20px; */
  background-color: #d0b9a8;
  color: #2d2d2d;
  cursor: pointer;
  height: 60px;
  border: none;
  /* border: 2px solid #c6c4c2; */
  /* padding: 1px 2px; */

  &:hover {
    background-color: #02b350;
  }
`;

const ResultList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  /* border: 1px solid #ddd; */
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
`;

const ResultItem = styled.li`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f5f5;
  }
`;

const AddressType = styled.span`
  display: inline-block;
  padding: 2px 6px;
  background-color: #f1f1f1;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 4px;
`;

const AddressText = styled.p`
  margin: 4px 0 8px 0;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #666;
`;

const ErrorText = styled.p`
  color: #e74c3c;
  text-align: center;
`;

export default AddressSearch;
