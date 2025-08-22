// 도서관 정보 타입
export interface Library {
  libCode?: string;
  libName?: string;
  region?: string;
  address?: string;
  tel?: string;
  fax?: string;
  homepage?: string;
  closed?: string;
  operatingTime?: string;
  latitude?: string;
  longitude?: string;
  bookCount?: string;
}

// 기본 검색 응답 타입
export interface SearchResponse {
  lastBuildDate?: string;
  total?: number;
  start?: number;
  display?: number;
  items?: any[];
}

// 도서관 목록 조회 응답 타입
export interface LibrarySearchResponse extends SearchResponse {
  libs?: Library[];
}

// 도서 검색 응답 타입
export interface BookSearchResponse extends SearchResponse {
  docs?: Book[];
}

// 도서 정보 타입
export interface Book {
  bookname?: string;
  authors?: string;
  publisher?: string;
  publication_year?: string;
  isbn13?: string;
  set_isbn13?: string;
  bookImageURL?: string;
  addition_symbol?: string;
  vol?: string;
  class_no?: string;
  class_nm?: string;
  description?: string;
  reg_date?: string;
  bookDtlUrl?: string;
  loan_count?: number;
  ranking?: number;
  no?: number;
  callNumbers?: string[];
  callNumber?: string;
  separate_shelf_code?: string;
  separate_shelf_name?: string;
  book_code?: string;
  shelf_loc_code?: string;
  shelf_loc_name?: string;
  copy_code?: string;
}

// 도서 상세 정보 응답 타입
export interface BookDetailResponse {
  detail?: {
    book?: Book;
  };
  loanInfo?: {
    Total?: {
      ranking?: number;
      name?: string;
      loanCnt?: number;
    };
    regionResult?: Array<{
      region?: string;
      ranking?: number;
      name?: string;
      loanCnt?: number;
    }>;
    ageResult?: Array<{
      age?: string;
      ranking?: number;
      name?: string;
      loanCnt?: number;
    }>;
    genderResult?: Array<{
      gender?: string;
      ranking?: number;
      name?: string;
      loanCnt?: number;
    }>;
  };
}

// 인기대출도서 응답 타입
export interface PopularBookResponse extends SearchResponse {
  docs?: Book[];
}

// 도서관별 대출반납추이 응답 타입
export interface UsageTrendResponse {
  libNm?: string;
  results?: Array<{
    dayOfWeek?: string;
    hour?: string;
    loan?: number;
    return?: number;
  }>;
}

// 도서 소장여부 및 대출 가능여부 응답 타입
export interface BookAvailabilityResponse {
  result?: {
    hasBook?: boolean;
    loanAvailable?: boolean;
  };
}

// 대출 급상승 도서 응답 타입
export interface HotTrendResponse {
  results?: Array<{
    date?: string;
    docs?: Book[];
  }>;
}

// 신착도서 응답 타입
export interface NewArrivalBookResponse extends SearchResponse {
  libNm?: string;
  docs?: Book[];
}

// 지역별 독서량/독서율 응답 타입
export interface ReadingQuantityResponse {
  results?: Array<{
    age?: string;
    quantity?: number;
    rate?: number;
  }>;
}

// 이달의 키워드 응답 타입
export interface MonthlyKeywordsResponse {
  keywords?: Array<{
    word?: string;
    weight?: number;
  }>;
}