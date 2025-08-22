#!/usr/bin/env node

import * as dotenv from "dotenv";
import { FastMCP } from "fastmcp";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { LibraryApiClient } from "./clients/library-api.client.js";
import * as schemas from "./schemas/book.schema.js";
import { createBookToolHandlers } from "./handlers/book.handler.js";
import { createValidatedTools, type McpTool } from "./schemas/tool.schema.js";

// 환경 변수 로드
dotenv.config();

// package.json 로드 (bundled environment 호환)
let package_json;
try {
  // 번들된 환경에서는 현재 작업 디렉토리 기준으로 찾기
  package_json = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8"));
} catch {
  // fallback: 기본 정보 제공
  package_json = {
    name: "data4library-mcp",
    version: "1.0.0"
  };
}

// 환경 변수 설정
const API_KEY = process.env.LIBRARY_API_KEY;
const API_BASE_URL = "http://data4library.kr";


// 디버그 통계
const debugStats = {
  toolCalls: {} as Record<string, number>,
  sessionCalls: 0,
  startTime: Date.now(),
};

// API 클라이언트 초기화 (API 키가 없어도 일부 기능 제한적으로 작동)
const client = new LibraryApiClient({
  apiKey: API_KEY || "",
  baseUrl: API_BASE_URL,
});

// API 키가 없는 경우 경고 메시지
if (!API_KEY) {
  console.error("Warning: LIBRARY_API_KEY not provided. Running with limited functionality.");
}

// FastMCP 서버 인스턴스 생성
const server = new FastMCP({
  name: "Book Information MCP",
  version: package_json.version,
});

