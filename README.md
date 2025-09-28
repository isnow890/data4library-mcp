[![smithery badge](https://smithery.ai/badge/@isnow890/data4library-mcp)](https://smithery.ai/server/@isnow890/data4library-mcp)
[![MSeeP.ai Security Assessment Badge](https://mseep.net/pr/isnow890-data4library-mcp-badge.png)](https://mseep.ai/app/isnow890-data4library-mcp)

<div align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/rottenbridge-e6efa.appspot.com/o/logo.jpg?alt=media&token=68d16fd2-799f-4aba-8c1e-da6977e2949e" alt="Data4Library MCP Server Logo" width="300"/>
</div>

# 📚 정보나루 도서검색 MCP (data4library-mcp)

**도서관 정보나루 MCP**는 **국립중앙도서관**에서 제공하는 **도서관 정보나루 API**를 완전히 활용할 수 있도록 개발된 포괄적인 **MCP(Model Context Protocol) 서버**입니다. 한국의 모든 공공도서관 정보, 도서 검색, 대출 현황, 독서 통계 등을 AI 모델에서 쉽게 접근하고 활용할 수 있게 해줍니다.

> 🇺🇸 **English Documentation**: [README-en.md](README-en.md)

## 🚀 빠른 설치 (Smithery 권장)

**가장 쉬운 설치 방법**은 [Smithery](https://smithery.ai)를 사용하는 것입니다:

**🔗 [Smithery에서 설치하기](https://smithery.ai/server/@isnow890/data4library-mcp)**

1. 위 링크를 클릭하여 Smithery 페이지로 이동
2. **"Install"** 버튼 클릭
3. API 키 입력 (아래 API 키 발급 방법 참조)
4. Claude Desktop에서 바로 사용 가능!

## 🌟 도서관 정보나루(Data4Library)란?

[도서관 정보나루](https://www.data4library.kr/)는 **국립중앙도서관**이 운영하는 **전국 공공도서관 통합 정보 서비스**입니다. 전국 1,000여 개 공공도서관의 실시간 데이터를 통합하여 제공하며, 다음과 같은 정보를 포함합니다:

- 📍 **전국 공공도서관 위치 및 운영정보** (1,000+ 개관)
- 📖 **도서 소장 및 대출 현황** (실시간)
- 📊 **대출 통계 및 트렌드 분석**
- 🔥 **인기도서 및 급상승 도서**
- 📈 **지역별/연령별 독서량 통계**
- 🆕 **신착도서 정보**

## 🎯 주요 기능 (25개 도구)

### 📚 도서관 & 도서 검색

- **🏛️ 전국 공공도서관 검색** (`search_libraries`): 지역별, 도서관명으로 검색
- **📖 도서 통합 검색** (`search_books`): 제목, 저자, 출판사, 주제별 도서 검색
- **🔍 도서관별 소장도서 검색** (`search_libraries_by_book`): 특정 도서를 소장한 도서관 찾기
- **📋 도서 상세정보** (`get_book_detail`): ISBN으로 상세 정보 조회
- **✅ 대출 가능 여부** (`check_book_availability`): 실시간 대출 가능 상태 확인

### 📊 인기도서 & 트렌드 분석

- **🔥 인기 대출도서** (`search_popular_books`): 전국/지역별 베스트셀러
- **🏆 도서관별 인기도서** (`search_popular_books_by_library`): 특정 도서관의 인기도서
- **📈 대출 급상승 도서** (`get_hot_trend`): 트렌딩 도서 실시간 조회
- **🆕 신착도서** (`get_new_arrival_books`): 도서관별 새로 들어온 도서
- **🏷️ 이달의 키워드** (`get_monthly_keywords`): 독서 트렌드 키워드

### 📈 통계 & 분석 도구

- **📊 대출반납 추이** (`get_usage_trend`): 도서관별 이용 통계 그래프
- **🌍 지역별 독서량** (`get_reading_quantity`): 독서율 및 독서량 비교
- **📚 장서/대출 데이터** (`search_items`): 도서관별 상세 통계
- **📖 도서 이용 분석** (`get_book_usage_analysis`): 특정 도서의 이용 패턴

### 🎯 개인화 추천 시스템

- **🎓 마니아 추천도서** (`get_mania_recommendations`): 전문가용 심화 도서
- **📚 다독자 추천도서** (`get_reader_recommendations`): 연속 독서용 도서
- **🏷️ 도서 키워드 분석** (`get_book_keywords`): 도서별 핵심 키워드

### 🗺️ 위치 기반 서비스 (독자적 구현)

- **📍 내 주변 도서관 검색** (`search_nearby_libraries`): GPS 기반 가까운 도서관 자동 검색
  - **거리순 정렬**: 실시간 거리 계산 및 가까운 순서로 정렬
  - **상세 거리 정보**: 각 도서관까지의 정확한 거리(km) 표시

### 🔧 코드 검색 도구 (API 연동 지원)

- **🏛️ 도서관 코드 검색** (`search_library_codes`): 도서관명으로 libCode 찾기
- **🌍 지역코드 조회** (`get_region_codes`, `get_detailed_region_codes`): 전국/세부 지역코드
- **📚 주제분류코드** (`get_subject_codes`, `get_detailed_subject_codes`): KDC 대/세분류
- **📊 통합정보 조회** (`get_library_info`, `get_popular_books_by_library`): 도서관별 종합 정보

### 🛠️ 세션 관리

- **📊 사용량 통계** (`session_stats`): 실시간 도구 호출 통계 및 세션 정보

## 💡 실제 사용 시나리오

### 🔍 도서관 찾기

- **"내 주변 도서관 어디 있어?"** → `search_nearby_libraries` 사용
- **"서울 강남구 도서관 찾아줘"** → `search_detailed_region_codes` + `search_libraries` 순차 사용

### 📖 도서 검색

- **"해리포터 책 어디서 빌릴 수 있어?"** → `search_books` + `search_libraries_by_book` 연계
- **"김영하 작가 소설 찾아줘"** → `search_books` (저자명 검색)

### 📊 트렌드 분석

- **"요즘 인기 있는 책 뭐야?"** → `search_popular_books` 또는 `get_hot_trend`
- **"강남도서관에서 인기 있는 책"** → `search_library_codes` + `search_popular_books_by_library`

### 📈 통계 분석

- **"서울 사람들이 책을 얼마나 많이 읽어?"** → `get_reading_quantity`
- **"도서관 이용 그래프 보여줘"** → `get_usage_trend`

### 🎯 복합 쿼리 예시

- **"내 주변 도서관들의 신간 도서 현황"**

  1. `search_nearby_libraries` (위치 기반 도서관 검색)
  2. `get_new_arrival_books` (각 도서관별로 신간 조회)

- **"강남구 도서관에서 경제서적 인기 순위 보여줘"**
  1. `search_detailed_region_codes` (강남구 코드 조회)
  2. `get_subject_codes` (경제 분야 코드 조회)
  3. `search_popular_books_by_library` (필터 적용하여 검색)

## 🚀 기술적 특징

- **✅ 완전한 API 래핑**: 도서관 정보나루 API 25개 엔드포인트 전체 지원
- **🔗 스마트 체이닝**: 도구 간 자동 연계로 복잡한 쿼리 처리
- **⚡ 실시간 데이터**: 도서관 정보나루와 실시간 동기화
- **🗺️ 위치 기반 알고리즘**: 자체 구현한 Haversine 공식 기반 거리 계산 및 정렬
- **🛡️ Zod 스키마 검증**: 모든 입력값 타입 안전성 보장
- **📊 세션 통계**: 도구 사용량 실시간 모니터링
- **🔧 오류 처리**: 상세한 로깅 및 디버깅 정보
- **🎯 시나리오 기반 설명**: LLM이 상황에 맞는 도구를 쉽게 선택할 수 있도록 구체적인 사용 시나리오 제공

## 🎬 활용 사례

### 🏛️ 시민/기관 포털

- 동네 도서관 현황 및 운영 정보 챗봇
- 신간/인기도서 알림 서비스

### 🎓 교육/연구

- KDC 주제별 독서 트렌드 분석
- 연령/지역별 독서 통계 리포트

### 📈 출판/마케팅

- 인기 장르/도서 발굴 (연령/성별/지역별)
- 트렌드 변화 모니터링

### 📱 앱/서비스

- ISBN 기반 실시간 소장/대출 가능 여부 UX
- 위치 기반 도서관 추천

## 🚀 시작하기

### 1️⃣ 전제 조건

- Node.js 18+
- 도서관 정보나루 API 키

### 2️⃣ API 키 발급 방법

1. [도서관 정보나루](https://www.data4library.kr/) 회원가입
2. 로그인 후 우상단 **[마이페이지]** 클릭
3. 마이페이지 메뉴에서 **인증키** 선택
4. 적절한 **이용목적** 체크 및 **개인정보 수집 이용 동의** 체크
5. **수정완료** 버튼 클릭
6. 상태가 **승인대기중**으로 표시 - 승인까지 시간 소요
7. 승인 후 발급된 API 키를 복사하여 환경변수에 저장

💡 **참고**: 승인 처리에 시간이 걸릴 수 있습니다. 보통 신청 후 익일 오전에 승인됩니다.

### 📊 API 호출 제한

- **기본**: 하루 500회 제한
- **IP 등록 후**: 하루 30,000회 제한

**IP 등록 방법**: 마이페이지 → 인증키 관리에서 **서버IP 필드**에 MCP 서버가 실행될 컴퓨터의 IP 주소를 입력하면 호출 제한이 500회에서 30,000회로 확대됩니다.

⚠️ **중요**: 2023년 11월 20일부터 무제한 호출이 중단되었으며 최대 제한은 하루 30,000회입니다.

### 3️⃣ 환경 변수 설정

- **LIBRARY_API_KEY** (필수): 도서관 정보나루에서 발급받은 API 키

Windows PowerShell (현재 세션용):

```powershell
$env:LIBRARY_API_KEY="your-api-key"
```

macOS/Linux:

```bash
export LIBRARY_API_KEY="your-api-key"
```

## 📦 설치 방법

### 방법 1: NPX 설치 (권장)

가장 쉬운 방법은 NPX를 통한 설치입니다. 자세한 패키지 정보는 [NPM 패키지 페이지](https://www.npmjs.com/package/@isnow890/data4library-mcp)를 참조하세요.

#### Claude Desktop 설정

Claude Desktop 설정 파일 (Windows: `%APPDATA%\Claude\claude_desktop_config.json`, macOS/Linux: `~/Library/Application Support/Claude/claude_desktop_config.json`)에 다음을 추가:

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

#### Cursor AI 설정

`mcp.json`에 추가:

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

### 방법 2: 로컬 설치

로컬 개발이나 커스텀 수정을 위한 설치:

#### Step 1: 소스코드 다운로드 및 빌드

##### Git으로 클론

```bash
git clone https://github.com/isnow890/data4library-mcp.git
cd data4library-mcp
npm install
npm run build
```

##### ZIP 파일 다운로드

1. [GitHub Releases 페이지](https://github.com/isnow890/data4library-mcp/releases)에서 최신 버전 다운로드
2. ZIP 파일을 원하는 위치에 압축 해제
3. 터미널에서 압축 해제된 폴더로 이동:

```bash
cd /path/to/data4library-mcp
npm install
npm run build
```

⚠️ **중요**: 설치 후 반드시 `npm run build`를 실행하여 `dist` 폴더에 컴파일된 JavaScript 파일들을 생성해야 합니다.

#### Step 2: Claude Desktop 설정

빌드 완료 후 필요한 것들:

- **LIBRARY_API_KEY**: 도서관 정보나루에서 발급받은 API 키
- **설치 경로**: 다운로드한 폴더의 절대 경로

##### Windows 설정

Claude Desktop 설정 파일 (`%APPDATA%\Claude\claude_desktop_config.json`)에 다음을 추가:

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
        "LIBRARY_API_KEY": "your-api-key"
      }
    }
  }
}
```

##### macOS/Linux 설정

Claude Desktop 설정 파일 (`~/Library/Application Support/Claude/claude_desktop_config.json`)에 다음을 추가:

```json
{
  "mcpServers": {
    "data4library-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/data4library-mcp/dist/src/index.js"],
      "cwd": "/path/to/data4library-mcp",
      "env": {
        "LIBRARY_API_KEY": "your-api-key"
      }
    }
  }
}
```

##### 경로 설정 주의사항

⚠️ **중요**: 위 설정에서 다음 경로들을 실제 설치 경로로 바꿔주세요:

- **Windows**: `C:\\path\\to\\data4library-mcp`를 실제 다운로드한 폴더 경로로 변경
- **macOS/Linux**: `/path/to/data4library-mcp`를 실제 다운로드한 폴더 경로로 변경
- **빌드 경로**: 경로가 `dist/src/index.js`를 가리키도록 확인 (단순히 `index.js`가 아님)

경로 찾기:

```bash
# 현재 위치 확인
pwd

# 절대 경로 예시
# Windows: C:\Users\YourName\Downloads\data4library-mcp
# macOS: /Users/YourName/Downloads/data4library-mcp
# Linux: /home/YourName/Downloads\data4library-mcp
```

#### Step 3: Claude Desktop 재시작

설정 완료 후 Claude Desktop을 완전히 종료하고 재시작하여 Data4Library MCP 서버를 활성화하세요.

## 🔧 로컬 실행 (개발/테스트용)

Claude Desktop 통합 없이 직접 실행하기:

```bash
npm start
# 또는
node dist/src/index.js
```

Docker (선택사항):

```bash
docker build -t data4library-mcp .
docker run -i --rm -e LIBRARY_API_KEY=$LIBRARY_API_KEY data4library-mcp
```

MCP 클라이언트 통합 (.mcp.json 예시, 로컬 실행):

```json
{
  "mcpServers": {
    "data4library-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["dist/src/index.js"],
      "env": {
        "LIBRARY_API_KEY": "your-api-key"
      }
    }
  }
}
```

## 💡 사용 팁

- **퍼지 검색**: `search_library_codes`를 사용하여 부분 이름/주소로 도서관 찾기
- **코드 헬퍼**: `get_subject_codes`, `search_detailed_kdc_codes`, `search_detailed_region_codes`로 필요한 파라미터 코드 조회
- **세션 모니터링**: `session_stats`로 세션별 도구 사용량/제한 확인
- **도구 연계**: 복잡한 쿼리는 여러 도구를 순차적으로 사용하여 해결

## 📝 라이선스 및 고지사항

- **라이선스**: MIT (LICENSE 파일 참조)
- **데이터 출처**: 도서관 정보나루 공공 API
- **사용법**: 공공 API 정책/할당량을 준수하세요. 개인정보를 저장/노출하지 마세요.

---

💬 **질문이나 피드백이 있으시면** GitHub 이슈를 열어주세요!
