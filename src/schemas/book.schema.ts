import { z } from "zod";

// 도서관 목록 조회 스키마
export const searchLibrariesSchema = z.object({
  libCode: z
    .string()
    .optional()
    .describe("도서관코드 - search_library_codes 도구로 검색하세요"),
  region: z
    .string()
    .optional()
    .describe(
      "지역코드 (11=서울, 21=부산, 22=대구, 23=인천, 24=광주, 25=대전, 26=울산, 29=세종, 31=경기, 32=강원, 33=충북, 34=충남, 35=전북, 36=전남, 37=경북, 38=경남, 39=제주)"
    ),
  dtl_region: z
    .string()
    .optional()
    .describe("세부지역코드 - search_detailed_region_codes 도구로 검색하세요"),
  pageNo: z.number().optional().describe("페이지번호"),
  pageSize: z.number().optional().describe("페이지크기"),
});

// 도서 검색 스키마
export const searchBooksSchema = z.object({
  title: z.string().optional().describe("도서명"),
  author: z.string().optional().describe("저자명"),
  isbn13: z.string().optional().describe("13자리 ISBN"),
  keyword: z.string().optional().describe("키워드"),
  publisher: z.string().optional().describe("출판사"),
  sort: z
    .enum(["title", "author", "pub", "pubYear", "isbn", "loan"])
    .optional()
    .describe(
      "정렬필드 (title=도서명, author=저자명, pub=출판사, pubYear=출판년도, isbn=ISBN, loan=대출횟수)"
    ),
  order: z
    .enum(["asc", "desc"])
    .optional()
    .describe("정렬순서 (asc=오름차순, desc=내림차순)"),
  exactMatch: z
    .boolean()
    .optional()
    .describe("일치검색여부 (true=완전일치, false=부분일치)"),
  pageNo: z.number().optional().describe("페이지번호"),
  pageSize: z.number().optional().describe("페이지크기"),
});

// 인기대출도서 조회 스키마
export const searchPopularBooksSchema = z.object({
  startDt: z
    .string()
    .optional()
    .describe("검색시작일자 (대출기간) - YYYY-MM-DD 형식"),
  endDt: z
    .string()
    .optional()
    .describe("검색종료일자 (대출기간) - YYYY-MM-DD 형식"),
  gender: z.string().optional().describe("성별코드 (0=남성, 1=여성, 2=미상)"),
  from_age: z.number().optional().describe("시작연령"),
  to_age: z.number().optional().describe("종료연령"),
  age: z
    .string()
    .optional()
    .describe(
      "연령코드 (0=영유아, 6=유아, 8=초등, 14=청소년, 20=20대, 30=30대, 40=40대, 50=50대, 60=60세이상)"
    ),
  region: z
    .string()
    .optional()
    .describe(
      "지역코드 (11=서울, 21=부산, 22=대구, 23=인천, 24=광주, 25=대전, 26=울산, 29=세종, 31=경기, 32=강원, 33=충북, 34=충남, 35=전북, 36=전남, 37=경북, 38=경남, 39=제주)"
    ),
  dtl_region: z
    .string()
    .optional()
    .describe("세부지역코드 - search_detailed_region_codes 도구로 검색하세요"),
  book_dvsn: z
    .enum(["big", "oversea"])
    .optional()
    .describe("도서구분 (big=큰글씨도서, oversea=국외도서)"),
  addCode: z
    .string()
    .optional()
    .describe(
      "ISBN부가기호 (0=교양, 1=실용, 2=여성, 4=청소년, 5=학습참고서(중고), 6=학습참고서(초등), 7=아동, 9=전문)"
    ),
  kdc: z
    .string()
    .optional()
    .describe(
      "대주제분류 (0=총류, 1=철학, 2=종교, 3=사회과학, 4=자연과학, 5=기술과학, 6=예술, 7=언어, 8=문학, 9=역사)"
    ),
  dtl_kdc: z
    .string()
    .optional()
    .describe("세부주제코드 - search_detailed_kdc_codes 도구로 검색하세요"),
  pageNo: z.number().optional().describe("페이지번호"),
  pageSize: z.number().optional().describe("페이지크기"),
});

// 도서 상세 조회 스키마
export const getBookDetailSchema = z.object({
  isbn13: z.string().describe("13자리 ISBN"),
  loaninfoYN: z
    .enum(["Y", "N"])
    .optional()
    .describe("대출상세정보 제공여부 (Y=제공, N=미제공)"),
  displayInfo: z
    .enum(["gender", "age", "region"])
    .optional()
    .describe("대출정보 조회대상 (gender=성별, age=연령별, region=지역별)"),
});

// 도서관별 도서 소장여부 및 대출 가능여부 조회 스키마
export const checkBookAvailabilitySchema = z.object({
  libCode: z
    .string()
    .describe("도서관코드 - search_library_codes 도구로 검색하세요"),
  isbn13: z.string().describe("13자리 ISBN"),
});

