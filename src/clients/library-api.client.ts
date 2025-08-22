import axios, { AxiosRequestConfig } from "axios";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { REGION_CODES, KDC_SUBJECT_CODES, DETAILED_KDC_CODES, DETAILED_REGION_CODES, type RegionCode, type SubjectCode, type DetailedKDCCode, type DetailedRegionCode } from "../constants/codes.js";

// 현재 파일의 디렉토리 경로 얻기 (fallback 포함)
let __filename: string;
let __dirname: string;
let libraries: any[];

try {
  __filename = fileURLToPath(import.meta.url);
  __dirname = dirname(__filename);
  // 도서관 정보를 담은 JSON 파일 로드
  const librariesPath = join(__dirname, "..", "data", "libraries.json");
  libraries = JSON.parse(readFileSync(librariesPath, "utf-8"));
} catch {
  // fallback for bundled environments
  __dirname = process.cwd();
  try {
    libraries = JSON.parse(readFileSync(join(__dirname, "data", "libraries.json"), "utf-8"));
  } catch {
    libraries = []; // 최종 fallback
  }
}

export interface LibraryApiConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface SearchParams {
  [key: string]: any;
}

/**
 * 도서관 정보 API 클라이언트
 */
export class LibraryApiClient {
  private baseUrl: string;
  private apiKey: string;
  private libraries: any[];

  constructor(config: LibraryApiConfig) {
    this.baseUrl = config.baseUrl || "http://data4library.kr";
    this.apiKey = config.apiKey;
    this.libraries = libraries;
  }


  /**
   * API 요청 헤더 생성
   */
  private getHeaders(contentType: string = "application/json"): AxiosRequestConfig {
    return {
      headers: {
        "Content-Type": contentType,
      },
    };
  }

  /**
   * GET 요청
   */
  private async get<T>(url: string, params: SearchParams = {}): Promise<T> {
    // API 키가 없는 경우 에러 처리
    if (!this.apiKey) {
      throw new Error("API 키가 설정되지 않았습니다. LIBRARY_API_KEY 환경변수를 설정해주세요.");
    }
    
    // API 키와 JSON 형식 요청 추가
    params.authKey = this.apiKey;
    params.format = 'json';
    
    try {
      const response = await axios.get<T>(url, { 
        params, 
        ...this.getHeaders() 
      });
      return response.data;
    } catch (error) {
      console.error(`API 요청 실패: ${url}`, error);
      throw error;
    }
  }


  /**
   * 도서관 목록 조회
   */
  async searchLibraries(params: SearchParams = {}) {
    const url = `${this.baseUrl}/api/libSrch`;
    return this.get(url, params);
  }

  /**
   * 도서관별 장서/대출 데이터 조회
   */
  async searchItems(params: SearchParams) {
    if (!params.libCode) {
      throw new Error("libCode는 필수 파라미터입니다.");
    }
    
    const url = `${this.baseUrl}/api/itemSrch`;
    return this.get(url, params);
  }

  /**
   * 인기대출도서 조회
   */
  async searchPopularBooks(params: SearchParams = {}) {
    const url = `${this.baseUrl}/api/loanItemSrch`;
    return this.get(url, params);
  }

  /**
   * 마니아를 위한 추천도서 조회
   */
  async getManiaRecommendations(isbn13: string) {
    const url = `${this.baseUrl}/api/recommandList`;
    return this.get(url, { isbn13, type: "mania" });
  }

  /**
   * 다독자를 위한 추천도서 조회
   */
  async getReaderRecommendations(isbn13: string) {
    const url = `${this.baseUrl}/api/recommandList`;
    return this.get(url, { isbn13, type: "reader" });
  }

  /**
   * 도서 상세 조회
   */
  async getBookDetail(params: SearchParams & { isbn13: string }) {
    const url = `${this.baseUrl}/api/srchDtlList`;
    return this.get(url, params);
  }

  /**
   * 도서 키워드 목록
   */
  async getBookKeywords(isbn13: string, additionalYN: string = "N") {
    const url = `${this.baseUrl}/api/keywordList`;
    return this.get(url, { isbn13, additionalYN });
  }

