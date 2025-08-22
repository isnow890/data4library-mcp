# 정보나루 도서검색 MCP (data4library-mcp)

[English README](README.md)

도서관정보나루(Data4Library) API를 활용한 FastMCP 기반 MCP(Model Context Protocol) 서버입니다. 전국 공공도서관·도서·인기도서·이용통계·신착도서 등을 도구로 바로 조회할 수 있습니다.

## 특징

- 도서관 검색/상세/이용통계
- 도서 검색/상세/소장여부/대출 가능 여부
- 인기도서(대출 기반), 급상승 도서, 신착도서
- 지역별 독서량, 월간 인기 키워드
- 지역/주제(KDC) 코드 헬퍼 및 상세 코드 검색
- 세션 통계와 선택적 Rate Limit

## 제공 도구

### 📚 도서관 관련

- **`search_libraries`**: 전국 공공도서관 검색 (지역, 도서관명으로 검색)
- **`get_library_info`**: 도서관별 통합정보 (기본정보 + 대출추이 + 신착도서)
- **`get_usage_trend`**: 도서관별 대출반납 추이 (요일별/시간대별)
- **`get_new_arrival_books`**: 도서관별 신착도서 조회
- **`search_library_codes`**: 도서관명/지역명으로 도서관 코드 검색

### 📖 도서 관련

- **`search_books`**: 도서 검색 (제목, 저자, ISBN, 키워드로 검색)
- **`get_book_detail`**: ISBN으로 도서 상세정보 조회
- **`check_book_availability`**: 특정 도서관에서 도서 소장여부 및 대출 가능여부 확인
- **`search_items`**: 도서관별 장서/대출 데이터 조회
- **`search_libraries_by_book`**: 특정 도서를 소장하는 도서관 검색

### 🔥 인기도서 & 트렌드

- **`search_popular_books`**: 전국 인기대출도서 조회 (성별, 연령, 지역, 주제별 필터링)
- **`search_popular_books_by_library`**: 도서관/지역별 인기대출도서
- **`get_popular_books_by_library`**: 도서관별 인기대출도서 통합 (연령대별 상위 20권)
- **`get_hot_trend`**: 대출 급상승 도서 (최근 7일간 순위 변동)

### 📊 통계 & 분석

- **`get_reading_quantity`**: 지역별 독서량 및 독서율 통계
- **`get_monthly_keywords`**: 이달의 인기 키워드 (대출급상승 도서 기반)

### 🔍 도서 심화 분석

- **`get_book_keywords`**: 도서의 핵심 키워드 목록 (최대 50개)
- **`get_book_usage_analysis`**: 도서별 이용 분석 (대출추이, 키워드, 함께 대출된 도서)
- **`get_mania_recommendations`**: 마니아를 위한 추천도서 (조건부 확률 기반)
- **`get_reader_recommendations`**: 다독자를 위한 추천도서 (지수화된 조건부 확률)

### 🗂️ 코드 헬퍼 도구

- **`get_region_codes`**: 지역 코드 목록 조회
- **`get_detailed_region_codes`**: 특정 지역의 세부지역코드 조회
- **`search_detailed_region_codes`**: 상세 지역코드 검색 (dtl_region 파라미터용)
- **`get_subject_codes`**: KDC 대주제분류 코드 목록
- **`get_detailed_subject_codes`**: 특정 대주제의 세부주제코드 조회
- **`search_detailed_kdc_codes`**: 상세 KDC 세부주제코드 검색 (dtl_kdc 파라미터용)

### ⚙️ 시스템

- **`session_stats`**: 현재 세션의 도구 사용량과 통계 확인

> 💡 **참고**: 각 도구의 상세 매개변수는 `src/schemas/book.schema.ts`에서 확인할 수 있습니다.

## 준비물

- Node.js 18+
- 도서관정보나루 API 키

### API 키 발급 방법

1. https://www.data4library.kr/ 방문하여 회원가입
2. 로그인 후 우측 상단 **[마이페이지]** 클릭
3. 마이페이지에서 **인증키** 메뉴 선택
4. 적당한 **사용목적**을 체크하고 **개인정보 수집 관련 사항에 동의**
5. **수정완료** 버튼 클릭
6. **승인대기중** 상태로 표시됨 (승인까지 시간 소요)
7. 승인 완료 후 발급된 API 키를 환경 변수에 저장

