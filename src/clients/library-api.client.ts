import axios, { type AxiosInstance } from "axios";
import {
  DETAILED_KDC_CODES,
  DETAILED_REGION_CODES,
  KDC_SUBJECT_CODES,
  REGION_CODES,
  type RegionCode,
  type SubjectCode,
} from "../constants/codes.js";
import { loadLibraryData, type LibraryDataRecord } from "../utils/library-data.js";

export const DEFAULT_API_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024;

export interface LibraryApiConfig {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface SearchParams {
  [key: string]: unknown;
}

export interface ApiRequestOptions {
  signal?: AbortSignal;
}

export class Data4LibraryRequestError extends Error {
  readonly endpoint: string;
  readonly code?: string;
  readonly status?: number;

  constructor(message: string, endpoint: string, code?: string, status?: number) {
    super(message);
    this.name = "Data4LibraryRequestError";
    this.endpoint = endpoint;
    this.code = code;
    this.status = status;
  }
}

function normalizeBaseUrl(value: string): string {
  const url = new URL(value);
  const isLoopback =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "[::1]";

  if (url.protocol !== "https:" && !(url.protocol === "http:" && isLoopback)) {
    throw new Error("도서관정보나루 API는 HTTPS로만 연결할 수 있습니다.");
  }

  return url.toString().replace(/\/$/, "");
}

/**
 * 도서관 정보 API 클라이언트
 */
export class LibraryApiClient {
  private readonly apiKey: string;
  private readonly http: AxiosInstance;
  private readonly libraries: readonly LibraryDataRecord[];

  constructor(config: LibraryApiConfig) {
    const timeoutMs = config.timeoutMs ?? DEFAULT_API_TIMEOUT_MS;
    if (!Number.isInteger(timeoutMs) || timeoutMs < 50 || timeoutMs > 60_000) {
      throw new Error("API 타임아웃은 50~60000ms 사이의 정수여야 합니다.");
    }

    this.apiKey = config.apiKey;
    this.libraries = loadLibraryData();
    this.http = axios.create({
      baseURL: normalizeBaseUrl(config.baseUrl ?? "https://data4library.kr"),
      timeout: timeoutMs,
      maxContentLength: MAX_RESPONSE_BYTES,
      maxBodyLength: MAX_RESPONSE_BYTES,
    });
  }

  /**
   * GET 요청
   */
  private async get<T>(
    endpoint: string,
    params: SearchParams = {},
    options: ApiRequestOptions = {},
  ): Promise<T> {
    // API 키가 없는 경우 에러 처리
    if (!this.apiKey) {
      throw new Error("API 키가 설정되지 않았습니다. LIBRARY_API_KEY 환경변수를 설정해주세요.");
    }
    
    try {
      const response = await this.http.get<T>(endpoint, {
        params: {
          ...params,
          authKey: this.apiKey,
          format: "json",
        },
        signal: options.signal,
      });
      return response.data;
    } catch (error) {
      const code = axios.isAxiosError(error) ? error.code : undefined;
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const timedOut = code === "ECONNABORTED" || code === "ETIMEDOUT";
      const cancelled = code === "ERR_CANCELED";
      const reason = timedOut
        ? "시간 초과"
        : cancelled
          ? "요청 취소"
          : status
            ? `HTTP ${status}`
            : "네트워크 오류";

      console.error("[data4library] API request failed", {
        endpoint,
        code: code ?? "UNKNOWN",
        status: status ?? null,
      });
      throw new Data4LibraryRequestError(
        `도서관정보나루 API 요청 실패: ${reason}`,
        endpoint,
        code,
        status,
      );
    }
  }


  /**
   * 도서관 목록 조회
   */
  async searchLibraries(params: SearchParams = {}, options: ApiRequestOptions = {}) {
    return this.get("/api/libSrch", params, options);
  }

  /**
   * 도서관별 장서/대출 데이터 조회
   */
  async searchItems(params: SearchParams, options: ApiRequestOptions = {}) {
    if (!params.libCode) {
      throw new Error("libCode는 필수 파라미터입니다.");
    }
    
    return this.get("/api/itemSrch", params, options);
  }

  /**
   * 인기대출도서 조회
   */
  async searchPopularBooks(params: SearchParams = {}, options: ApiRequestOptions = {}) {
    return this.get("/api/loanItemSrch", params, options);
  }

  /**
   * 마니아를 위한 추천도서 조회
   */
  async getManiaRecommendations(isbn13: string, options: ApiRequestOptions = {}) {
    return this.get("/api/recommandList", { isbn13, type: "mania" }, options);
  }