// 대출 급상승 도서 스키마
export const getHotTrendSchema = z.object({
  searchDt: z.string().describe("검색일자 (YYYY-MM-DD 형식)"),
});

// 도서 소장 도서관 조회 스키마
export const searchLibrariesByBookSchema = z.object({
  isbn: z.string().describe("13자리 ISBN"),
  region: z
    .string()
    .describe(
      "지역코드 (11=서울, 21=부산, 22=대구, 23=인천, 24=광주, 25=대전, 26=울산, 29=세종, 31=경기, 32=강원, 33=충북, 34=충남, 35=전북, 36=전남, 37=경북, 38=경남, 39=제주)"
    ),
  dtl_region: z
    .string()
    .optional()
    .describe("세부지역코드 - search_detailed_region_codes 도구로 검색하세요"),
  pageNo: z.number().optional().describe("페이지 번호"),
  pageSize: z.number().optional().describe("페이지 크기"),
});

// 도서관별 대출반납추이 스키마
export const getUsageTrendSchema = z.object({
  libCode: z
    .string()
    .describe("도서관코드 - search_library_codes 도구로 검색하세요"),
  type: z.enum(["D", "H"]).describe("조회기준 (D=요일별, H=시간대별)"),
});

// 신착도서 조회 스키마
export const getNewArrivalBooksSchema = z.object({
  libCode: z
    .string()
    .describe("도서관코드 - search_library_codes 도구로 검색하세요"),
  searchDt: z.string().optional().describe("검색일자 (YYYY-MM 형식)"),
});

// 지역별 독서량/독서율 스키마
export const getReadingQuantitySchema = z.object({
  region: z
    .string()
    .optional()
    .describe(
      "지역코드 (11=서울, 21=부산, 22=대구, 23=인천, 24=광주, 25=대전, 26=울산, 29=세종, 31=경기, 32=강원, 33=충북, 34=충남, 35=전북, 36=전남, 37=경북, 38=경남, 39=제주)"
    ),
  dtl_region: z
    .string()
    .optional()
    .describe("세부지역코드 - search_detailed_region_codes 도구로 검색하세요"),
  year: z.string().optional().describe("분석연도 (YYYY 형식)"),
  month: z.string().optional().describe("분석월 (MM 형식)"),
});

// 이달의 키워드 스키마
export const getMonthlyKeywordsSchema = z.object({
  month: z.string().optional().describe("검색월 (YYYY-MM 형식)"),
});

// 도서관 코드 검색 스키마
export const searchLibraryCodesSchema = z.object({
  libraryName: z
    .string()
    .optional()
    .describe(
      "도서관명으로 검색 (부분 검색 및 유사검색 지원, 예: '중앙도서관', '강남', '시립') - 오타나 불완전한 이름도 검색 가능"
    ),
  regionName: z
    .string()
    .optional()
    .describe("지역명으로 검색 (예: 서울, 강남구, 부산, 경기도)"),
  limit: z.number().optional().default(20).describe("최대 검색 결과 수"),
});

// 세부지역 코드 조회 스키마
export const getDetailedRegionCodesSchema = z.object({
  region: z
    .string()
    .describe(
      "상위 지역코드 (11=서울, 21=부산, 22=대구, 23=인천, 24=광주, 25=대전, 26=울산, 29=세종, 31=경기, 32=강원, 33=충북, 34=충남, 35=전북, 36=전남, 37=경북, 38=경남, 39=제주)"
    ),
});

// 세부주제 코드 조회 스키마
export const getDetailedSubjectCodesSchema = z.object({
  kdc: z
    .string()
    .describe(
      "대주제분류코드 (0=총류, 1=철학, 2=종교, 3=사회과학, 4=자연과학, 5=기술과학, 6=예술, 7=언어, 8=문학, 9=역사)"
    ),
});

// 세부주제코드 검색 스키마 (dtl_kdc 파라미터용)
export const searchDetailedKDCCodesSchema = z.object({
  keyword: z
    .string()
    .optional()
    .describe("검색할 주제 키워드 (예: '의학', '컴퓨터', '문학', '역사')"),
  majorCode: z.string().optional().describe("대분류 코드 (0-9)로 필터링"),
  limit: z
    .number()
    .min(1)
    .max(100)
    .default(20)
    .describe("결과 개수 제한 (기본값: 20)"),
});

// 세부지역코드 검색 스키마 (dtl_region 파라미터용)
export const searchDetailedRegionCodesSchema = z.object({
  keyword: z
    .string()
    .optional()
    .describe("검색할 지역 키워드 (예: '강남', '부산', '수원', '서대문')"),
  provinceCode: z
    .string()
    .optional()
    .describe("광역시도 코드 (11=서울, 21=부산, 31=경기 등)로 필터링"),
  limit: z
    .number()
    .min(1)
    .max(100)
    .default(20)
    .describe("결과 개수 제한 (기본값: 20)"),
});