  /**
   * 도서별 이용 분석
   */
  async getBookUsageAnalysis(isbn13: string) {
    const url = `${this.baseUrl}/api/usageAnalysisList`;
    return this.get(url, { isbn13 });
  }

  /**
   * 도서관/지역별 인기대출 도서 조회
   */
  async searchPopularBooksByLibrary(params: SearchParams) {
    const url = `${this.baseUrl}/api/loanItemSrchByLib`;
    return this.get(url, params);
  }

  /**
   * 도서관별 대출반납추이
   */
  async getUsageTrend(params: SearchParams & { libCode: string; type: string }) {
    const url = `${this.baseUrl}/api/usageTrend`;
    return this.get(url, params);
  }

  /**
   * 도서관별 도서 소장여부 및 대출 가능여부 조회
   */
  async checkBookAvailability(params: SearchParams & { libCode: string; isbn13: string }) {
    const url = `${this.baseUrl}/api/bookExist`;
    return this.get(url, params);
  }

  /**
   * 대출 급상승 도서
   */
  async getHotTrend(params: SearchParams & { searchDt: string }) {
    const url = `${this.baseUrl}/api/hotTrend`;
    return this.get(url, params);
  }

  /**
   * 도서 소장 도서관 조회
   */
  async searchLibrariesByBook(params: SearchParams & { isbn: string; region: string }) {
    const url = `${this.baseUrl}/api/libSrchByBook`;
    return this.get(url, params);
  }

  /**
   * 도서관별 통합정보
   */
  async getLibraryInfo(params: SearchParams = {}) {
    const url = `${this.baseUrl}/api/extends/libSrch`;
    return this.get(url, params);
  }

  /**
   * 도서관별 인기대출도서 통합
   */
  async getPopularBooksByLibrary(libCode: string) {
    const url = `${this.baseUrl}/api/extends/loanItemSrchByLib`;
    return this.get(url, { libCode });
  }

  /**
   * 도서 검색
   */
  async searchBooks(params: SearchParams) {
    const url = `${this.baseUrl}/api/srchBooks`;
    return this.get(url, params);
  }

  /**
   * 이달의 키워드
   */
  async getMonthlyKeywords(params: SearchParams = {}) {
    const url = `${this.baseUrl}/api/monthlyKeywords`;
    return this.get(url, params);
  }

  /**
   * 지역별 독서량/독서율
   */
  async getReadingQuantity(params: SearchParams = {}) {
    const url = `${this.baseUrl}/api/readQt`;
    return this.get(url, params);
  }

  /**
   * 신착도서 조회
   */
  async getNewArrivalBooks(params: SearchParams & { libCode: string }) {
    const url = `${this.baseUrl}/api/newArrivalBook`;
    return this.get(url, params);
  }

  /**
   * 도서관 코드 검색 (로컬 데이터 기반)
   */
  async searchLibraryCodes(params: SearchParams & { 
    libraryName?: string; 
    regionName?: string; 
    limit?: number 
  }) {
    const { libraryName, regionName, limit = 20 } = params;
    
    let filteredLibraries = [...this.libraries];

    // 도서관명으로 검색
    if (libraryName) {
      const searchTerm = libraryName.toLowerCase();
      filteredLibraries = filteredLibraries.filter(lib => 
        lib.libName?.toLowerCase().includes(searchTerm) ||
        lib.libCode?.toLowerCase().includes(searchTerm)
      );
    }

    // 지역명으로 검색
    if (regionName) {
      const searchTerm = regionName.toLowerCase();
      filteredLibraries = filteredLibraries.filter(lib => 
        lib.address?.toLowerCase().includes(searchTerm) ||
        lib.region?.toLowerCase().includes(searchTerm)
      );
    }

    // 결과 제한
    const results = filteredLibraries.slice(0, limit);
    
    const searchResults = results.map(lib => ({
      libCode: lib.libCode,
      libName: lib.libName,
      address: lib.address,
      region: lib.region,
      tel: lib.tel,
      homepage: lib.homepage
    }));

    return {
      content: [
        {
          type: "text",
          text: `검색 결과: ${filteredLibraries.length}개 도서관 중 ${searchResults.length}개 표시\n\n` +
            searchResults.map(lib => 
              `📚 ${lib.libName} (${lib.libCode})\n` +
              `📍 주소: ${lib.address}\n` +
              `📞 전화: ${lib.tel || '전화번호 없음'}\n` +
              `🌐 홈페이지: ${lib.homepage || '홈페이지 없음'}\n`
            ).join('\n')
        }
      ]
    };
  }

