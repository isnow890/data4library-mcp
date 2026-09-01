# 정보나루 도서검색 MCP

<p align="center">
  <img src="assets/data4library-mcp-logo.png" alt="정보나루 도서검색 MCP 로고" width="200" />
</p>

도서관 정보나루 API를 MCP 도구로 제공하는 Node.js 서버입니다.

이 프로젝트는 도서관 정보나루 운영기관이 제공하는 공식 MCP와 무관한 독립 오픈소스 프로젝트입니다.

> **운영 안내**
> 최근 정보나루 API에서 응답 지연과 타임아웃이 간헐적으로 관찰되고 있습니다. 도구 호출이
> 실패하거나 늦어질 때에는 이 MCP 서버와 정보나루 API 상태를 함께 확인하세요.

[English documentation](README-en.md)

## 제공 도구

현재 27개 도구를 등록합니다.

### 도서관

- `search_libraries`: 지역·도서관명으로 공공도서관 검색
- `search_nearby_libraries`: 좌표에서 가까운 도서관을 거리순으로 검색
- `search_library_codes`: 도서관명·지역명으로 `libCode` 검색
- `get_library_info`: 도서관 통합정보 조회

### 도서·소장

- `search_books`: 제목·저자·출판사·주제별 도서 검색
- `get_book_detail`: ISBN으로 도서 상세정보 조회
- `search_libraries_by_book`: 특정 도서를 소장한 도서관 검색
- `check_book_availability`: 특정 도서관의 소장 여부와 전일 기준 대출 가능 여부 조회
- `get_new_arrival_books`: 도서관별 신착도서 조회

### 인기·트렌드

- `search_popular_books`: 전국·지역별 인기대출도서 조회
- `search_popular_books_by_library`: 도서관·지역별 인기대출도서 조회
- `get_popular_books_by_library`: 도서관별 인기대출도서 통합 조회
- `get_hot_trend`: 대출 급상승 도서 조회
- `get_monthly_keywords`: 이달의 키워드 조회

### 통계·분석

- `get_usage_trend`: 도서관별 대출·반납 추이 조회
- `get_reading_quantity`: 지역별 독서량 조회
- `search_items`: 도서관별 장서·대출 데이터 조회
- `get_book_usage_analysis`: 도서 이용 분석 조회
- `get_book_keywords`: 도서 키워드 조회

### 추천

- `get_mania_recommendations`: 마니아 추천도서 조회
- `get_reader_recommendations`: 다독자 추천도서 조회

### 코드 조회

- `get_region_codes`: 지역 코드 목록
- `get_detailed_region_codes`: 세부 지역 코드 목록
- `search_detailed_region_codes`: 세부 지역 코드 검색
- `get_subject_codes`: KDC 대분류 코드 목록
- `get_detailed_subject_codes`: KDC 세부 분류 코드 목록
- `search_detailed_kdc_codes`: KDC 세부 분류 코드 검색

## 설치

### 준비 사항

- Node.js 18 이상
- [도서관 정보나루](https://www.data4library.kr/) API 키

API 키는 정보나루 로그인 후 `마이페이지 > 인증키`에서 신청할 수 있습니다. 호출 한도와
서버 IP 등록 정책은 정보나루의 최신 안내를 따르세요.

### NPX

MCP 클라이언트 설정에 다음 서버를 추가합니다.

```json
{
  "mcpServers": {
    "data4library-mcp": {
      "command": "npx",
      "args": ["-y", "@isnow890/data4library-mcp"],
      "env": {
        "LIBRARY_API_KEY": "your-api-key"
      }
    }
  }
}
```

`LIBRARY_API_TIMEOUT_MS`로 원천 요청 제한 시간을 조정할 수 있습니다. 기본값은 10초이며
50~60000ms 범위만 허용합니다.

### 로컬 설치

```bash
git clone https://github.com/isnow890/data4library-mcp.git
cd data4library-mcp
npm install
npm run build
```

MCP 클라이언트에서는 빌드 결과인 `dist/src/index.js`를 실행합니다.

```json
{
  "mcpServers": {
    "data4library-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/data4library-mcp/dist/src/index.js"],
      "cwd": "/absolute/path/to/data4library-mcp",
      "env": {
        "LIBRARY_API_KEY": "your-api-key"
      }
    }
  }
}
```

## 로컬 실행

```bash
export LIBRARY_API_KEY="your-api-key"
npm run build
npm start
```

Docker로 실행할 수도 있습니다.

```bash
docker build -t data4library-mcp .
docker run -i --rm -e LIBRARY_API_KEY="$LIBRARY_API_KEY" data4library-mcp
```

## 사용 예시

- “서울 강남구 공공도서관 찾아줘”
  - `search_detailed_region_codes`로 지역 코드를 찾고 `search_libraries`를 호출합니다.
- “이 ISBN을 소장한 서울 도서관 찾아줘”
  - `search_libraries_by_book`을 호출합니다.
- “이 도서관에 이 책이 있고 전일 기준으로 대출 가능했어?”
  - `check_book_availability`을 호출합니다.
- “요즘 20대가 많이 빌린 책 보여줘”
  - `search_popular_books`를 연령 조건과 함께 호출합니다.

## 데이터와 제한사항

- 데이터 출처는 [도서관 정보나루](https://www.data4library.kr/)입니다.
- 소장·통계 데이터의 갱신 시점은 정보나루 원천을 따릅니다.
- `check_book_availability`의 대출 가능 여부는 전일 기준이며 실시간 예약·대출 상태를
  보장하지 않습니다.
- `search_nearby_libraries`의 거리는 직선거리이며 실제 이동 거리와 다를 수 있습니다.

## 개발

```bash
npm run build
npm run watch
```

자동 회귀 테스트는 아직 구성되어 있지 않습니다.

## 라이선스

[MIT](LICENSE)
