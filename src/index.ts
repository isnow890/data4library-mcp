#!/usr/bin/env node

import * as dotenv from "dotenv";
import { FastMCP } from "fastmcp";
import { z } from "zod";
import { createRequire } from "node:module";

import { LibraryApiClient } from "./clients/library-api.client.js";
import * as schemas from "./schemas/book.schema.js";
import { createBookToolHandlers } from "./handlers/book.handler.js";
import { createValidatedTools, type McpTool } from "./schemas/tool.schema.js";

// 환경 변수 로드
dotenv.config();

const require = createRequire(import.meta.url);
const package_json = require("../../package.json");

// 환경 변수 설정
const API_KEY = process.env.LIBRARY_API_KEY;
const API_BASE_URL = "http://data4library.kr";


// 디버그 통계
const debugStats = {
  toolCalls: {} as Record<string, number>,
  sessionCalls: 0,
  startTime: Date.now(),
};

// 환경 변수 유효성 검사
if (!API_KEY) {
  console.error("Error: LIBRARY_API_KEY environment variable is required");
  process.exit(1);
}

// API 클라이언트 초기화
const client = new LibraryApiClient({
  apiKey: API_KEY,
  baseUrl: API_BASE_URL,
});

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
    description: "전국의 공공도서관 정보를 검색합니다.",
    schema: schemas.searchLibrariesSchema,
    handler: bookToolHandlers.searchLibraries,
  },
  {
    name: "search_books",
    description: "도서관 소장 도서를 검색합니다.",
    schema: schemas.searchBooksSchema,
    handler: bookToolHandlers.searchBooks,
  },
  {
    name: "search_popular_books",
    description: "인기대출도서를 조회합니다.",
    schema: schemas.searchPopularBooksSchema,
    handler: bookToolHandlers.searchPopularBooks,
  },
  {
    name: "get_book_detail",
    description: "ISBN으로 도서의 상세 정보를 조회합니다.",
    schema: schemas.getBookDetailSchema,
    handler: bookToolHandlers.getBookDetail,
  },
  {
    name: "check_book_availability",
    description:
      "특정 도서관에서 도서의 소장여부 및 대출 가능여부를 조회합니다.",
    schema: schemas.checkBookAvailabilitySchema,
    handler: bookToolHandlers.checkBookAvailability,
  },
  {
    name: "get_hot_trend",
    description: "대출 급상승 도서를 조회합니다.",
    schema: schemas.getHotTrendSchema,
    handler: bookToolHandlers.getHotTrend,
  },
  {
    name: "search_libraries_by_book",
    description: "특정 도서를 소장하는 도서관을 조회합니다.",
    schema: schemas.searchLibrariesByBookSchema,
    handler: bookToolHandlers.searchLibrariesByBook,
  },
  {
    name: "get_usage_trend",
    description: "도서관의 대출반납추이를 조회합니다.",
    schema: schemas.getUsageTrendSchema,
    handler: bookToolHandlers.getUsageTrend,
  },
  {
    name: "get_new_arrival_books",
    description: "도서관의 신착도서를 조회합니다.",
    schema: schemas.getNewArrivalBooksSchema,
    handler: bookToolHandlers.getNewArrivalBooks,
  },
  {
    name: "get_reading_quantity",
    description: "지역별 독서량 및 독서율을 조회합니다.",
    schema: schemas.getReadingQuantitySchema,
    handler: bookToolHandlers.getReadingQuantity,
  },
  {
    name: "get_monthly_keywords",
    description: "이달의 키워드를 조회합니다.",
    schema: schemas.getMonthlyKeywordsSchema,
    handler: bookToolHandlers.getMonthlyKeywords,
  },
  {
    name: "search_library_codes",
    description: "도서관명이나 지역명으로 도서관 코드를 검색합니다.",
    schema: schemas.searchLibraryCodesSchema,
    handler: bookToolHandlers.searchLibraryCodes,
  },
  {
    name: "get_detailed_region_codes",
    description: "특정 지역의 세부지역코드를 조회합니다.",
    schema: schemas.getDetailedRegionCodesSchema,
    handler: bookToolHandlers.getDetailedRegionCodes,
  },
  {
    name: "get_region_codes",
    description: "지역 코드 목록을 조회합니다.",
    schema: z.object({}),
    handler: bookToolHandlers.getRegionCodes,
  },
  {
    name: "get_detailed_subject_codes",
    description: "특정 대주제의 세부주제코드를 조회합니다.",
    schema: schemas.getDetailedSubjectCodesSchema,
    handler: bookToolHandlers.getDetailedSubjectCodes,
  },
  {
    name: "get_subject_codes",
    description: "KDC 대주제분류 코드 목록을 조회합니다.",
    schema: z.object({
      majorCode: z.string().optional().describe("대분류 코드 (0-9)"),
    }),
    handler: bookToolHandlers.getSubjectCodes,
  },
  {
    name: "search_detailed_kdc_codes",
    description: "상세 KDC 세부주제코드를 검색합니다 (dtl_kdc 파라미터용).",
    schema: schemas.searchDetailedKDCCodesSchema,
    handler: bookToolHandlers.searchDetailedKDCCodes,
  },
  {
    name: "search_detailed_region_codes",
    description: "상세 지역코드를 검색합니다 (dtl_region 파라미터용).",
    schema: schemas.searchDetailedRegionCodesSchema,
    handler: bookToolHandlers.searchDetailedRegionCodes,
  },
  {
    name: "search_items",
    description: "도서관별 장서/대출 데이터를 조회합니다.",
    schema: schemas.searchItemsSchema,
    handler: bookToolHandlers.searchItems,
  },
  {
    name: "get_mania_recommendations",
    description: "마니아를 위한 추천도서를 조회합니다.",
    schema: schemas.getManiaRecommendationsSchema,
    handler: bookToolHandlers.getManiaRecommendations,
  },
  {
    name: "get_reader_recommendations",
    description: "다독자를 위한 추천도서를 조회합니다.",
    schema: schemas.getReaderRecommendationsSchema,
    handler: bookToolHandlers.getReaderRecommendations,
  },
  {
    name: "get_book_keywords",
    description: "도서의 핵심 키워드 목록을 조회합니다.",
    schema: schemas.getBookKeywordsSchema,
    handler: bookToolHandlers.getBookKeywords,
  },
  {
    name: "get_book_usage_analysis",
    description: "도서별 이용 분석 정보를 조회합니다.",
    schema: schemas.getBookUsageAnalysisSchema,
    handler: bookToolHandlers.getBookUsageAnalysis,
  },
  {
    name: "search_popular_books_by_library",
    description: "도서관/지역별 인기대출 도서를 조회합니다.",
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