  /**
   * 다독자를 위한 추천도서 조회
   */
  async getReaderRecommendations(isbn13: string, options: ApiRequestOptions = {}) {
    return this.get("/api/recommandList", { isbn13, type: "reader" }, options);
  }

  /**
   * 도서 상세 조회
   */
  async getBookDetail(params: SearchParams & { isbn13: string }, options: ApiRequestOptions = {}) {
    return this.get("/api/srchDtlList", params, options);
  }

  /**
   * 도서 키워드 목록
   */
  async getBookKeywords(isbn13: string, additionalYN: string = "N", options: ApiRequestOptions = {}) {
    return this.get("/api/keywordList", { isbn13, additionalYN }, options);
  }

  /**
   * 도서별 이용 분석
   */
  async getBookUsageAnalysis(isbn13: string, options: ApiRequestOptions = {}) {
    return this.get("/api/usageAnalysisList", { isbn13 }, options);
  }

  /**
   * 도서관/지역별 인기대출 도서 조회
   */
  async searchPopularBooksByLibrary(params: SearchParams, options: ApiRequestOptions = {}) {
    return this.get("/api/loanItemSrchByLib", params, options);
  }

  /**
   * 도서관별 대출반납추이
   */
  async getUsageTrend(params: SearchParams & { libCode: string; type: string }, options: ApiRequestOptions = {}) {
    return this.get("/api/usageTrend", params, options);
  }

  /**
   * 도서관별 도서 소장 여부 및 전일 기준 대출 가능 여부 조회
   */
  async checkBookAvailability(params: SearchParams & { libCode: string; isbn13: string }, options: ApiRequestOptions = {}) {
    return this.get("/api/bookExist", params, options);
  }

  /**
   * 대출 급상승 도서
   */
  async getHotTrend(params: SearchParams & { searchDt: string }, options: ApiRequestOptions = {}) {
    return this.get("/api/hotTrend", params, options);
  }

  /**
   * 도서 소장 도서관 조회
   */
  async searchLibrariesByBook(params: SearchParams & { isbn: string; region: string }, options: ApiRequestOptions = {}) {
    return this.get("/api/libSrchByBook", params, options);
  }

  /**
   * 도서관별 통합정보
   */
  async getLibraryInfo(params: SearchParams = {}, options: ApiRequestOptions = {}) {
    return this.get("/api/extends/libSrch", params, options);
  }

  /**
   * 도서관별 인기대출도서 통합
   */
  async getPopularBooksByLibrary(libCode: string, options: ApiRequestOptions = {}) {
    return this.get("/api/extends/loanItemSrchByLib", { libCode }, options);
  }

  /**
   * 도서 검색
   */
  async searchBooks(params: SearchParams, options: ApiRequestOptions = {}) {
    return this.get("/api/srchBooks", params, options);
  }

  /**
   * 이달의 키워드
   */
  async getMonthlyKeywords(params: SearchParams = {}, options: ApiRequestOptions = {}) {
    return this.get("/api/monthlyKeywords", params, options);
  }

  /**
   * 지역별 독서량/독서율
   */
  async getReadingQuantity(params: SearchParams = {}, options: ApiRequestOptions = {}) {
    return this.get("/api/readQt", params, options);
  }

  /**
   * 신착도서 조회
   */
  async getNewArrivalBooks(params: SearchParams & { libCode: string }, options: ApiRequestOptions = {}) {
    return this.get("/api/newArrivalBook", params, options);
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
        lib.name?.toLowerCase().includes(searchTerm) ||
        lib.code?.toLowerCase().includes(searchTerm)
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
      libCode: lib.code,
      libName: lib.name,
      address: lib.address,
      region: lib.address.split(' ').slice(0, 2).join(' '), // Extract region from address
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

    const regions = Object.entries(DETAILED_REGION_CODES)
      .filter(([code]) => code.startsWith(params.region))
      .map(([code, info]) => ({
        code,
        province: info.province,
        district: info.district,
        fullName: `${info.province} ${info.district}`,
      }));

    return {
      region: params.region,
      regionName,
      count: regions.length,
      regions,
      usage: "API 호출 시 dtl_region 파라미터에 code 값을 사용하세요.",
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

    const subjects = Object.entries(DETAILED_KDC_CODES)
      .filter(([code]) => code.startsWith(params.kdc))
      .map(([code, name]) => ({ code, name }));

    return {
      kdc: params.kdc,
      subjectInfo,
      count: subjects.length,
      subjects,
      usage: "API 호출 시 dtl_kdc 파라미터에 2자리 code 값을 사용하세요.",
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
