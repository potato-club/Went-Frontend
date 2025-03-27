import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
}

const useGeolocation = () => {
  const [currentMyLocation, setCurrentMyLocation] = useState<Location>({
    lat: 0,
    lng: 0,
  });
  const [locationLoading, setLocationLoading] = useState<boolean>(false);

  const getCurPosition = (): void => {
    setLocationLoading(true);
    const success = (location: GeolocationPosition): void => {
      setCurrentMyLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      setLocationLoading(false);
    };

    const error = (): void => {
      setCurrentMyLocation({ lat: 37.5666103, lng: 126.9783882 });
      setLocationLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  useEffect(() => {
    getCurPosition();
  }, []);

  return { currentMyLocation, locationLoading, getCurPosition };
};

export default useGeolocation;