  /**
   * 세부지역 코드 조회 (상수 기반)
   */
  async getDetailedRegionCodes(params: SearchParams & { region: string }) {
    const regionName = REGION_CODES[params.region as RegionCode];

    if (!regionName) {
      throw new Error(`Invalid region code: ${params.region}`);
    }

    return {
      region: params.region,
      regionName,
      usage: 'API에서 지원하는 세부 지역 코드는 API 문서를 참조하세요.',
      note: '세부 지역 코드는 도서관정보나루 API 문서에서 확인 가능합니다.'
    };
  }

  /**
   * 세부주제 코드 조회 (상수 기반)
   */
  async getDetailedSubjectCodes(params: SearchParams & { kdc: string }) {
    const subjectInfo = KDC_SUBJECT_CODES[params.kdc as SubjectCode];
    
    if (!subjectInfo) {
      throw new Error(`Invalid KDC code: ${params.kdc}`);
    }

    return {
      kdc: params.kdc,
      subjectInfo,
      usage: 'dtl_kdc 파라미터에 3자리 세부주제코드를 사용하세요.'
    };
  }

  /**
   * 상세 KDC 세부주제코드 검색 (dtl_kdc 파라미터용)
   */
  async searchDetailedKDCCodes(params: SearchParams & { 
    keyword?: string; 
    majorCode?: string; 
    limit?: number 
  }) {
    const { keyword, majorCode, limit = 20 } = params;
    
    let filteredCodes = Object.entries(DETAILED_KDC_CODES);

    // 대분류 코드로 필터링
    if (majorCode) {
      filteredCodes = filteredCodes.filter(([code]) => code.startsWith(majorCode));
    }

    // 키워드로 검색
    if (keyword) {
      const searchTerm = keyword.toLowerCase();
      filteredCodes = filteredCodes.filter(([, name]) => 
        name.toLowerCase().includes(searchTerm)
      );
    }

    // 결과 제한
    const results = filteredCodes.slice(0, limit);
    
    const searchResults = results.map(([code, name]) => ({
      code,
      name,
      majorCategory: KDC_SUBJECT_CODES[code[0] as SubjectCode]?.name || '알수없음'
    }));

    return {
      totalFound: filteredCodes.length,
      resultCount: searchResults.length,
      results: searchResults,
      usage: 'API 호출 시 dtl_kdc 파라미터에 code 값을 사용하세요.'
    };
  }

  /**
   * 상세 지역코드 검색 (dtl_region 파라미터용)
   */
  async searchDetailedRegionCodes(params: SearchParams & { 
    keyword?: string; 
    provinceCode?: string; 
    limit?: number 
  }) {
    const { keyword, provinceCode, limit = 20 } = params;
    
    let filteredCodes = Object.entries(DETAILED_REGION_CODES);

    // 광역시도 코드로 필터링
    if (provinceCode) {
      filteredCodes = filteredCodes.filter(([code]) => code.startsWith(provinceCode));
    }

    // 키워드로 검색
    if (keyword) {
      const searchTerm = keyword.toLowerCase();
      filteredCodes = filteredCodes.filter(([, regionInfo]) => 
        regionInfo.province.toLowerCase().includes(searchTerm) ||
        regionInfo.district.toLowerCase().includes(searchTerm)
      );
    }

    // 결과 제한
    const results = filteredCodes.slice(0, limit);
    
    const searchResults = results.map(([code, regionInfo]) => ({
      code,
      province: regionInfo.province,
      district: regionInfo.district,
      fullName: `${regionInfo.province} ${regionInfo.district}`,
      provinceCode: code.substring(0, 2)
    }));

    return {
      totalFound: filteredCodes.length,
      resultCount: searchResults.length,
      results: searchResults,
      usage: 'API 호출 시 dtl_region 파라미터에 code 값을 사용하세요.'
    };
  }
}