💡 **참고**: 승인 처리에 시간이 걸릴 수 있습니다. 보통 신청 후 다음 날 오전에 승인되는 경우가 많습니다.

### API 호출 제한량

- **기본**: 일일 500건 호출 제한
- **IP 등록 후**: 일일 30,000건 호출 제한

**IP 등록 방법**: 마이페이지 → 인증키 관리에서 **서버IP 입력란**에 MCP 서버를 실행할 컴퓨터의 IP 주소를 등록하면 호출 제한이 500건에서 30,000건으로 확대됩니다.

⚠️ **주의**: 2023년 11월 20일부터 무제한 호출이 폐지되고 최대 일일 30,000건으로 제한되었습니다.

## 설치

### 1단계: 소스 코드 다운로드

이 MCP 서버를 사용하려면 먼저 소스 코드를 다운로드해야 합니다:

#### Git으로 클론하기

```bash
git clone https://github.com/isnow890/data4library-mcp.git
cd data4library-mcp
npm install
npm run build
```

#### 또는 ZIP 파일로 다운로드

1. [GitHub 릴리스 페이지](https://github.com/isnow890/data4library-mcp/releases)에서 최신 버전을 다운로드
2. ZIP 파일을 원하는 위치에 압축 해제
3. 터미널에서 압축 해제된 폴더로 이동:

```bash
cd /path/to/data4library-mcp
npm install
npm run build
```

### 2단계: Claude Desktop 설정

설치가 완료되면 다음 정보가 필요합니다:

- **LIBRARY_API_KEY**: 도서관정보나루에서 발급받은 API 키
- **설치 경로**: 다운로드한 폴더의 절대 경로

#### Windows 설정

Claude Desktop 설정 파일(`%APPDATA%\Claude\claude_desktop_config.json`)에 다음을 추가:

```json
{
  "mcpServers": {
    "data4library-mcp": {
      "type": "stdio",
      "command": "cmd",
      "args": [
        "/c",
        "node",
        "C:\\path\\to\\data4library-mcp\\dist\\src\\index.js"
      ],
      "cwd": "C:\\path\\to\\data4library-mcp",
      "env": {
        "LIBRARY_API_KEY": "발급받은-api-키"
      }
    }
  }
}
```

#### macOS/Linux 설정

Claude Desktop 설정 파일(`~/Library/Application Support/Claude/claude_desktop_config.json`)에 다음을 추가:

```json
{
  "mcpServers": {
    "data4library-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/data4library-mcp/dist/src/index.js"],
      "cwd": "/path/to/data4library-mcp",
      "env": {
        "LIBRARY_API_KEY": "발급받은-api-키"
      }
    }
  }
}
```

### 3단계: 경로 설정 주의사항

⚠️ **중요**: 위 설정에서 다음 경로들을 실제 설치 경로로 변경해야 합니다:

- **Windows**: `C:\\path\\to\\data4library-mcp`를 실제 다운로드한 폴더 경로로 변경
- **macOS/Linux**: `/path/to/data4library-mcp`를 실제 다운로드한 폴더 경로로 변경

경로 찾기:

```bash
# 현재 위치 확인
pwd

# 절대 경로 예시
# Windows: C:\Users\홍길동\Downloads\data4library-mcp
# macOS: /Users/홍길동/Downloads/data4library-mcp
# Linux: /home/홍길동/Downloads/data4library-mcp
```

### 4단계: Claude Desktop 재시작

설정 완료 후 Claude Desktop을 완전히 종료하고 다시 시작하면 데이터포라이브러리 MCP 서버가 활성화됩니다.

## 사용 예시

서울 지역 도서관 검색:

```json
{
  "tool": "search_libraries",
  "params": { "region": "11", "pageSize": 10 }
}
```

도서 상세 조회:

```json
{
  "tool": "get_book_detail",
  "params": { "isbn13": "9788936434120" }
}
```

도서 소장/대출 가능 여부 확인:

```json
{
  "tool": "check_book_availability",
  "params": { "libCode": "111019", "isbn13": "9788936434120" }
}
```

세션 통계 확인:

```json
{ "tool": "session_stats", "params": {} }
```

## 라이선스

MIT. LICENSE 참조.