// 도서관별 장서/대출 데이터 조회 스키마
export const searchItemsSchema = z.object({
  libCode: z
    .string()
    .describe("도서관코드 - search_library_codes 도구로 검색하세요"),
  type: z.enum(["ALL"]).optional().describe("검색조건 (ALL=전체 데이터)"),
  isbn13: z.string().optional().describe("13자리 ISBN"),
  startDt: z
    .string()
    .optional()
    .describe("검색시작일자 (도서 등록일) - YYYY-MM-DD 형식"),
  endDt: z
    .string()
    .optional()
    .describe("검색종료일자 (도서 등록일) - YYYY-MM-DD 형식"),
  pageNo: z.number().optional().describe("페이지번호"),
  pageSize: z.number().optional().describe("페이지크기"),
});

// 마니아 추천도서 조회 스키마
export const getManiaRecommendationsSchema = z.object({
  isbn13: z.string().describe("10자리 또는 13자리 ISBN"),
});

// 다독자 추천도서 조회 스키마
export const getReaderRecommendationsSchema = z.object({
  isbn13: z.string().describe("10자리 또는 13자리 ISBN"),
});

// 도서 키워드 목록 스키마
export const getBookKeywordsSchema = z.object({
  isbn13: z.string().describe("13자리 ISBN"),
  additionalYN: z
    .enum(["Y", "N"])
    .optional()
    .describe("부가정보 적용여부 (Y=제공, N=미제공)"),
});

// 도서별 이용 분석 스키마
export const getBookUsageAnalysisSchema = z.object({
  isbn13: z.string().describe("13자리 ISBN"),
});

// 도서관/지역별 인기대출 도서 조회 스키마
export const searchPopularBooksByLibrarySchema = z.object({
  libCode: z
    .string()
    .optional()
    .describe("도서관코드 - search_library_codes 도구로 검색하세요"),
  region: z
    .string()
    .optional()
    .describe(
      "지역코드 (11=서울, 21=부산, 22=대구, 23=인천, 24=광주, 25=대전, 26=울산, 29=세종, 31=경기, 32=강원, 33=충북, 34=충남, 35=전북, 36=전남, 37=경북, 38=경남, 39=제주)"
    ),
  dtl_region: z
    .string()
    .optional()
    .describe("세부지역코드 - search_detailed_region_codes 도구로 검색하세요"),
  startDt: z
    .string()
    .optional()
    .describe("검색시작일자 (대출기간) - YYYY-MM-DD 형식"),
  endDt: z
    .string()
    .optional()
    .describe("검색종료일자 (대출기간) - YYYY-MM-DD 형식"),
  gender: z.string().optional().describe("성별코드 (0=남성, 1=여성, 2=미상)"),
  from_age: z.number().optional().describe("시작연령"),
  to_age: z.number().optional().describe("종료연령"),
  age: z
    .string()
    .optional()
    .describe(
      "연령코드 (0=영유아, 6=유아, 8=초등, 14=청소년, 20=20대, 30=30대, 40=40대, 50=50대, 60=60세이상)"
    ),
  addCode: z
    .string()
    .optional()
    .describe(
      "ISBN부가기호 (0=교양, 1=실용, 2=여성, 4=청소년, 5=학습참고서(중고), 6=학습참고서(초등), 7=아동, 9=전문)"
    ),
  kdc: z
    .string()
    .optional()
    .describe(
      "대주제분류 (0=총류, 1=철학, 2=종교, 3=사회과학, 4=자연과학, 5=기술과학, 6=예술, 7=언어, 8=문학, 9=역사)"
    ),
  dtl_kdc: z
    .string()
    .optional()
    .describe("세부주제코드 - search_detailed_kdc_codes 도구로 검색하세요"),
  book_dvsn: z
    .enum(["big", "oversea"])
    .optional()
    .describe("도서구분 (big=큰글씨도서, oversea=국외도서)"),
  pageNo: z.number().optional().describe("페이지번호"),
  pageSize: z.number().optional().describe("페이지크기"),
});

// 도서관별 통합정보 스키마
export const getLibraryInfoSchema = z.object({
  libCode: z
    .string()
    .optional()
    .describe("도서관코드 - search_library_codes 도구로 검색하세요"),
  region: z
    .string()
    .optional()
    .describe(
      "지역코드 (11=서울, 21=부산, 22=대구, 23=인천, 24=광주, 25=대전, 26=울산, 29=세종, 31=경기, 32=강원, 33=충북, 34=충남, 35=전북, 36=전남, 37=경북, 38=경남, 39=제주)"
    ),
  dtl_region: z
    .string()
    .optional()
    .describe("세부지역코드 - search_detailed_region_codes 도구로 검색하세요"),
  pageNo: z.number().optional().describe("페이지번호"),
  pageSize: z.number().optional().describe("페이지크기"),
});

// 도서관별 인기대출도서 통합 스키마
export const getPopularBooksByLibrarySchema = z.object({
  libCode: z
    .string()
    .describe("도서관코드 - search_library_codes 도구로 검색하세요"),
});