function toolFn(name: string, fn: (data: any, ctx?: any) => Promise<any>) {
  return async (data: any, ctx?: any) => {
    debugStats.toolCalls[name] = debugStats.toolCalls[name] || 0;
    debugStats.toolCalls[name]++;
    debugStats.sessionCalls++;

    const ts = Date.now();
    console.error(`[${name}] executing %s`, JSON.stringify(data));

    try {
      const result = await fn(data, ctx);
      const duration = Date.now() - ts;
      console.error(`[${name}] completed in %dms`, duration);

      // FastMCP 형식으로 응답 변환 (search_library_codes는 이미 올바른 형식)
      if (name === "search_library_codes") {
        return result;
      }

      // 다른 모든 도구는 content 배열로 래핑
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const duration = Date.now() - ts;
      console.error(
        `[${name}] failed after %dms: %s`,
        duration,
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  };
}

const bookToolHandlers = createBookToolHandlers(client);

// Tools 정의 배열 (Zod 검증 적용)
const toolsDefinition: McpTool[] = [
  {
    name: "search_libraries",
    description: "전국의 공공도서관 정보를 검색합니다. 시나리오: 사용자가 '서울에 있는 도서관 알려줘' 또는 '강남구 도서관 찾아줘'라고 할 때 사용하세요. region(지역코드)나 dtl_region(세부지역코드) 필터가 필요하면 get_region_codes나 search_detailed_region_codes를 먼저 사용하세요.",
    schema: schemas.searchLibrariesSchema,
    handler: bookToolHandlers.searchLibraries,
  },
  {
    name: "search_books",
    description: "도서관 소장 도서를 검색합니다. 시나리오: 사용자가 '해리포터 책 어디서 빌릴 수 있어?' 또는 '김영하 작가 소설 찾아줘'라고 할 때 사용하세요. kdc(주제분류)나 dtl_kdc(세부주제) 필터가 필요하면 get_subject_codes나 search_detailed_kdc_codes를 먼저 사용하세요.",
    schema: schemas.searchBooksSchema,
    handler: bookToolHandlers.searchBooks,
  },
  {
    name: "search_popular_books",
    description: "인기대출도서를 조회합니다. 시나리오: 사용자가 '요즘 인기 있는 책 뭐야?' 또는 '베스트셀러 추천해줘'라고 할 때 사용하세요. region(지역코드)이나 kdc(주제분류) 필터가 필요하면 관련 코드 조회 도구를 먼저 사용하세요.",
    schema: schemas.searchPopularBooksSchema,
    handler: bookToolHandlers.searchPopularBooks,
  },
  {
    name: "get_book_detail",
    description: "ISBN으로 도서의 상세 정보를 조회합니다. 시나리오: 사용자가 특정 책의 ISBN을 알고 있거나, 다른 도구에서 ISBN을 얻은 후 '이 책에 대해 자세히 알려줘'라고 할 때 사용하세요.",
    schema: schemas.getBookDetailSchema,
    handler: bookToolHandlers.getBookDetail,
  },
  {
    name: "check_book_availability",
    description:
      "특정 도서관에서 도서의 소장여부 및 대출 가능여부를 조회합니다. 시나리오: 사용자가 '강남도서관에 해리포터 책 있어?' 또는 '이 책 지금 빌릴 수 있어?'라고 할 때 사용하세요.",
    schema: schemas.checkBookAvailabilitySchema,
    handler: bookToolHandlers.checkBookAvailability,
  },
  {
    name: "get_hot_trend",
    description: "대출 급상승 도서를 조회합니다. 시나리오: 사용자가 '요즘 뜨는 책이 뭘가?', '갑자기 인기 많아진 책 알려줘' 또는 '트렌드 책 추천'이라고 할 때 사용하세요.",
    schema: schemas.getHotTrendSchema,
    handler: bookToolHandlers.getHotTrend,
  },
  {
    name: "search_libraries_by_book",
    description: "특정 도서를 소장하는 도서관을 조회합니다. 시나리오: 사용자가 '해리포터 책 있는 도서관 모두 알려줘', '이 책 어디서 빌릴 수 있어?' 또는 '북간도 없는 책인데 소장 도서관 찾아줘'라고 할 때 사용하세요.",
    schema: schemas.searchLibrariesByBookSchema,
    handler: bookToolHandlers.searchLibrariesByBook,
  },
  {
    name: "get_usage_trend",
    description: "도서관의 대출반납추이를 조회합니다. 시나리오: 사용자가 '도서관 이용그래프 보여줘', '이 도서관 요즘 얼마나 바빠?' 또는 '대출 통계 데이터 알려줘'라고 할 때 사용하세요.",
    schema: schemas.getUsageTrendSchema,
    handler: bookToolHandlers.getUsageTrend,
  },
  {
    name: "get_new_arrival_books",
    description: "도서관의 신착도서를 조회합니다. 시나리오: 사용자가 '새로 들어온 책 뭐있어?', '신간 도서 추천해줘' 또는 '도서관에 방금 들어온 책들 보여줘'라고 할 때 사용하세요.",
    schema: schemas.getNewArrivalBooksSchema,
    handler: bookToolHandlers.getNewArrivalBooks,
  },
  {
    name: "get_reading_quantity",
    description: "지역별 독서량 및 독서율을 조회합니다. 시나리오: 사용자가 '서울 사람들이 책을 얼마나 많이 읽어?', '우리 동네 독서율 어떤?' 또는 '지역별 독서 비교 데이터 보여줘'라고 할 때 사용하세요.",
    schema: schemas.getReadingQuantitySchema,
    handler: bookToolHandlers.getReadingQuantity,
  },
  {
    name: "get_monthly_keywords",
    description: "이달의 키워드를 조회합니다. 시나리오: 사용자가 '요즘 독서 트렌드가 뭘가?', '이번 달 키워드 알려줘' 또는 '사람들이 어떤 주제에 관심 많아?'라고 할 때 사용하세요.",
    schema: schemas.getMonthlyKeywordsSchema,
    handler: bookToolHandlers.getMonthlyKeywords,
  },
  {
    name: "search_library_codes",
    description: "도서관명이나 지역명으로 도서관 코드를 검색합니다. 시나리오: 다른 도구들을 사용하기 전에 libCode 매개변수가 필요한 경우 사용하세요. '강남도서관 코드 알려줘', '서대문도서관 ID 가 뭘야?'라고 할 때 이를 먼저 호출하여 libCode를 확보한 후 다른 API를 호출하세요.",
    schema: schemas.searchLibraryCodesSchema,
    handler: bookToolHandlers.searchLibraryCodes,
  },
  {
    name: "get_detailed_region_codes",
    description: "특정 지역의 세부지역코드를 조회합니다. 시나리오: 다른 API에서 dtl_region 매개변수가 필요할 때 사용하세요. '서울 강남구 도서관 찾고 싶어', '인천 연수구 지역 코드 알려줘'라고 할 때 먼저 호출하여 세부 지역코드를 확보하세요.",
    schema: schemas.getDetailedRegionCodesSchema,
    handler: bookToolHandlers.getDetailedRegionCodes,
  },
  {
    name: "get_region_codes",
    description: "지역 코드 목록을 조회합니다. 시나리오: 다른 API에서 region 매개변수가 필요할 때 기준이 되는 지역코드를 확인하세요. '전국 지역코드 목록 보여줘', '지역별로 어떻게 나눘어져 있어?'라고 할 때 사용하세요.",
    schema: z.object({}),
    handler: bookToolHandlers.getRegionCodes,
  },
  {
    name: "get_detailed_subject_codes",
    description: "특정 대주제의 세부주제코드를 조회합니다. 시나리오: 다른 API에서 dtl_kdc 매개변수가 필요할 때 사용하세요. '경제서적 세부 분류 알려줘', '과학 영역에 어떤 세분류가 있어?'라고 할 때 먼저 호출하여 KDC 세부코드를 확보하세요.",
    schema: schemas.getDetailedSubjectCodesSchema,
    handler: bookToolHandlers.getDetailedSubjectCodes,
  },
  {
    name: "get_subject_codes",
    description: "KDC 대주제분류 코드 목록을 조회합니다. 시나리오: 다른 API에서 kdc 매개변수가 필요할 때 기준이 되는 주제분류를 확인하세요. '도서 분류 체계 보여줘', '어떤 주제로 분류되는지 알려줘'라고 할 때 사용하세요.",
    schema: z.object({
      majorCode: z.string().optional().describe("대분류 코드 (0-9)"),
    }),
    handler: bookToolHandlers.getSubjectCodes,
  },
  {
    name: "search_detailed_kdc_codes",
    description: "상세 KDC 세부주제코드를 검색합니다 (dtl_kdc 파라미터용). 시나리오: dtl_kdc 파라미터가 필요한 API 호출 전에 '경제서 세분류', '컴퓨터 과학 세부 코드'와 같이 특정 주제의 상세 분류코드를 찾을 때 사용하세요.",
    schema: schemas.searchDetailedKDCCodesSchema,
    handler: bookToolHandlers.searchDetailedKDCCodes,
  },
  {
    name: "search_detailed_region_codes",
    description: "상세 지역코드를 검색합니다 (dtl_region 파라미터용). 시나리오: dtl_region 파라미터가 필요한 API 호출 전에 '서울 강남구', '부산 해운대구'와 같이 세부 지역의 코드를 찾을 때 사용하세요.",
    schema: schemas.searchDetailedRegionCodesSchema,
    handler: bookToolHandlers.searchDetailedRegionCodes,
  },
  {
    name: "search_items",
    description: "도서관별 장서/대출 데이터를 조회합니다. 시나리오: 사용자가 '도서관 장서 통계', '대출 데이터 분석' 또는 '이 도서관에 책이 얼마나 많아?'라고 할 때 사용하세요. libCode는 search_library_codes로 먼저 찾으세요.",
    schema: schemas.searchItemsSchema,
    handler: bookToolHandlers.searchItems,
  },
  {
    name: "get_mania_recommendations",
    description: "마니아를 위한 추천도서를 조회합니다. 시나리오: 사용자가 '전문가용 추천도서', '마니아 취향 책' 또는 '높은 수준의 책 추천'이라고 할 때 사용하세요. 특정 책의 ISBN이 필요합니다.",
    schema: schemas.getManiaRecommendationsSchema,
    handler: bookToolHandlers.getManiaRecommendations,
  },
  {
    name: "get_reader_recommendations",
    description: "다독자를 위한 추천도서를 조회합니다. 시나리오: 사용자가 '연속 독서용 책', '다독자 추천' 또는 '많이 읽는 사람들에게 좋은 책'이라고 할 때 사용하세요. 특정 책의 ISBN이 필요합니다.",
    schema: schemas.getReaderRecommendationsSchema,
    handler: bookToolHandlers.getReaderRecommendations,
  },
  {
    name: "get_book_keywords",
    description: "도서의 핵심 키워드 목록을 조회합니다. 시나리오: 사용자가 '이 책의 키워드가 뭘가?', '책 주제어 알려줘' 또는 '비슷한 책 찾기 위해 키워드 필요해'라고 할 때 사용하세요. 특정 책의 ISBN이 필요합니다.",
    schema: schemas.getBookKeywordsSchema,
    handler: bookToolHandlers.getBookKeywords,
  },
  {
    name: "get_book_usage_analysis",
    description: "도서별 이용 분석 정보를 조회합니다. 시나리오: 사용자가 '이 책이 얼마나 인기 있어?', '대출 통계 보여줘' 또는 '책 이용 현황 분석'이라고 할 때 사용하세요. 특정 책의 ISBN이 필요합니다.",
    schema: schemas.getBookUsageAnalysisSchema,
    handler: bookToolHandlers.getBookUsageAnalysis,
  },
  {
    name: "search_popular_books_by_library",
    description: "도서관/지역별 인기대출 도서를 조회합니다. 시나리오: 사용자가 '강남도서관에서 인기 있는 책', '서울지역 베스트셀러' 또는 '지역별 인기도서 비교'라고 할 때 사용하세요. libCode나 region 파라미터는 관련 코드 조회 도구로 먼저 찾으세요.",
    schema: schemas.searchPopularBooksByLibrarySchema,
    handler: bookToolHandlers.searchPopularBooksByLibrary,
  },
  {
    name: "get_library_info",
    description: "도서관별 통합정보를 조회합니다.",
    schema: schemas.getLibraryInfoSchema,
    handler: bookToolHandlers.getLibraryInfo,
  },
  {
    name: "get_popular_books_by_library",
    description: "도서관별 인기대출도서 통합 정보를 조회합니다.",
    schema: schemas.getPopularBooksByLibrarySchema,
    handler: bookToolHandlers.getPopularBooksByLibrary,
  },
  {
    name: "search_nearby_libraries",
    description: "사용자의 위치를 기반으로 가까운 도서관들을 거리순으로 검색합니다. 시나리오: 사용자가 '내 주변 도서관 어디 있어?', '집 근처 도서관 알려줘', '여기서 가까운 도서관 찾아줘', '근처 도서관들의 대출 현황 보고 싶어' 또는 '주변 도서관에서 인기 있는 책들 알아보자'라고 할 때 첫 번째 단계로 사용하세요. 이후 각 도서관의 libCode로 다른 도구들과 연계 활용 가능합니다.",
    schema: schemas.searchNearbyLibrariesSchema,
    handler: bookToolHandlers.searchNearbyLibraries,
  },
];

// Zod 스키마로 검증된 tools 배열
const tools = createValidatedTools(toolsDefinition);

tools.forEach((tool) => {
  server.addTool({
    name: tool.name,
    description: tool.description,
    parameters: tool.schema,
    execute: toolFn(tool.name, tool.handler),
  });
});

// Session stats 도구
server.addTool({
  name: "session_stats",
  description: "현재 세션의 도구 사용량과 통계를 확인합니다.",
  parameters: z.object({}),
  execute: toolFn("session_stats", async () => {
    const usedTools = Object.entries(debugStats.toolCalls);
    const lines = ["도구 호출 통계 (현재 세션):"];

    const sessionDuration = Math.round(
      (Date.now() - debugStats.startTime) / 1000
    );
    lines.push(`세션 시간: ${sessionDuration}초`);
    lines.push(`총 호출 수: ${debugStats.sessionCalls}회`);


    lines.push("");
    lines.push("도구별 호출 횟수:");

    if (usedTools.length === 0) {
      lines.push("- 아직 호출된 도구가 없습니다.");
    } else {
      for (const [name, calls] of usedTools) {
        lines.push(`- ${name}: ${calls}회`);
      }
    }

    return lines.join("\n");
  }),
});

// 서버 시작
server.start({ transportType: "stdio" }).catch((error: any) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
