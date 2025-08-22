/**
 * 위치 기반 유틸리티 함수들
 */

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LibraryWithDistance {
  libName: string;
  region: string;
  address: string;
  tel: string;
  fax: string;
  homepage: string;
  closed: string;
  operatingTime: string;
  libCode: string;
  latitude: number;
  longitude: number;
  distance: number; // km 단위
}

/**
 * Haversine 공식을 사용하여 두 지점 간의 거리를 계산합니다.
 * @param lat1 첫 번째 지점의 위도
 * @param lon1 첫 번째 지점의 경도
 * @param lat2 두 번째 지점의 위도
 * @param lon2 두 번째 지점의 경도
 * @returns 두 지점 간의 거리 (km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // 소수점 둘째자리까지
}

/**
 * 도를 라디안으로 변환합니다.
 * @param degrees 도 단위 각도
 * @returns 라디안 단위 각도
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 도서관 데이터에서 위도/경도를 추출하고 거리를 계산합니다.
 * @param library 도서관 데이터
 * @param userLat 사용자 위도
 * @param userLon 사용자 경도
 * @returns 거리 정보가 포함된 도서관 데이터
 */
export function addDistanceToLibrary(
  library: any,
  userLat: number,
  userLon: number
): LibraryWithDistance | null {
  // 위도/경도 데이터 추출 (fax, homepage 필드에 저장됨)
  const latitude = parseFloat(library.fax);
  const longitude = parseFloat(library.homepage);
  
  // 유효한 좌표인지 확인
  if (isNaN(latitude) || isNaN(longitude)) {
    return null;
  }
  
  // 거리 계산
  const distance = calculateDistance(userLat, userLon, latitude, longitude);
  
  return {
    ...library,
    latitude,
    longitude,
    distance
  };
}

/**
 * 도서관 목록을 거리순으로 정렬합니다.
 * @param libraries 도서관 목록
 * @returns 거리순으로 정렬된 도서관 목록
 */
export function sortLibrariesByDistance(
  libraries: LibraryWithDistance[]
): LibraryWithDistance[] {
  return libraries.sort((a, b) => a.distance - b.distance);
}